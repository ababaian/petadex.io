// frontend/src/components/SummaryStatistics.jsx
import React from 'react';

export default function SummaryStatistics({ stats, loading }) {
  if (loading) {
    return (
      <div style={{
        padding: "1rem",
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem",
        marginBottom: "1rem"
      }}>
        Loading statistics...
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div style={{
      padding: "1rem",
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      border: "1px solid #e5e7eb"
    }}>
      <h3 style={{
        margin: "0 0 0.75rem 0",
        fontSize: "1rem",
        fontWeight: "600",
        color: "#111827"
      }}>
        Summary Statistics
      </h3>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "0.75rem"
      }}>
        <StatItem 
          label="Total Mass" 
          value={`${stats.totalMass} Da`}
        />
        <StatItem 
          label="Average pI" 
          value={stats.avgPI}
        />
        <StatItem 
          label="Hydrophobic" 
          value={`${stats.percentHydrophobic}%`}
        />
        <StatItem 
          label="Length" 
          value={`${stats.sequenceLength} aa`}
        />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <div style={{
        fontSize: "0.75rem",
        color: "#6b7280",
        marginBottom: "0.25rem"
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "1.125rem",
        fontWeight: "600",
        color: "#111827"
      }}>
        {value}
      </div>
    </div>
  );
}