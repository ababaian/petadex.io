// frontend/src/components/SummaryStatistics.jsx
import React, { useState, useEffect } from 'react';

export default function SummaryStatistics({ accession }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accession) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/aa-seq-features/${accession}`);
        
        if (!response.ok) {
          throw new Error('Features not found');
        }
        
        const data = await response.json();
        
        // Calculate statistics from the arrays
        const calculatedStats = calculateStats(data);
        setStats(calculatedStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching features:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [accession]);

  const calculateStats = (data) => {
    const { mass, pi, hpath, sequence_length } = data;
    
    // Total mass: sum of all residue masses
    const totalMass = mass ? mass.reduce((sum, val) => sum + val, 0) : 0;
    
    // Average pI: mean of all pI values
    const avgPI = pi && pi.length > 0 
      ? pi.reduce((sum, val) => sum + val, 0) / pi.length 
      : 0;
    
    // % Hydrophobic residues: count residues with hpath > threshold (e.g., 0.5)
    const hydrophobicCount = hpath 
      ? hpath.filter(val => val > 0.5).length 
      : 0;
    const percentHydrophobic = sequence_length > 0 
      ? (hydrophobicCount / sequence_length) * 100 
      : 0;

    return {
      totalMass: totalMass.toFixed(2),
      avgPI: avgPI.toFixed(2),
      percentHydrophobic: percentHydrophobic.toFixed(1),
      sequenceLength: sequence_length
    };
  };

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

  if (error) {
    return (
      <div style={{
        padding: "1rem",
        backgroundColor: "#fef2f2",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        color: "#991b1b"
      }}>
        Unable to load statistics: {error}
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