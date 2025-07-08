import React from "react";

// Taylor amino acid color scheme
const aaColors = {
  A: "#C8C8C8", C: "#E6E600", D: "#E60000", E: "#E60000",
  F: "#3232AA", G: "#EBEBEB", H: "#8282D2", I: "#0F820F",
  K: "#0000E0", L: "#0F820F", M: "#0F820F", N: "#00DCDC",
  P: "#7F007F", Q: "#00DCDC", R: "#0000E0", S: "#FA9600",
  T: "#FA9600", V: "#0F820F", W: "#B45AB4", Y: "#3232AA"
};

export default function SequenceViewer({ sequence }) {
  return (
    <div style={{ fontFamily: "monospace", fontSize: "1rem", lineHeight: "1.5" }}>
      {sequence.split("").map((aa, i) => (
        <span key={i} style={{ color: aaColors[aa] || "#000000" }}>
          {aa}
        </span>
      ))}
    </div>
  );
}
