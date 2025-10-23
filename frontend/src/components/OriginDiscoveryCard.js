// frontend/src/components/OriginDiscoveryCard.js
import React from "react";

export default function OriginDiscoveryCard({ data }) {
  const hasCoordinates = data.latitude && data.longitude;

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "2rem",
      backgroundColor: "#fff"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        marginBottom: "1rem",
        color: "#2c3e50"
      }}>
        Origin & Discovery
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: hasCoordinates ? "1fr 1fr" : "1fr",
        gap: "1.5rem"
      }}>
        <div>
          <div style={{ marginBottom: "1rem" }}>
            {data.country && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Country: </span>
                <span style={{ color: "#6b7280" }}>{data.country}</span>
              </div>
            )}
            {data.continent && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Continent: </span>
                <span style={{ color: "#6b7280" }}>{data.continent}</span>
              </div>
            )}
            {data.biome && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Biome: </span>
                <span style={{ color: "#6b7280" }}>{data.biome}</span>
              </div>
            )}
            {data.collection_date && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Collection Date: </span>
                <span style={{ color: "#6b7280" }}>
                  {new Date(data.collection_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {data.source_organism && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Source Organism: </span>
                <span style={{ color: "#6b7280", fontStyle: "italic" }}>
                  {data.source_organism}
                </span>
              </div>
            )}
            {data.elevation && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Elevation: </span>
                <span style={{ color: "#6b7280" }}>{data.elevation}m</span>
              </div>
            )}
            {data.location_name && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>Location: </span>
                <span style={{ color: "#6b7280" }}>{data.location_name}</span>
              </div>
            )}
          </div>
        </div>

        {hasCoordinates && (
          <div style={{
            height: "300px",
            backgroundColor: "#f3f4f6",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "4px" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.longitude-0.1},${data.latitude-0.1},${data.longitude+0.1},${data.latitude+0.1}&layer=mapnik&marker=${data.latitude},${data.longitude}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}