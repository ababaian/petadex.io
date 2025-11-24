import React from "react";
import ProteinViewer from "./ProteinViewer";

export default function StructurePanel({ accession }) {
  return (
    <div>
      <div style={{
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "1rem",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <h3 style={{
            fontSize: "1.1rem",
            margin: 0,
            color: "#374151",
            fontWeight: "600"
          }}>
            3D Structure Viewer
          </h3>
        </div>

        <div style={{
          width: "100%",
          height: "500px",
          backgroundColor: "#ffffff"
        }}>
          <ProteinViewer accession={accession} width="100%" height="500px" />
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
          <strong>Tip:</strong> Click and drag to rotate the structure. Scroll to zoom in/out.
        </p>
      </div>
    </div>
  );
}