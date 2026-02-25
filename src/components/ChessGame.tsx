"use client";

import { useState, useCallback } from "react";

const PIECES: Record<string, string> = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
};

const INITIAL_BOARD = [
  "rnbqkbnr",
  "pppppppp",
  "........",
  "........",
  "........",
  "........",
  "PPPPPPPP",
  "RNBQKBNR",
].map((row) => row.split(""));

export default function ChessGame() {
  const [board, setBoard] = useState<string[][]>(() =>
    INITIAL_BOARD.map((row) => [...row])
  );
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const handleClick = useCallback(
    (x: number, y: number) => {
      if (selected) {
        const [sx, sy] = selected;
        const movingPiece = board[sy][sx];
        setBoard((prev) => {
          const next = prev.map((row) => [...row]);
          next[y][x] = movingPiece;
          next[sy][sx] = ".";
          return next;
        });
        setSelected(null);
        if (movingPiece === "K" && board[y][x] === "k") {
          setTimeout(() => alert("Black king defeated. ORACLE core compromised."), 0);
        }
      } else if (/[RNBQKP]/.test(board[y][x])) {
        setSelected([x, y]);
      }
    },
    [board, selected]
  );

  return (
    <div className="rounded border-2 border-black bg-[#c0c0c0] p-2 font-sans">
      <div className="mb-2 bg-[#000080] px-2 py-1 font-bold text-white">
        ORACLE Challenge - chess.exe
      </div>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: "repeat(8, 48px)",
          gridTemplateRows: "repeat(8, 48px)",
          width: 384,
          height: 384,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${y}-${x}`}
              type="button"
              onClick={() => handleClick(x, y)}
              className={`flex h-12 w-12 items-center justify-center text-3xl ${
                (x + y) % 2 === 0 ? "bg-[#eee]" : "bg-[#888]"
              } ${selected?.[0] === x && selected?.[1] === y ? "outline outline-2 outline-red-600" : ""}`}
            >
              {cell !== "." ? PIECES[cell] ?? cell : ""}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
