import React, { useState, useEffect } from "react";
import SequenceViewer from "../components/SequenceViewer";

export default function ProteinPage() {
  const [accessions, setAccessions] = useState([]);
  const [selected, setSelected] = useState("");
  const [sequence, setSequence] = useState(null);
  const [error, setError] = useState(null);
  const apiBase = process.env.GATSBY_API_URL || "/api";

  useEffect(() => {
    fetch(`${apiBase}/fastaa`)
      .then(r => r.json())
      .then(data => setAccessions(data.map(d => d.accession)))
      .catch(e => setError(e.toString()));
  }, [apiBase]);

  useEffect(() => {
    if (!selected) return;
    fetch(`${apiBase}/fastaa/${selected}`)
      .then(r => r.json())
      .then(data => setSequence(data.sequence))
      .catch(e => setError(e.toString()));
  }, [selected, apiBase]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Protein Lookup</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="accession" style={{ marginRight: "0.5rem" }}>Select Accession:</label>
        <select
          id="accession"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="">-- choose --</option>
          {accessions.map(acc => (
            <option key={acc} value={acc}>{acc}</option>
          ))}
        </select>
      </div>

      {sequence && (
        <SequenceViewer sequence={sequence} />
      )}
    </main>
  );
}