// File: frontend/src/components/SequenceViewer.js
import React, { useState } from "react";

// Taylor amino acid color scheme (background colors)
const aaColors = {
  A: "#ccff00", V: "#99ff00", I: "#66ff00", L: "#33ff00",
  M: "#00ff00", F: "#00ff66", Y: "#00ffcc", W: "#00ccff",
  H: "#0066ff", R: "#0000ff", K: "#6600ff", N: "#cc00ff",
  Q: "#ff00cc", E: "#ff0066", D: "#ff0000", S: "#ff3300",
  T: "#ff6600", G: "#ff9900", P: "#ffcc00", C: "#ffff00"
};

// Standard nucleotide color scheme
const nucleotideColors = {
  A: "#00ff00", // green
  T: "#ff0000", // red
  G: "#ffff00", // yellow
  C: "#0000ff", // blue
  U: "#ff00ff"  // magenta (for RNA)
};

// Wrap sequence into lines of up to `lineLength` characters
const wrapSequence = (seq, lineLength = 80) => {
  if (!seq || typeof seq !== 'string') return [];
  return seq.match(new RegExp(`.{1,${lineLength}}`, "g")) || [];
};

export default function SequenceViewer({ nucleotideSequence, aminoAcidSequence }) {
  const [sequenceType, setSequenceType] = useState("amino-acid");
  
  // Select the appropriate sequence and color scheme
  const currentSequence = sequenceType === "nucleotide" ? nucleotideSequence : aminoAcidSequence;
  const colorScheme = sequenceType === "nucleotide" ? nucleotideColors : aaColors;
  const lines = wrapSequence(currentSequence, 80);
  
  return (
    <div>
      {/* Always show toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>
          <input
            type="radio"
            value="amino-acid"
            checked={sequenceType === "amino-acid"}
            onChange={(e) => setSequenceType(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          Amino Acid
        </label>
        <label>
          <input
            type="radio"
            value="nucleotide"
            checked={sequenceType === "nucleotide"}
            onChange={(e) => setSequenceType(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          Nucleotide
        </label>
      </div>
      
      <div style={{ fontFamily: "monospace", fontSize: "1rem", lineHeight: "1.5" }}>
        {lines.length > 0 ? (
          lines.map((line, idx) => (
            <div key={idx} style={{ whiteSpace: "pre" }}>
              {line.split("").map((char, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: colorScheme[char] || "#FFFFFF",
                    color: "#000000",
                    padding: "0 2px"
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))
        ) : (
          <div style={{ color: "#666", padding: "1rem 0" }}>
            {sequenceType === "nucleotide" 
              ? "Nucleotide sequence not available" 
              : "No sequence available"}
          </div>
        )}
      </div>
    </div>
  );
}