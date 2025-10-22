// frontend/src/components/SequencePanel.jsx
import React from "react";
import SequenceViewer from "./SequenceViewer";
import SummaryStatistics from "./SummaryStatistics";

export default function SequencePanel({ sequence, accession }) {
  if (!sequence) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        color: "#666"
      }}>
        No sequence data available
      </div>
    );
  }

  return (
    <div>
      <SummaryStatistics accession={accession} />
      
      <div style={{ 
        marginBottom: "1rem",
        color: "#6b7280",
        fontSize: "0.9rem"
      }}>
        <strong>Length:</strong> {sequence.length} amino acids
      </div>
      
      <SequenceViewer 
        aminoAcidSequence={sequence}
        nucleotideSequence={null}
      />
    </div>
  );
}