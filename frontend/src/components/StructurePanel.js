import React from "react";

export default function StructurePanel({ accession }) {
  // MVP: Placeholder for future 3D structure viewer
  // You can integrate tools like Mol* or NGL Viewer later
  
  return (
    <div>
      <div style={{
        padding: "3rem 2rem",
        textAlign: "center",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "2px dashed #d1d5db"
      }}>
        <div style={{
          fontSize: "3rem",
          marginBottom: "1rem"
        }}>
          🧬
        </div>
        <h3 style={{
          fontSize: "1.25rem",
          marginBottom: "0.5rem",
          color: "#374151"
        }}>
          3D Structure Viewer
        </h3>
        <p style={{
          color: "#6b7280",
          marginBottom: "1.5rem"
        }}>
          Coming soon: Interactive 3D protein structure visualization
        </p>
        <div style={{
          fontSize: "0.9rem",
          color: "#9ca3af"
        }}>
          Accession: {accession}
        </div>
      </div>

      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        backgroundColor: "#eff6ff",
        borderRadius: "6px",
        borderLeft: "4px solid #3b82f6"
      }}>
        <p style={{
          margin: 0,
          color: "#1e40af",
          fontSize: "0.9rem"
        }}>
          <strong>Future features:</strong> PDB structure loading, interactive rotation, residue highlighting, and secondary structure visualization
        </p>
      </div>
    </div>
  );
}