// frontend/src/components/DataViewer.js
import React, { useState } from "react";
import SequencePanel from "./SequencePanel";
import StructurePanel from "./StructurePanel";
import MetadataPanel from "./MetadataPanel";

export default function DataViewer({ sequence, accession, metadata }) {
  const [activeTab, setActiveTab] = useState("sequence");

  const tabs = [
    { id: "sequence", label: "Sequence" },
    { id: "structure", label: "Structure" },
    { id: "metadata", label: "Metadata" },
  ];

  const renderPanel = () => {
    switch (activeTab) {
      case "sequence":
        return <SequencePanel sequence={sequence} accession={accession} />;
      case "structure":
        return <StructurePanel accession={accession} />;
      case "metadata":
        return <MetadataPanel metadata={metadata} accession={accession} />;
      default:
        return <SequencePanel sequence={sequence} accession={accession} />;
    }
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
      overflow: "hidden"
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        borderBottom: "2px solid #e5e7eb",
        backgroundColor: "#f9fafb"
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: activeTab === tab.id ? "600" : "400",
              color: activeTab === tab.id ? "#0366d6" : "#6b7280",
              backgroundColor: activeTab === tab.id ? "white" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #0366d6" : "none",
              marginBottom: activeTab === tab.id ? "-2px" : "0",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "#f3f4f6";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div style={{ padding: "1.5rem" }}>
        {renderPanel()}
      </div>
    </div>
  );
}