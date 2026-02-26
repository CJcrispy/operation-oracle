"use client";

import { useState, useEffect, useRef } from "react";

const ROTATE_ORDER = [">", "v", "<", "^"];
const GRID_SIZE = 5;

function generateRandomPath(): string[][] {
  const path = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("")
  );
  let x = 0;
  let y = 0;
  const mainPath: [number, number][] = [[x, y]];

  while (x < GRID_SIZE - 1 || y < GRID_SIZE - 1) {
    if (x < GRID_SIZE - 1 && (Math.random() < 0.6 || y === GRID_SIZE - 1)) {
      path[y][x] = ">";
      x++;
    } else if (y < GRID_SIZE - 1) {
      path[y][x] = "v";
      y++;
    }
    mainPath.push([x, y]);
  }

  let replaced = 0;
  while (replaced < 3) {
    const i = Math.floor(Math.random() * (mainPath.length - 2)) + 2;
    const [px, py] = mainPath[i];
    if ([">", "<", "^", "v"].includes(path[py][px])) {
      path[py][px] = "o";
      replaced++;
    }
  }
  return path;
}

function runSignal(
  getGrid: () => string[][],
  setActiveCell: (c: [number, number] | null) => void,
  setMessage: (m: string) => void,
  setShowReset: (s: boolean) => void
): ReturnType<typeof setInterval> {
  let x = 0;
  let y = 0;
  let steps = 0;
  const id = setInterval(() => {
    const grid = getGrid();
    const dir = grid[y]?.[x];
    setActiveCell([x, y]);

    if (dir === ">") x++;
    else if (dir === "<") x--;
    else if (dir === "^") y--;
    else if (dir === "v") y++;
    else {
      clearInterval(id);
      setMessage("Signal lost. Puzzle failed.");
      setShowReset(true);
      return;
    }

    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      clearInterval(id);
      setMessage("Signal lost. Out of bounds.");
      setShowReset(true);
      return;
    }

    if (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) {
      clearInterval(id);
      setMessage("Signal complete. Access granted.");
      return;
    }

    steps++;
    if (steps > 30) {
      clearInterval(id);
      setMessage("Signal lost. Timeout.");
      setShowReset(true);
    }
  }, 500);
  return id;
}

export default function PathSignalGame() {
  const [gridData, setGridData] = useState<string[][]>(generateRandomPath);
  const gridRef = useRef(gridData);
  gridRef.current = gridData;
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [runKey, setRunKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createGrid = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMessage("");
    setShowReset(false);
    setActiveCell(null);
    const newGrid = generateRandomPath();
    setGridData(newGrid);
    gridRef.current = newGrid;
    setRunKey((k) => k + 1);
  };

  useEffect(() => {
    const run = () => {
      intervalRef.current = runSignal(
        () => gridRef.current,
        setActiveCell,
        setMessage,
        setShowReset
      );
    };
    run();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runKey]);

  const handleCellClick = (x: number, y: number) => {
    const value = gridData[y][x];
    if (value !== "o" && !ROTATE_ORDER.includes(value)) return;
    const idx = value === "o" ? -1 : ROTATE_ORDER.indexOf(value);
    const nextDir = ROTATE_ORDER[(idx + 1) % ROTATE_ORDER.length];
    setGridData((prev) => {
      const next = prev.map((row) => [...row]);
      next[y][x] = nextDir;
      return next;
    });
  };

  return (
    <div className="rounded border-2 border-black bg-[#c0c0c0] p-2 sm:p-4 font-sans min-w-0 overflow-auto">
      <div className="mb-2 bg-[#000080] px-2 py-1 font-bold text-white text-xs sm:text-base">
        ORACLE Challenge - path_signal.exe
      </div>
      <div
        className="grid gap-0.5 sm:gap-1 w-fit max-w-full mx-auto"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: "min(100%, 320px)",
          minWidth: "220px",
          aspectRatio: "1",
        }}
      >
        {gridData.map((row, gy) =>
          row.map((cell, gx) => (
            <button
              key={`${gy}-${gx}`}
              type="button"
              onClick={() => handleCellClick(gx, gy)}
              className={`flex aspect-square min-h-[44px] min-w-[44px] max-h-[64px] max-w-[64px] w-full h-full items-center justify-center border-2 border-b-[#fff] border-r-[#fff] border-t-[#808080] border-l-[#808080] bg-white text-lg sm:text-2xl ${
                activeCell?.[0] === gx && activeCell?.[1] === gy
                  ? "bg-yellow-400 font-bold"
                  : ""
              }`}
            >
              {cell}
            </button>
          ))
        )}
      </div>
      {showReset && (
        <button
          type="button"
          onClick={createGrid}
          className="mt-2 border border-black bg-[#c0c0c0] px-2 py-1 font-sans"
        >
          Reset Puzzle
        </button>
      )}
      {message && (
        <p className="mt-2 font-bold">{message}</p>
      )}
    </div>
  );
}
