import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import SequenceViewer from "../components/SequenceViewer";

const FastaaPage = () => {
  const [sequences, setSequences] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = process.env.GATSBY_API_URL;
  const endpoint = `${apiBase}/api/fastaa`;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setSequences(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [endpoint]);

  // Filter sequences based on search input
  const filteredSequences = searchInput
    ? sequences.filter(seq => 
        seq.accession.toLowerCase().includes(searchInput.toLowerCase())
      )
    : sequences;

  if (loading) return <p style={{ padding: "2rem", textAlign: "center" }}>Loading sequences…</p>;
  if (error) return <p style={{ color: "red", padding: "2rem" }}>Error: {error}</p>;

  return (
    <main style={{ 
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem"
    }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ 
          fontSize: "2.5rem",
          marginBottom: "0.5rem",
          color: "#2c3e50"
        }}>PETase Database</h1>
        <p style={{ 
          color: "#666", 
          fontSize: "1.1rem",
          marginBottom: "1.5rem"
        }}>
          Search and browse plastic-degrading enzymes
        </p>
        
        {/* Search input */}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by accession number (e.g., P80146.3)"
          style={{ 
            padding: "0.75rem",
            fontSize: "1rem",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "4px",
            border: "1px solid #cbd5e1",
            outline: "none"
          }}
        />
        
        <p style={{ 
          color: "#666", 
          marginTop: "1rem",
          fontSize: "0.9rem"
        }}>
          {searchInput 
            ? `Found ${filteredSequences.length} matching sequence${filteredSequences.length !== 1 ? 's' : ''}`
            : `Total sequences: ${sequences.length}`
          }
        </p>
      </header>

      {filteredSequences.length === 0 && searchInput && (
        <div style={{ 
          padding: "2rem",
          textAlign: "center",
          color: "#666",
          backgroundColor: "#f8fafc",
          borderRadius: "8px"
        }}>
          No sequences found matching "{searchInput}"
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredSequences.map((seq) => (
          <li
            key={seq.accession}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1rem",
              backgroundColor: "white",
              boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
              transition: "box-shadow 0.2s"
            }}
          >
            <Link 
              to={`/sequence/${seq.accession}`}
              style={{ 
                textDecoration: "none", 
                color: "inherit",
                display: "block"
              }}
            >
              <h2 style={{ 
                margin: "0 0 1rem 0",
                color: "#2c3e50",
                fontSize: "1.5rem"
              }}>
              {seq.accession}
              </h2>
              <SequenceViewer 
                aminoAcidSequence={seq.sequence}
                nucleotideSequence={null}
              />
              
              {/* Additional metadata if available */}
              {(seq.source || seq.synonyms) && (
                <div style={{ 
                  marginTop: "1rem", 
                  fontSize: "0.9rem", 
                  color: "#666" 
                }}>
                  {seq.source && (
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Source:</strong> {seq.source}
                    </p>
                  )}
                  {seq.synonyms && (
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Synonyms:</strong> {seq.synonyms}
                    </p>
                  )}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default FastaaPage;