import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'
import {
  MenuItem,
  FormControl,
  Select,
  Card, 
  CardContent
} from "@material-ui/core";
import Table from './Table'
import { sortData } from "./until"
import LineGraph from './LineGraph'
// Karte einbinden
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  // Default Auswahl
  // Zeight alle Daten an (Wenn nichts ausgewählt bzw Worldwide ist)

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // Länderausgabe:

  useEffect(() => {
    const getCountriesData = async () => {
      //API Quelle
      fetch("https://disease.sh/v3/covid-19/countries")
        // Daten der API werden in ein Json Format umgewandlet (Wie bei Joomla!)
        .then((response) => response.json())
        // Daten werden über die Schleife ausgegeben
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //United States, Germany (Ganze Namen)
            value: country.countryInfo.iso2, // UK, USA (Abkürzung)
          }));

          // Function kommt aus until.js (Helperdatei)
          const sortedData = sortData(data);

          // Daten für die Komponente Table.js
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  /* Länderauswahl speichern */

  const onCountryChange = async (event) => {
    /* Ländercode zB DE,UK beim klicken von Menüländer*/
    const countryCode = event.target.value;
    console.log("fsdfsdf", countryCode)
    setCountry(countryCode);


    /* URL Verteilung */
    const url =
      countryCode === "worldwide"
      //Ist countryCode Worldwide dann all (Zeigt alles an)
        ? "https://disease.sh/v3/covid-19/all"
        // Wenn nicht (https://disease.sh/v3/covid-19/countries/USa) Ländercodedaten abgerufen
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Die Funktionen kommen von useState()
        setCountry(countryCode);
        setCountryInfo(data);

        /* Greift auf Länge und Breitgrad zu und übergibt ihn */
        /* Springt zum ausgewählten Land */
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        setMapCountries(data)
      });
  };
    console.log("Länderinfo", countryInfo)
  return (
    <div className="app">
      <div className="app__left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
                {/* Gibt alle Länder als Menüpunkt (li) aus */}
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
      </div>

    <div className="app__stats">
      <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />    
      <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} /> 
      <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} /> 
    </div>
      
      <Map 
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
      />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} /> 
          <h3>Wordwide new cases</h3>   
          <LineGraph />
        </CardContent>        
      </Card>           
    </div>
  );
}

export default App;
