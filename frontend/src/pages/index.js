import React from "react";
import { Link } from "gatsby";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>PETadex</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Welcome to PETadex, your exploration of plastic-degrading enzyme sequences.
      </p>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem" }}>
            <Link to="/fastaa" style={{ textDecoration: "none", color: "#0366d6", fontSize: "1.5rem" }}>
              View All Sequences
            </Link>
          </li>
          <li>
            <Link to="/protein" style={{ textDecoration: "none", color: "#0366d6", fontSize: "1.5rem" }}>
              Protein Lookup
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
