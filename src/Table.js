import React from "react";
import "./Table.css";

/* Daten kommen von tableDat (Wurden an Table übergeben und werden aus setTableData geladen) */
function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({country, cases}) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
