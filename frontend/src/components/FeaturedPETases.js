import React, { useMemo } from "react";
import { Link } from "gatsby";

const FeaturedPETases = ({ sequences, loading }) => {
  // Hard-coded featured PETases
  const ISPETASE_ACCESSION = "WP_054022242.1";
  const FASTPETASE_ACCESSION = "WP_054022242.1_M1";

  // Find the hard-coded sequences
  const isPETase = sequences.find(seq => seq.accession === ISPETASE_ACCESSION);
  const fastPETase = sequences.find(seq => seq.accession === FASTPETASE_ACCESSION);

  // Select random PETase that meets criteria:
  // - in_gene_metadata === true
  // - in_sra_metadata === true
  // - not one of the two hard-coded ones
  const randomPETase = useMemo(() => {
    const eligible = sequences.filter(seq =>
      seq.in_gene_metadata === true &&
      seq.in_sra_metadata === true &&
      seq.accession !== ISPETASE_ACCESSION &&
      seq.accession !== FASTPETASE_ACCESSION
    );

    if (eligible.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * eligible.length);
    return eligible[randomIndex];
  }, [sequences]);

  // Helper to get display name (synonym or accession)
  const getDisplayName = (seq, fallbackLabel) => {
    if (!seq) return fallbackLabel;

    // If synonyms exist and is an array with at least one item
    if (seq.synonyms && Array.isArray(seq.synonyms) && seq.synonyms.length > 0) {
      return seq.synonyms[0];
    }

    return fallbackLabel;
  };

  // Render a single card
  const renderCard = (seq, label, badgeColor) => {
    if (!seq) {
      return (
        <div style={{
          flex: "1",
          minWidth: "250px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
            {loading ? "Loading..." : "Not found"}
          </p>
        </div>
      );
    }

    return (
      <Link
        to={`/sequence/${seq.accession}`}
        style={{
          flex: "1",
          minWidth: "250px",
          border: "2px solid #e2e8f0",
          borderRadius: "12px",
          padding: "1rem",
          backgroundColor: "white",
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "all 0.3s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
          e.currentTarget.style.borderColor = badgeColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }}
      >
        {/* Badge */}
        <div style={{
          backgroundColor: badgeColor,
          color: "white",
          padding: "0.25rem 0.625rem",
          borderRadius: "6px",
          fontSize: "0.7rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          letterSpacing: "0.5px"
        }}>
          {label}
        </div>

        {/* Structural icon placeholder */}
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: "0.7rem",
          textAlign: "center",
          padding: "0.25rem"
        }}>
          Structure View
          <br />
          (Coming Soon)
        </div>

        {/* Name/Label */}
        <h3 style={{
          fontSize: "1rem",
          fontWeight: "600",
          color: "#2c3e50",
          margin: "0 0 0.25rem 0",
          textAlign: "center"
        }}>
          {getDisplayName(seq, label)}
        </h3>

        {/* Accession */}
        <p style={{
          fontSize: "0.75rem",
          color: "#64748b",
          margin: "0",
          fontFamily: "monospace"
        }}>
          {seq.accession}
        </p>
      </Link>
    );
  };

  if (loading) {
    return (
      <section style={{
        marginBottom: "0.1rem",
        paddingTop: "0.1rem",
        paddingBottom: "1.25rem",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
        backgroundColor: "#f8fafc",
        borderRadius: "12px"
      }}>
        <h2 style={{
          fontSize: "0.5rem",
          color: "#2c3e50",
          marginBottom: "0.5rem",
          textAlign: "center"
        }}>
          Featured PETases
        </h2>
        <p style={{ textAlign: "center", color: "#64748b" }}>Loading featured PETases...</p>
      </section>
    );
  }

  return (
    <section style={{
      marginBottom: "2rem",
      paddingTop: "0.5rem",
      paddingBottom: "1.25rem",
      paddingLeft: "1.25rem",
      paddingRight: "1.25rem",
      backgroundColor: "#f8fafc",
      borderRadius: "12px"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        color: "#2c3e50",
        marginBottom: "1rem",
        textAlign: "center",
        fontWeight: "700"
      }}>
        Featured PETases
      </h2>

      <div style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        {renderCard(isPETase, "IsPETase", "#3b82f6")}
        {renderCard(fastPETase, "Fast-PETase", "#10b981")}
        {renderCard(randomPETase, "Featured PETase", "#f59e0b")}
      </div>
    </section>
  );
};

export default FeaturedPETases;
