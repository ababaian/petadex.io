import React, { useState, useEffect } from "react";
import SequenceViewer from "../components/SequenceViewer";

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
      </header>

      <div style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)"
      }}>
        <SequenceViewer 
          aminoAcidSequence={sequence.sequence}
          nucleotideSequence={null}
        />
      </div>

      <div style={{ 
        marginTop: "2rem", 
        color: "#666",
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)"
      }}>
        <p style={{ margin: "0.5rem 0" }}>
          <strong>Source:</strong> {sequence.source || 'Not specified'}
        </p>
        {sequence.synonyms && (
          <p style={{ margin: "0.5rem 0" }}>
            <strong>Synonyms:</strong> {sequence.synonyms}
          </p>
        )}
        {sequence.date_entered && (
          <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
            Added: {new Date(sequence.date_entered).toLocaleString()}
          </p>
        )}
      </div>

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