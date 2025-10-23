// frontend/src/templates/sequence.js
import React, { useState, useEffect } from "react";
import DataViewer from "../components/DataViewer";
import GeneMetadataViewer from "../components/GeneMetadataViewer";

export default function SequenceTemplate({ pageContext }) {
  const [sequence, setSequence] = useState(pageContext.sequence || null);
  const [geneMetadata, setGeneMetadata] = useState([]);
  const [headerData, setHeaderData] = useState(null);
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

  // Fetch gene metadata and header data
  useEffect(() => {
    if (!sequence?.accession) return;

    const apiBase = process.env.GATSBY_API_URL;
    const accession = sequence.accession;

    async function fetchData() {
      try {
        // Fetch gene metadata (existing)
        const metadataRes = await fetch(`${apiBase}/gene-metadata/by-accession/${accession}`);
        if (metadataRes.ok) {
          const data = await metadataRes.json();
          setGeneMetadata(Array.isArray(data) ? data : [data]);
        }

        // Fetch header data for quick stats
        const headerRes = await fetch(`${apiBase}/gene-details/${accession}/header`);
        if (headerRes.ok) {
          const data = await headerRes.json();
          setHeaderData(data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
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
        
        {headerData && (
          <div style={{
            display: "flex",
            gap: "1.5rem",
            color: "#6b7280",
            fontSize: "0.95rem",
            marginTop: "1rem"
          }}>
            {headerData.origin_country && (
              <span>Origin: <strong>{headerData.origin_country}</strong></span>
            )}
            {headerData.temperature && (
              <span>Temperature: <strong>{headerData.temperature}°C</strong></span>
            )}
          </div>
        )}
        
        <p style={{
          color: "#6b7280",
          fontSize: "1rem",
          marginTop: "0.5rem"
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