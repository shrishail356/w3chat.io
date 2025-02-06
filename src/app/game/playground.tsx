import React from "react";

const Playground: React.FC = () => {
  const boardSize = 6;
  const cellSize = 60; // size of each square in pixels
  const gap = 2; // gap between squares

  // Generate 6x6 board cells.
  const cells = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      // Create a traditional checkered pattern.
      const isLight = (row + col) % 2 === 0;
      const cellNumber = row * boardSize + col + 1; // Calculate cell number (1-36)

      const cellStyle: React.CSSProperties = {
        width: cellSize,
        height: cellSize,
        backgroundColor: isLight ? "#f0d9b5" : "#b58863",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      };

      const numberStyle: React.CSSProperties = {
        transform: "rotate(-45deg)", // Counter-rotate the number to make it straight
        color: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      };

      cells.push(
        <div key={`${row}-${col}`} style={cellStyle}>
          <span style={numberStyle}>{cellNumber}</span>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px", // spacing from any adjacent element
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gap: `${gap}px`,
          transform: "rotate(45deg)", // Rotated by 45deg so that board tip faces up/down/side
        }}
      >
        {cells}
      </div>
    </div>
  );
};

export default Playground;
