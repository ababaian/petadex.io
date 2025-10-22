import React from "react";

export default function MetadataPanel({ metadata }) {
  if (!metadata) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        color: "#666"
      }}>
        No metadata available
      </div>
    );
  }

  const metadataItems = [
    { label: "Accession", value: metadata.accession },
    { label: "Source", value: metadata.source || "Not specified" },
    { label: "Synonyms", value: metadata.synonyms || "None" },
    { label: "Sequence Length", value: metadata.sequence ? `${metadata.sequence.length} amino acids` : "N/A" },
    { label: "Date Added", value: metadata.date_entered ? new Date(metadata.date_entered).toLocaleString() : "Unknown" },
  ];

  return (
    <div>
      <h3 style={{
        fontSize: "1.25rem",
        marginBottom: "1.5rem",
        color: "#374151"
      }}>
        Sequence Information
      </h3>

      <div style={{
        display: "grid",
        gap: "1rem"
      }}>
        {metadataItems.map((item, index) => (
          <div 
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              borderLeft: "3px solid #e5e7eb"
            }}
          >
            <div style={{
              fontWeight: "600",
              color: "#374151"
            }}>
              {item.label}
            </div>
            <div style={{
              color: "#6b7280",
              wordBreak: "break-word"
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "#f0fdf4",
        borderRadius: "6px",
        borderLeft: "4px solid #22c55e"
      }}>
        <h4 style={{
          margin: "0 0 0.5rem 0",
          color: "#166534",
          fontSize: "1rem"
        }}>
          Additional Properties
        </h4>
        <p style={{
          margin: 0,
          color: "#15803d",
          fontSize: "0.9rem"
        }}>
          Future: Enzyme classification, catalytic activity, optimal conditions, related sequences
        </p>
      </div>
    </div>
  );
}