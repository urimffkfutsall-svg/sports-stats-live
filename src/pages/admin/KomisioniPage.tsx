import React, { useState } from "react";

const KomisioniPage = () => {
  const [vendimet, setVendimet] = useState([
    { id: 1, vendimi: "", pershkrimi: "", java: "" },
  ]);

  const shtoVendim = () => {
    setVendimet([
      ...vendimet,
      { id: vendimet.length + 1, vendimi: "", pershkrimi: "", java: "" },
    ]);
  };

  return (
    <div>
      <h2>Vendimet e Komisionit</h2>
      <button onClick={shtoVendim}>+ Shto Vendim</button>
      <table>
        <thead>
          <tr>
            <th>Vendimi</th>
            <th>Pershkrimi</th>
            <th>Java e Vendimit</th>
          </tr>
        </thead>
        <tbody>
          {vendimet.map((v) => (
            <tr key={v.id}>
              <td><input type="text" placeholder="Vendimi" /></td>
              <td><input type="text" placeholder="Pershkrimi" /></td>
              <td><input type="text" placeholder="Java" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KomisioniPage;
