import React, { useState, useEffect } from "react";
import DataViewer from "../components/DataViewer";
import GeneMetadataViewer from "../components/GeneMetadataViewer";

export default function SequenceTemplate({ pageContext }) {
  const [sequence, setSequence] = useState(pageContext.sequence || null);
  const [geneMetadata, setGeneMetadata] = useState([]);
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

  // Fetch gene metadata based on accession
  useEffect(() => {
    if (!sequence?.accession) return;

    const apiBase = process.env.GATSBY_API_URL;

    async function fetchGeneMetadata() {
      try {
        const res = await fetch(`${apiBase}/gene-metadata/by-accession/${sequence.accession}`);
        if (res.ok) {
          const data = await res.json();
          // Handle both single object and array responses
          setGeneMetadata(Array.isArray(data) ? data : [data]);
        }
        // If 404, that's fine - not all sequences have gene metadata
      } catch (err) {
        console.error('Error fetching gene metadata:', err);
        // Don't set error state, just log it
      }
    }

    fetchGeneMetadata();
  }, [sequence?.accession]);

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
        }}>
          <a 
            href={`https://www.ncbi.nlm.nih.gov/protein/${sequence.accession}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2c3e50",
              textDecoration: "none",
              borderBottom: "2px solid #3b82f6"
            }}
          >
            {sequence.accession}
          </a>
        </h1>
        
        <p style={{
          color: "#6b7280",
          fontSize: "1rem"
        }}>
          Plastic-degrading enzyme sequence
        </p>
      </header>

      <GeneMetadataViewer geneMetadata={geneMetadata} />

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