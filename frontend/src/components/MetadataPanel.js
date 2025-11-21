// frontend/src/components/MetadataPanel.js
import React, { useState, useEffect } from "react";

export default function MetadataPanel({ metadata, accession }) {
  const [originData, setOriginData] = useState(null);
  const [researchData, setResearchData] = useState(null);
  const [researchExpanded, setResearchExpanded] = useState(false);

  useEffect(() => {
    if (!accession) return;

    const apiBase = process.env.GATSBY_API_URL;

    async function fetchMetadata() {
      try {
        // Fetch origin data
        const originRes = await fetch(`${apiBase}/gene-details/${accession}/origin`);
        if (originRes.ok) {
          const data = await originRes.json();
          setOriginData(data);
        }

        // Fetch research context
        const researchRes = await fetch(`${apiBase}/gene-details/${accession}/research`);
        if (researchRes.ok) {
          const data = await researchRes.json();
          setResearchData(data);
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    }

    fetchMetadata();
  }, [accession]);

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

  const hasCoordinates = originData?.latitude && originData?.longitude;

  return (
    <div>
      {/* Basic Sequence Information */}
      <h3 style={{
        fontSize: "1.25rem",
        marginBottom: "1.5rem",
        color: "#374151"
      }}>
        Sequence Information
      </h3>

      <div style={{
        display: "grid",
        gap: "1rem",
        marginBottom: "2rem"
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

      {/* Origin & Discovery Section */}
      {originData && (
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{
            fontSize: "1.25rem",
            marginBottom: "1.5rem",
            color: "#374151"
          }}>
            Origin & Discovery
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: hasCoordinates ? "1fr 1fr" : "1fr",
            gap: "1.5rem"
          }}>
            <div style={{
              display: "grid",
              gap: "1rem"
            }}>
              {originData.country && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Country</div>
                  <div style={{ color: "#6b7280" }}>{originData.country}</div>
                </div>
              )}
              {originData.continent && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Continent</div>
                  <div style={{ color: "#6b7280" }}>{originData.continent}</div>
                </div>
              )}
              {originData.biome && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Biome</div>
                  <div style={{ color: "#6b7280" }}>{originData.biome}</div>
                </div>
              )}
              {originData.collection_date && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Collection Date</div>
                  <div style={{ color: "#6b7280" }}>
                    {new Date(originData.collection_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {originData.source_organism && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Source Organism</div>
                  <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                    {originData.source_organism}
                  </div>
                </div>
              )}
              {originData.elevation && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Elevation</div>
                  <div style={{ color: "#6b7280" }}>{originData.elevation}m</div>
                </div>
              )}
              {originData.location_name && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Location</div>
                  <div style={{ color: "#6b7280" }}>{originData.location_name}</div>
                </div>
              )}
            </div>

            {hasCoordinates && (
              <div style={{
                height: "400px",
                backgroundColor: "#f3f4f6",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid #e5e7eb"
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${originData.longitude-0.1},${originData.latitude-0.1},${originData.longitude+0.1},${originData.latitude+0.1}&layer=mapnik&marker=${originData.latitude},${originData.longitude}`}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Research Context Section */}
      {researchData && (
        <div style={{ marginBottom: "2rem" }}>
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              borderLeft: "3px solid #e5e7eb",
              marginBottom: researchExpanded ? "1rem" : "0"
            }}
            onClick={() => setResearchExpanded(!researchExpanded)}
          >
            <h3 style={{
              fontSize: "1.25rem",
              margin: 0,
              color: "#374151"
            }}>
              Research Context
            </h3>
            <span style={{
              fontSize: "1.5rem",
              color: "#6b7280",
              fontWeight: "300"
            }}>
              {researchExpanded ? "−" : "+"}
            </span>
          </div>

          {researchExpanded && (
            <div style={{
              display: "grid",
              gap: "1rem"
            }}>
              {researchData.bioproject && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>BioProject</div>
                  <div>
                    <a 
                      href={`https://www.ncbi.nlm.nih.gov/bioproject/${researchData.bioproject}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3b82f6", textDecoration: "none" }}
                    >
                      {researchData.bioproject}
                    </a>
                  </div>
                </div>
              )}

              {researchData.biosample && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>BioSample</div>
                  <div>
                    <a 
                      href={`https://www.ncbi.nlm.nih.gov/biosample/${researchData.biosample}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3b82f6", textDecoration: "none" }}
                    >
                      {researchData.biosample}
                    </a>
                  </div>
                </div>
              )}

              {researchData.sra_accession && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>SRA</div>
                  <div>
                    <a 
                      href={`https://www.ncbi.nlm.nih.gov/sra/${researchData.sra_accession}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3b82f6", textDecoration: "none" }}
                    >
                      {researchData.sra_accession}
                    </a>
                  </div>
                </div>
              )}

              {researchData.sra_study && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>SRA Study</div>
                  <div>
                    <a 
                      href={`https://www.ncbi.nlm.nih.gov/sra/${researchData.sra_study}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3b82f6", textDecoration: "none" }}
                    >
                      {researchData.sra_study}
                    </a>
                  </div>
                </div>
              )}

              {researchData.release_date && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Release Date</div>
                  <div style={{ color: "#6b7280" }}>
                    {new Date(researchData.release_date).toLocaleDateString()}
                  </div>
                </div>
              )}

              {researchData.organism && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>Organism</div>
                  <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                    {researchData.organism}
                  </div>
                </div>
              )}

              {researchData.biosample_model && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  borderLeft: "3px solid #e5e7eb"
                }}>
                  <div style={{ fontWeight: "600", color: "#374151" }}>BioSample Model</div>
                  <div style={{ color: "#6b7280" }}>{researchData.biosample_model}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Additional Properties Info */}
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