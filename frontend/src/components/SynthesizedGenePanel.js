// src/components/SynthesizedGenePanel.js
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function SynthesizedGenePanel({ geneMetadata, plateData }) {
  const [expandedGenes, setExpandedGenes] = useState({});

  if (!geneMetadata || geneMetadata.length === 0) {
    return null;
  }

  const toggleGene = (geneId) => {
    setExpandedGenes(prev => ({
      ...prev,
      [geneId]: !prev[geneId]
    }));
  };

  // Transform plate data for Recharts
  const transformPlateDataForChart = (plateDataArray) => {
    if (!Array.isArray(plateDataArray) || plateDataArray.length === 0) return [];

    // Group by timepoint and media
    const grouped = {};

    plateDataArray.forEach(plate => {
      const timepoint = plate.timepoint_hours;
      const media = plate.media || 'Unknown';

      if (!grouped[timepoint]) {
        grouped[timepoint] = { timepoint };
      }

      // Average if there are multiple plates with same timepoint and media
      if (grouped[timepoint][media]) {
        grouped[timepoint][media] = (grouped[timepoint][media] + plate.average_readout) / 2;
      } else {
        grouped[timepoint][media] = plate.average_readout;
      }
    });

    // Convert to array and sort by timepoint
    return Object.values(grouped).sort((a, b) => a.timepoint - b.timepoint);
  };

  // Get unique media types for line colors
  const getUniqueMediaTypes = (plateDataArray) => {
    if (!Array.isArray(plateDataArray)) return [];
    const mediaSet = new Set(plateDataArray.map(p => p.media).filter(Boolean));
    return Array.from(mediaSet);
  };

  // Color palette for different media types
  const mediaColors = {
    'BHET12.5': '#2E86AB',
    'BHET25': '#A23B72',
    'BHET50': '#F18F01',
    'default': '#059669'
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
        const genePlateData = plateData?.[geneKey];

        // Calculate overall average across all plates
        const overallAverage = Array.isArray(genePlateData) && genePlateData.length > 0
          ? genePlateData.reduce((sum, plate) => sum + (plate.average_readout || 0), 0) / genePlateData.length
          : null;

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
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", flex: "1" }}>
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
                {Array.isArray(genePlateData) && genePlateData.length > 0 && (
                  <div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      Plates ({genePlateData.length})
                    </span>
                    <div style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#059669"
                    }}>
                      Avg: {overallAverage?.toFixed(3) || 'N/A'}
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
                  flexShrink: 0,
                  marginLeft: "1rem"
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

                {/* Plate Data Visualization */}
                {Array.isArray(genePlateData) && genePlateData.length > 0 && (() => {
                  const chartData = transformPlateDataForChart(genePlateData);
                  const mediaTypes = getUniqueMediaTypes(genePlateData);

                  return (
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
                        Activity Time Course ({genePlateData.length} {genePlateData.length === 1 ? 'plate' : 'plates'})
                      </div>

                      {/* Line Chart */}
                      <div style={{
                        backgroundColor: "white",
                        borderRadius: "4px",
                        padding: "1rem",
                        marginBottom: "1rem"
                      }}>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                              dataKey="timepoint"
                              label={{ value: 'Time (hours)', position: 'insideBottom', offset: -10, style: { fontWeight: 'bold' } }}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              label={{ value: 'Median Pixel Intensity', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #86efac',
                                borderRadius: '4px',
                                fontSize: '0.875rem'
                              }}
                              formatter={(value) => value?.toFixed(4)}
                            />
                            <Legend
                              wrapperStyle={{ fontSize: '0.875rem', paddingTop: '10px' }}
                            />
                            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" strokeWidth={1} />

                            {mediaTypes.map((media) => (
                              <Line
                                key={media}
                                type="monotone"
                                dataKey={media}
                                stroke={mediaColors[media] || mediaColors.default}
                                strokeWidth={2.5}
                                dot={{ fill: mediaColors[media] || mediaColors.default, r: 5 }}
                                activeDot={{ r: 7 }}
                                name={media}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Summary Statistics */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        backgroundColor: "#dcfce7",
                        borderRadius: "4px",
                        padding: "0.75rem"
                      }}>
                        {mediaTypes.map(media => {
                          const mediaPlates = genePlateData.filter(p => p.media === media);
                          const avgReadout = mediaPlates.reduce((sum, p) => sum + (p.average_readout || 0), 0) / mediaPlates.length;
                          const maxReadout = Math.max(...mediaPlates.map(p => p.average_readout || 0));
                          const minReadout = Math.min(...mediaPlates.map(p => p.average_readout || 0));

                          return (
                            <div key={media} style={{
                              backgroundColor: "white",
                              borderRadius: "4px",
                              padding: "0.75rem",
                              border: `2px solid ${mediaColors[media] || mediaColors.default}`
                            }}>
                              <div style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                color: "#065f46",
                                marginBottom: "0.5rem"
                              }}>
                                {media}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#059669", marginBottom: "0.25rem" }}>
                                Avg: <strong>{avgReadout.toFixed(4)}</strong>
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#059669", marginBottom: "0.25rem" }}>
                                Max: <strong>{maxReadout.toFixed(4)}</strong>
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#059669" }}>
                                Min: <strong>{minReadout.toFixed(4)}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Data Table (Collapsible) */}
                      <details style={{ marginTop: "1rem" }}>
                        <summary style={{
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#065f46",
                          padding: "0.5rem",
                          backgroundColor: "#dcfce7",
                          borderRadius: "4px"
                        }}>
                          View Detailed Plate Data
                        </summary>
                        <div style={{
                          overflowX: "auto",
                          marginTop: "0.5rem"
                        }}>
                          <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "0.875rem"
                          }}>
                            <thead>
                              <tr style={{
                                backgroundColor: "#dcfce7",
                                borderBottom: "2px solid #86efac"
                              }}>
                                <th style={{
                                  padding: "0.5rem",
                                  textAlign: "left",
                                  fontWeight: "600",
                                  color: "#065f46"
                                }}>Plate</th>
                                <th style={{
                                  padding: "0.5rem",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#065f46"
                                }}>Timepoint (hrs)</th>
                                <th style={{
                                  padding: "0.5rem",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#065f46"
                                }}>Avg Readout</th>
                                <th style={{
                                  padding: "0.5rem",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#065f46"
                                }}>Samples</th>
                                <th style={{
                                  padding: "0.5rem",
                                  textAlign: "left",
                                  fontWeight: "600",
                                  color: "#065f46"
                                }}>Media</th>
                              </tr>
                            </thead>
                            <tbody>
                              {genePlateData.map((plate, plateIndex) => (
                                <tr key={plateIndex} style={{
                                  borderBottom: "1px solid #d1fae5"
                                }}>
                                  <td style={{
                                    padding: "0.5rem",
                                    fontFamily: "monospace",
                                    color: "#059669"
                                  }}>
                                    {plate.plate}
                                  </td>
                                  <td style={{
                                    padding: "0.5rem",
                                    textAlign: "right",
                                    fontFamily: "monospace",
                                    color: "#065f46"
                                  }}>
                                    {plate.timepoint_hours ?? 'N/A'}
                                  </td>
                                  <td style={{
                                    padding: "0.5rem",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    fontFamily: "monospace",
                                    color: "#065f46"
                                  }}>
                                    {plate.average_readout?.toFixed(4) || 'N/A'}
                                  </td>
                                  <td style={{
                                    padding: "0.5rem",
                                    textAlign: "right",
                                    fontFamily: "monospace",
                                    color: "#065f46"
                                  }}>
                                    {plate.sample_count}
                                  </td>
                                  <td style={{
                                    padding: "0.5rem",
                                    color: "#065f46",
                                    fontSize: "0.8rem"
                                  }}>
                                    {plate.media || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    </div>
                  );
                })()}

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