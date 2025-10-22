import React, { useState, useEffect } from "react";
import DataViewer from "../components/DataViewer";

export default function SequenceTemplate({ pageContext }) {
  const [sequence, setSequence] = useState(pageContext.sequence || null);
  const [loading, setLoading] = useState(!pageContext.sequence);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have data from pageContext, don't fetch
    if (pageContext.sequence) {
      return;
    }

    // Otherwise, get accession from URL and fetch from API
    const path = window.location.pathname;
    const match = path.match(/\/sequence\/([^/]+)/);
    
    if (!match) {
      setError("Invalid sequence URL");
      setLoading(false);
      return;
    }

    const accession = match[1];
    const apiBase = process.env.GATSBY_API_URL;

    async function fetchSequence() {
      try {
        const res = await fetch(`${apiBase}/fastaa/${accession}`);
        if (!res.ok) throw new Error(`Sequence not found: ${accession}`);
        const data = await res.json();
        setSequence(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }

    fetchSequence();
  }, [pageContext.sequence]);

  if (loading) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        color: "#666"
      }}>
        Loading sequence...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        color: "#dc2626"
      }}>
        Error: {error}
      </div>
    );
  }

  if (!sequence) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        color: "#666"
      }}>
        Sequence not found
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem"
    }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ 
          fontSize: "2.5rem",
          marginBottom: "0.5rem",
          color: "#2c3e50"
        }}>{sequence.accession}</h1>
        <p style={{
          color: "#6b7280",
          fontSize: "1rem"
        }}>
          Plastic-degrading enzyme sequence
        </p>
      </header>

      <DataViewer 
        sequence={sequence.sequence}
        accession={sequence.accession}
        metadata={sequence}
      />

      <footer style={{
        marginTop: "3rem",
        textAlign: "center",
        color: "#666",
        fontSize: "0.9rem"
      }}>
        © {new Date().getFullYear()} PETadex.io
      </footer>
    </div>
  );
}