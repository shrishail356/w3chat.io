import React from "react";

const Playground: React.FC = () => {
  const boardSize = 6;
  const cellSize = 60;
  const gap = 2;

  // Define the new numbering sequence (left to right, then top)
  const remainingBoxes = [
    31,
    25,
    19, // Left column
    32,
    26,
    20, // Second column
    33,
    27,
    21, // Third column
    28,
    22,
    14, // Fourth column
    23,
    15,
    9, // Fifth column
    16,
    10,
    4, // Top row continuation
    17,
    11,
    5, // Second row continuation
    18,
    12,
    6, // Third row continuation
  ];

  // Create a mapping from original numbers to new sequential numbers (1-24)
  const numberMapping = Object.fromEntries(
    remainingBoxes.map((originalNum, index) => [originalNum, index + 1])
  );

  // Original section definitions with original numbers
  const section1 = [31, 32, 33, 27, 26, 25, 21, 20, 19];
  const section2 = [4, 5, 6, 10, 11, 12, 16, 17, 18];
  const section3 = [14, 15, 9, 22, 23, 28];

  // Numbers/boxes to remove
  const boxesToRemove = [1, 7, 2, 13, 8, 3, 36, 35, 30, 34, 29, 24];

  const getCellColor = (originalNumber: number, row: number, col: number) => {
    const isAlternatePosition = (row + col) % 2 === 0;

    if (
      section1.includes(originalNumber) ||
      section2.includes(originalNumber)
    ) {
      return {
        bg: isAlternatePosition ? "#FF1493" : "#000000",
        text: "#FFFFFF",
      };
    } else if (section3.includes(originalNumber)) {
      return {
        bg: "#20B2AA",
        text: "#FFFFFF",
      };
    }
    return {
      bg: "transparent",
      text: "#000000",
    };
  };

  const cells = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const originalCellNumber = row * boardSize + col + 1;

      if (!boxesToRemove.includes(originalCellNumber)) {
        const colors = getCellColor(originalCellNumber, row, col);
        const newNumber = numberMapping[originalCellNumber];

        const cellStyle: React.CSSProperties = {
          width: cellSize,
          height: cellSize,
          backgroundColor: colors.bg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          border: "2px solid rgba(255, 255, 255, 0.1)",
        };

        const numberStyle: React.CSSProperties = {
          transform: "rotate(-45deg)",
          color: colors.text,
          fontSize: "20px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          opacity: 0.7, // Added opacity to numbers
        };

        cells.push(
          <div
            key={`${row}-${col}`}
            style={cellStyle}
            onMouseOver={(e) => {
              const target = e.currentTarget;
              target.style.transform = "scale(1.1)";
              target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
              target.style.zIndex = "1";
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget;
              target.style.transform = "scale(1)";
              target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
              target.style.zIndex = "0";
            }}
          >
            <span style={numberStyle}>{newNumber}</span>
          </div>
        );
      } else {
        cells.push(
          <div
            key={`${row}-${col}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: "transparent",
            }}
          />
        );
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gap: `${gap}px`,
          transform: "rotate(45deg)",
        }}
      >
        {cells}
      </div>
    </div>
  );
};

export default Playground;
