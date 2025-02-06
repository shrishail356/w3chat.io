import React from "react";

const Playground: React.FC = () => {
  const boardSize = 6;
  const cellSize = 60;
  const gap = 2;

  // Add state for selected cell
  const [selectedCell, setSelectedCell] = React.useState<number | null>(null);
  const [message, setMessage] = React.useState<string>("");

  // Add message display component
  const MessagePopup = () =>
    message ? (
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: "8px",
          zIndex: 1000,
          animation: "fadeOut 2s forwards",
        }}
      >
        {message}
      </div>
    ) : null;

  // Replace the hardcoded arrays with generated ones
  const generateBoardConfiguration = () => {
    const totalCells = boardSize * boardSize;
    const allNumbers = Array.from({ length: totalCells }, (_, i) => i + 1);

    // Generate sections using coordinate-based logic
    const generateSection = (coordinates: [number, number][]) =>
      coordinates.map(([row, col]) => row * boardSize + col + 1);

    // Define sections by their coordinates (row, col)
    const section1Coords: [number, number][] = [
      [5, 0],
      [4, 0],
      [3, 0], // Left column
      [5, 1],
      [4, 1],
      [3, 1], // Second column
      [5, 2],
      [4, 2],
      [3, 2], // Third column
    ];

    const section2Coords: [number, number][] = [
      [0, 3],
      [0, 4],
      [0, 5], // Top row
      [1, 3],
      [1, 4],
      [1, 5], // Second row
      [2, 3],
      [2, 4],
      [2, 5], // Third row
    ];

    const section3Coords: [number, number][] = [
      [2, 2],
      [2, 1],
      [1, 2], // Middle section
      [3, 3],
      [3, 4],
      [4, 3],
    ];

    return {
      section1: generateSection(section1Coords),
      section2: generateSection(section2Coords),
      section3: generateSection(section3Coords),
      boxesToRemove: allNumbers.filter((num) => {
        const row = Math.floor((num - 1) / boardSize);
        const col = (num - 1) % boardSize;
        return (
          !section1Coords.some(([r, c]) => r === row && c === col) &&
          !section2Coords.some(([r, c]) => r === row && c === col) &&
          !section3Coords.some(([r, c]) => r === row && c === col)
        );
      }),
    };
  };

  const { section1, section2, section3, boxesToRemove } =
    generateBoardConfiguration();

  // Generate remaining boxes and mapping algorithmically
  const remainingBoxes = Array.from({ length: boardSize * boardSize })
    .map((_, index) => index + 1)
    .filter((num) => !boxesToRemove.includes(num))
    .sort((a, b) => {
      const getCoords = (n: number) => {
        const row = Math.floor((n - 1) / boardSize);
        const col = (n - 1) % boardSize;
        return { row, col };
      };
      const coordsA = getCoords(a);
      const coordsB = getCoords(b);
      return coordsA.col - coordsB.col || coordsA.row - coordsB.row;
    });

  const numberMapping = Object.fromEntries(
    remainingBoxes.map((originalNum, index) => [originalNum, index + 1])
  );

  const getCellColor = (originalNumber: number, row: number, col: number) => {
    const isAlternatePosition = (row + col) % 2 === 0;

    if (
      section1.includes(originalNumber) ||
      section2.includes(originalNumber)
    ) {
      return {
        bg: isAlternatePosition ? "#FF1493" : "#000000",
        text: "#FFFFFF",
        glowColor: "#FFD700", // Yellow glow for all sections
      };
    } else if (section3.includes(originalNumber)) {
      return {
        bg: "#20B2AA",
        text: "#FFFFFF",
        glowColor: "#FFD700", // Same yellow glow
      };
    }
    return {
      bg: "transparent",
      text: "#000000",
      glowColor: "#FFD700",
    };
  };

  const handleCellClick = (originalNumber: number, newNumber: number) => {
    if (selectedCell === originalNumber) {
      // Deselect if clicking the same cell
      setSelectedCell(null);
      setMessage("Selection cleared");
    } else if (selectedCell === null) {
      // Select new cell only if no cell is currently selected
      setSelectedCell(originalNumber);
      setMessage(`Selected number: ${newNumber}`);
    } else {
      setMessage("Please deselect current box first");
    }
    // Clear message after 2 seconds
    setTimeout(() => setMessage(""), 2000);
  };

  const cells = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const originalCellNumber = row * boardSize + col + 1;

      if (!boxesToRemove.includes(originalCellNumber)) {
        const colors = getCellColor(originalCellNumber, row, col);
        const newNumber = numberMapping[originalCellNumber];
        const isSelected = selectedCell === originalCellNumber;

        const cellStyle: React.CSSProperties = {
          width: cellSize,
          height: cellSize,
          backgroundColor: colors.bg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderRadius: "8px",
          boxShadow: isSelected
            ? `0 0 20px ${colors.glowColor}99, 0 0 30px ${colors.glowColor}66, inset 0 0 15px ${colors.glowColor}66`
            : "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          border: isSelected
            ? `3px solid ${colors.glowColor}`
            : "2px solid rgba(255, 255, 255, 0.1)",
          transform: isSelected ? "scale(1.15)" : "scale(1)",
          zIndex: isSelected ? "2" : "1",
          filter: isSelected
            ? "brightness(1.3) contrast(1.2)"
            : "brightness(1)",
          animation: isSelected ? "pulse-glow 1.5s infinite" : "none",
        };

        const numberStyle: React.CSSProperties = {
          transform: "rotate(-45deg)",
          color: colors.text,
          fontSize: "20px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          opacity: 0.5, // Reduced opacity from 0.7 to 0.5
        };

        cells.push(
          <div
            key={`${row}-${col}`}
            style={cellStyle}
            onClick={() => handleCellClick(originalCellNumber, newNumber)}
            onMouseOver={(e) => {
              if (!isSelected) {
                const target = e.currentTarget;
                target.style.transform = "scale(1.1)";
                target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
                target.style.zIndex = "1";
              }
            }}
            onMouseOut={(e) => {
              if (!isSelected) {
                const target = e.currentTarget;
                target.style.transform = "scale(1)";
                target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                target.style.zIndex = "0";
              }
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
    <>
      <style>
        {`
          /* Prevent text selection */
          .no-select {
            user-select: none; /* Non-standard */
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
          }
        `}
      </style>
      <MessagePopup />
      <div
        className="no-select"
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
    </>
  );
};

export default Playground;
