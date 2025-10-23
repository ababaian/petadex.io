// src/components/GeneMetadataViewer.js
import React, { useState, useEffect } from "react";

export default function GeneMetadataViewer({ geneMetadata }) {
  const [expandedGenes, setExpandedGenes] = useState({});
  const [plateData, setPlateData] = useState({});

  useEffect(() => {
    if (!geneMetadata || geneMetadata.length === 0) return;

    const apiBase = process.env.GATSBY_API_URL;

    // Fetch plate data for each gene
    async function fetchPlateData() {
      const dataPromises = geneMetadata.map(async (gene) => {
        if (!gene.gene) return null;
        
        try {
          const res = await fetch(`${apiBase}/plate-data/gene/${gene.gene}/average`);
          if (res.ok) {
            const data = await res.json();
            return { geneId: gene.gene, data };
          }
        } catch (err) {
          console.error(`Error fetching plate data for ${gene.gene}:`, err);
        }
        return null;
      });

      const results = await Promise.all(dataPromises);
      const dataMap = {};
      results.forEach(result => {
        if (result) {
          dataMap[result.geneId] = result.data;
        }
      });
      setPlateData(dataMap);
    }

    fetchPlateData();
  }, [geneMetadata]);

  if (!geneMetadata || geneMetadata.length === 0) {
    return null;
  }

  const toggleGene = (geneId) => {
    setExpandedGenes(prev => ({
      ...prev,
      [geneId]: !prev[geneId]
    }));
  };

  return (
    <div style={{
      backgroundColor: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "2rem"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "1rem",
        marginTop: "0"
      }}>
        Synthesized Genes
      </h2>

      {geneMetadata.map((gene, index) => {
        const geneKey = gene.gene || `gene-${index}`;
        const isExpanded = expandedGenes[geneKey];
        const genePlateData = plateData[geneKey];

        return (
          <div 
            key={geneKey}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              marginBottom: index < geneMetadata.length - 1 ? "1rem" : "0",
              overflow: "hidden"
            }}
          >
            {/* Header - always visible */}
            <button
              onClick={() => toggleGene(geneKey)}
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                {gene.gene && (
                  <div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      Gene ID
                    </span>
                    <div style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#1f2937",
                      fontFamily: "monospace"
                    }}>
                      {gene.gene}
                    </div>
                  </div>
                )}
                {gene.nickname && (
                  <div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      Nickname
                    </span>
                    <div style={{
                      fontSize: "1.125rem",
                      color: "#4b5563"
                    }}>
                      {gene.nickname}
                    </div>
                  </div>
                )}
                {genePlateData && (
                  <div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      Avg Readout
                    </span>
                    <div style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#059669"
                    }}>
                      {genePlateData.average_readout?.toFixed(3) || 'N/A'}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Expand/collapse icon */}
              <svg
                style={{
                  width: "20px",
                  height: "20px",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  flexShrink: 0
                }}
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expandable content */}
            {isExpanded && (
              <div style={{ padding: "0 1.25rem 1.25rem 1.25rem" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb"
                }}>
                  {gene.batch && (
                    <div>
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        marginBottom: "0.25rem"
                      }}>
                        Batch
                      </div>
                      <div style={{
                        fontSize: "1rem",
                        color: "#1f2937",
                        fontFamily: "monospace"
                      }}>
                        {gene.batch}
                      </div>
                    </div>
                  )}

                  {gene.genetic_code && (
                    <div>
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        marginBottom: "0.25rem"
                      }}>
                        Genetic Code
                      </div>
                      <div style={{
                        fontSize: "1rem",
                        color: "#1f2937"
                      }}>
                        {gene.genetic_code}
                      </div>
                    </div>
                  )}

                  {gene.date_entered && (
                    <div>
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        marginBottom: "0.25rem"
                      }}>
                        Date Entered
                      </div>
                      <div style={{
                        fontSize: "1rem",
                        color: "#1f2937"
                      }}>
                        {new Date(gene.date_entered).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Plate Data Statistics */}
                {genePlateData && (
                  <div style={{
                    marginTop: "1rem",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "6px",
                    padding: "1rem"
                  }}>
                    <div style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#065f46",
                      marginBottom: "0.75rem"
                    }}>
                      Plate Assay Results
                    </div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "1rem"
                    }}>
                      <div>
                        <div style={{
                          fontSize: "0.75rem",
                          color: "#059669",
                          marginBottom: "0.25rem"
                        }}>
                          Average Readout
                        </div>
                        <div style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          color: "#065f46",
                          fontFamily: "monospace"
                        }}>
                          {genePlateData.average_readout?.toFixed(3) || 'N/A'}
                        </div>
                      </div>
                      {genePlateData.sample_count && (
                        <div>
                          <div style={{
                            fontSize: "0.75rem",
                            color: "#059669",
                            marginBottom: "0.25rem"
                          }}>
                            Sample Count
                          </div>
                          <div style={{
                            fontSize: "1.25rem",
                            fontWeight: "600",
                            color: "#065f46",
                            fontFamily: "monospace"
                          }}>
                            {genePlateData.sample_count}
                          </div>
                        </div>
                      )}
                      {genePlateData.measurement_type && (
                        <div>
                          <div style={{
                            fontSize: "0.75rem",
                            color: "#059669",
                            marginBottom: "0.25rem"
                          }}>
                            Measurement Type
                          </div>
                          <div style={{
                            fontSize: "1rem",
                            color: "#065f46"
                          }}>
                            {genePlateData.measurement_type}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {gene.orf_nt_sequence && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#6b7280",
                      marginBottom: "0.5rem"
                    }}>
                      ORF Nucleotide Sequence
                    </div>
                    <div style={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                      color: "#374151",
                      wordBreak: "break-all",
                      lineHeight: "1.6",
                      maxHeight: "200px",
                      overflowY: "auto"
                    }}>
                      {gene.orf_nt_sequence}
                    </div>
                  </div>
                )}

                {(gene.left_homology_arm || gene.right_homology_arm) && (
                  <div style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: gene.left_homology_arm && gene.right_homology_arm ? "1fr 1fr" : "1fr",
                    gap: "1rem"
                  }}>
                    {gene.left_homology_arm && (
                      <div>
                        <div style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#6b7280",
                          marginBottom: "0.5rem"
                        }}>
                          Left Homology Arm
                        </div>
                        <div style={{
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "4px",
                          padding: "0.75rem",
                          fontSize: "0.875rem",
                          fontFamily: "monospace",
                          color: "#374151",
                          wordBreak: "break-all",
                          lineHeight: "1.6"
                        }}>
                          {gene.left_homology_arm}
                        </div>
                      </div>
                    )}

                    {gene.right_homology_arm && (
                      <div>
                        <div style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#6b7280",
                          marginBottom: "0.5rem"
                        }}>
                          Right Homology Arm
                        </div>
                        <div style={{
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "4px",
                          padding: "0.75rem",
                          fontSize: "0.875rem",
                          fontFamily: "monospace",
                          color: "#374151",
                          wordBreak: "break-all",
                          lineHeight: "1.6"
                        }}>
                          {gene.right_homology_arm}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}