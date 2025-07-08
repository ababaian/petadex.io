// File: frontend/src/components/SequenceViewer.js
import React from "react";

// Taylor amino acid color scheme (background colors)
const aaColors = {
  A: "#ccff00", V: "#99ff00", I: "#66ff00", L: "#33ff00",
  M: "#00ff00", F: "#00ff66", Y: "#00ffcc", W: "#00ccff",
  H: "#0066ff", R: "#0000ff", K: "#6600ff", N: "#cc00ff",
  Q: "#ff00cc", E: "#ff0066", D: "#ff0000", S: "#ff3300",
  T: "#ff6600", G: "#ff9900", P: "#ffcc00", C: "#ffff00"
};

// Wrap sequence into lines of up to `lineLength` characters
const wrapSequence = (seq, lineLength = 80) => {
  return seq.match(new RegExp(`.{1,${lineLength}}`, "g")) || [];
};

export default function SequenceViewer({ sequence }) {
  const lines = wrapSequence(sequence, 80);
  return (
    <div style={{ fontFamily: "monospace", fontSize: "1rem", lineHeight: "1.5" }}>
      {lines.map((line, idx) => (
        <div key={idx} style={{ whiteSpace: "pre" }}>
          {line.split("").map((aa, i) => (
            <span
              key={i}
              style={{
                backgroundColor: aaColors[aa] || "#FFFFFF",
                color: "#000000",
                padding: "0 2px"
              }}
            >
              {aa}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
