import React, { useState, useEffect } from "react";

const FastaaPage = () => {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = process.env.GATSBY_API_URL;
  const endpoint = `${apiBase}/fastaa`;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setSequences(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [endpoint]);

  if (loading) return <p>Loading sequences…</p>;
  if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Fastaa Sequences</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sequences.map((seq) => (
          <li
            key={seq.accession}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "1rem",
              background: "#fafafa"
            }}
          >
            <h2 style={{ margin: 0 }}>{seq.accession}</h2>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {seq.sequence}
            </pre>
            <small>
              Created at: {new Date(seq.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default FastaaPage;

