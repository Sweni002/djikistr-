import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { PiSeal } from "react-icons/pi";


export default function GrapheSVG({ width=1300, height=800 }) {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [hoverHandle, setHoverHandle] = useState(null);
  const clickTimeout = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const snap = (value, gridSize = 20) =>
    Math.round(value / gridSize) * gridSize;

  const [history, setHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  // Met à jour l'historique et les lignes
  const updateLines = (newLines) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newLines);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setLines(newLines);
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setLines(history[newStep]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setLines(history[newStep]);
    }
  };

  // Raccourcis Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyStep, history]);

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const { x, y } = pointer;

    const pointRadius = 6;

    // 1️⃣ Vérifier si on clique sur un point existant
    const clickedOnPoint = lines.some((line) =>
      line.points.some((coord, idx) => {
        if (idx % 2 !== 0) return false;
        const px = line.points[idx];
        const py = line.points[idx + 1];
        return Math.hypot(px - x, py - y) < pointRadius;
      }),
    );
    if (clickedOnPoint) return;

    // 2️⃣ Ajouter un point sur une ligne existante
    if (hoverHandle) {
      const { lineIndex, pointIndex } = hoverHandle;
      const oldPoints = [...lines[lineIndex].points];
      oldPoints.splice(pointIndex * 2, 0, snap(x), snap(y));
      const newLines = lines.map((line, idx) =>
        idx === lineIndex ? { points: oldPoints } : line,
      );
      updateLines(newLines);
      return;
    }

    // 3️⃣ Créer ou continuer la ligne en cours
    if (!isDrawing) {
      const newLine = { points: [snap(x), snap(y)] };
      setCurrentLine(newLine);
      updateLines([...lines, newLine]);
      setIsDrawing(true);
    } else {
      // Ajouter un point à la ligne existante
      const newLine = { points: [...currentLine.points, snap(x), snap(y)] };
      setCurrentLine(newLine);
      const newLines = [...lines.slice(0, -1), newLine];
      updateLines(newLines);
    }
  };
  // Déplacement souris → mise à jour ghost line
  const handleStageMove = (e) => {
    if (!currentLine) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const snappedPos = { x: snap(pointer.x), y: snap(pointer.y) };
    setMousePos(snappedPos);
  };

  const getCurrentPoints = () => {
    if (!currentLine) return [];
    if (!mousePos) return currentLine.points;
    return [...currentLine.points, mousePos.x, mousePos.y];
  };
  const handleStageDblClick = () => {
    if (!isDrawing) return;
    if (currentLine) {
      setCurrentLine(null);
    }
    setIsDrawing(false);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (hoverHandle) {
          e.preventDefault();
          const { lineIndex, pointIndex } = hoverHandle;
          const line = lines[lineIndex];
          if (!line) return;

          const newPoints = [...line.points];
          // Supprimer le point (x et y)
          newPoints.splice(pointIndex * 2, 2);

          let newLines;
          if (newPoints.length === 0) {
            // Si la ligne est vide, on la supprime entièrement
            newLines = lines.filter((_, idx) => idx !== lineIndex);
            setHoverHandle(null); // reset hoverHandle si la ligne entière est supprimée
          } else {
            newLines = lines.map((l, idx) =>
              idx === lineIndex ? { points: newPoints } : l,
            );
            setHoverHandle(null); // reset hoverHandle après suppression d’un point
          }
          updateLines(newLines);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lines, hoverHandle, historyStep, history]);

  // Déplacement des points existants
  const handlePointDrag = (lineIndex, pointIndex, e) => {
    const newLines = [...lines];
    newLines[lineIndex].points[pointIndex * 2] = snap(e.target.x());
    newLines[lineIndex].points[pointIndex * 2 + 1] = snap(e.target.y());
    updateLines(newLines);
  };

  // Hover sur ligne
  const handleLineMouseMove = (lineIndex, e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const pts = lines[lineIndex].points;

    let minDist = Infinity;
    let nearestSegment = 0;
    let handleX = 0;
    let handleY = 0;

    for (let i = 0; i < pts.length - 2; i += 2) {
      const x1 = pts[i],
        y1 = pts[i + 1],
        x2 = pts[i + 2],
        y2 = pts[i + 3];
      const dx = x2 - x1,
        dy = y2 - y1;
      const t = Math.max(
        0,
        Math.min(
          1,
          ((pointer.x - x1) * dx + (pointer.y - y1) * dy) / (dx * dx + dy * dy),
        ),
      );
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      const dist = Math.hypot(projX - pointer.x, projY - pointer.y);
      if (dist < minDist) {
        minDist = dist;
        nearestSegment = i;
        handleX = projX;
        handleY = projY;
      }
    }

    const detectionRadius = 30;
    if (minDist < detectionRadius) {
      const snappedHandleX = snap(handleX);
      const snappedHandleY = snap(handleY);
      if (
        !hoverHandle ||
        hoverHandle.lineIndex !== lineIndex ||
        hoverHandle.pointIndex !== nearestSegment / 2 + 1
      ) {
        setHoverHandle({
          lineIndex,
          pointIndex: nearestSegment / 2 + 1,
          x: snappedHandleX,
          y: snappedHandleY,
        });
        stage.container().style.cursor = "pointer";
      }
    } else {
      setHoverHandle(null);
      stage.container().style.cursor = "default";
    }
  };

  const handleLineMouseLeave = () => {
    const stage = document.querySelector("canvas")?.getStage?.();
    if (stage) stage.container().style.cursor = "default";
    setHoverHandle(null);
  };

  return (
    <Stage
      width={width}
      height={height}
      style={{ border: "1px solid #ccc", background: "#fff" }}
      onClick={handleStageClick}
      onDblClick={handleStageDblClick} // <-- terminer ligne
      onMouseMove={handleStageMove}
    >
      <Layer>
        {lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            <Line
              points={line.points}
              stroke="red"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              onMouseMove={(e) => handleLineMouseMove(lineIndex, e)}
              onMouseLeave={handleLineMouseLeave}
            />
            {line.points.map((_, idx) => {
              if (idx % 2 !== 0) return null;
              const px = line.points[idx];
              const py = line.points[idx + 1];
              const pointIndex = idx / 2;

              // Hover uniquement si hoverHandle correspond à ce point
              const isHovered =
                hoverHandle &&
                hoverHandle.lineIndex === lineIndex &&
                hoverHandle.pointIndex === pointIndex;

              return (
                <Circle
                  key={idx}
                  x={px}
                  y={py}
                  radius={7}
                  fill="black"
                  stroke={isHovered ? "orange" : "black"}
                  strokeWidth={2}
                  draggable
                  onDragMove={(e) => handlePointDrag(lineIndex, pointIndex, e)}
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Ghost line pour la ligne en cours */}
        {currentLine && (
          <Line
            points={getCurrentPoints()}
            stroke="red"
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
            dash={[10, 5]}
            opacity={0.6}
          />
        )}
      </Layer>
    </Stage>
  );
}
