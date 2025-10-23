// frontend/src/components/ResearchContextPanel.js
import React, { useState } from "react";

export default function ResearchContextPanel({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "2rem",
      backgroundColor: "#fff"
    }}>
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 style={{
          fontSize: "1.5rem",
          margin: 0,
          color: "#2c3e50"
        }}>
          Research Context
        </h2>
        <span style={{
          fontSize: "1.5rem",
          color: "#6b7280"
        }}>
          {isExpanded ? "−" : "+"}
        </span>
      </div>

      {isExpanded && (
        <div style={{ marginTop: "1rem" }}>
          {data.bioproject && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>BioProject: </span>
              <a 
                href={`https://www.ncbi.nlm.nih.gov/bioproject/${data.bioproject}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {data.bioproject}
              </a>
            </div>
          )}

          {data.biosample && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>BioSample: </span>
              <a 
                href={`https://www.ncbi.nlm.nih.gov/biosample/${data.biosample}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {data.biosample}
              </a>
            </div>
          )}

          {data.sra_accession && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>SRA: </span>
              <a 
                href={`https://www.ncbi.nlm.nih.gov/sra/${data.sra_accession}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {data.sra_accession}
              </a>
            </div>
          )}

          {data.sra_study && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>SRA Study: </span>
              <a 
                href={`https://www.ncbi.nlm.nih.gov/sra/${data.sra_study}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {data.sra_study}
              </a>
            </div>
          )}

          {data.release_date && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>Release Date: </span>
              <span style={{ color: "#6b7280" }}>
                {new Date(data.release_date).toLocaleDateString()}
              </span>
            </div>
          )}

          {data.organism && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>Organism: </span>
              <span style={{ color: "#6b7280", fontStyle: "italic" }}>
                {data.organism}
              </span>
            </div>
          )}

          {data.biosample_model && (
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", color: "#374151" }}>BioSample Model: </span>
              <span style={{ color: "#6b7280" }}>{data.biosample_model}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}