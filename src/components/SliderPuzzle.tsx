"use client";

import { useState, useCallback, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { FILE_NAMES } from "@/lib/content";

const N = 4; // 4x4 grid, 15 tiles + 1 empty — first level only

const rc = (i: number) => ({ r: Math.floor(i / N), c: i % N });
const adj = (a: number, b: number) => {
  const ar = rc(a);
  const br = rc(b);
  return Math.abs(ar.r - br.r) + Math.abs(ar.c - br.c) === 1;
};

function shuffleBoard(k: number = N * N * 10): (number | null)[] {
  const size = N * N;
  let b: (number | null)[] = [...Array.from({ length: size - 1 }, (_, i) => i + 1), null];
  while (k--) {
    const e = b.indexOf(null);
    const moves = b.map((_, i) => i).filter((i) => adj(i, e));
    const r = moves[Math.floor(Math.random() * moves.length)];
    [b[r], b[e]] = [b[e], b[r]];
  }
  return b;
}

function isSolved(b: (number | null)[]): boolean {
  const size = N * N;
  return b.slice(0, -1).every((v, i) => v === i + 1) && b[size - 1] === null;
}

export default function SliderPuzzle() {
  const { pendingUnlock, markUnlocked, setPendingUnlock } = useGame();
  const [board, setBoard] = useState<(number | null)[]>(() => shuffleBoard());
  const [won, setWon] = useState(false);

  const move = useCallback((v: number) => {
    if (won) return;
    setBoard((b) => {
      const i = b.indexOf(v);
      const e = b.indexOf(null);
      if (!adj(i, e)) return b;
      const next = [...b];
      [next[i], next[e]] = [next[e], next[i]];
      return next;
    });
  }, [won]);

  useEffect(() => {
    if (won) return;
    if (isSolved(board)) {
      setWon(true);
      if (pendingUnlock === 1) {
        markUnlocked(1, FILE_NAMES[1]);
        setPendingUnlock(null);
      }
    }
  }, [board, won, pendingUnlock, markUnlocked, setPendingUnlock]);

  return (
    <div className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-8 overflow-auto rounded border-2 border-black bg-[#121212] p-4 font-sans">
      <div
        className="text-center font-bold text-[#ffb3ff]"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          WebkitTextStroke: "1px #ff00aa",
          textShadow: "2px 2px 2px rgba(0,0,0,.35)",
          fontSize: "clamp(12px, 4vw, 20px)",
        }}
      >
        Slider Puzzle
      </div>
      {won ? (
        <div
          className="text-center font-bold text-[#ffb3ff]"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            WebkitTextStroke: "1px #ff00aa",
            textShadow: "2px 2px 2px rgba(0,0,0,.35)",
            fontSize: "clamp(10px, 3vw, 16px)",
          }}
        >
          FRAGMENT DECRYPTED
        </div>
      ) : (
        <div
          className="grid gap-1.5 rounded-md border-2 border-white/25 bg-[#222] p-1.5"
          style={{
            width: "min(400px, 85vw)",
            height: "min(400px, 85vw)",
            gridTemplateColumns: `repeat(${N}, 1fr)`,
            gridTemplateRows: `repeat(${N}, 1fr)`,
          }}
        >
          {board.map((v, i) => {
            if (!v) return null;
            const { r, c } = rc(i);
            return (
              <button
                key={v}
                type="button"
                onClick={() => move(v)}
                className="relative flex select-none items-center justify-center rounded border border-white/20 bg-lime-400 font-bold text-[#ffb3ff] shadow-[inset_-1px_-1px_1px_rgba(0,0,0,.25),inset_1px_1px_1px_rgba(255,255,255,.6)] transition-opacity hover:bg-lime-300 hover:opacity-90 active:opacity-80"
                style={{
                  gridRow: r + 1,
                  gridColumn: c + 1,
                  fontFamily: "'Press Start 2P', monospace",
                  WebkitTextStroke: "1px #ff00aa",
                  textShadow: "2px 2px 2px rgba(0,0,0,.35)",
                  fontSize: "clamp(12px, 3vw, 22px)",
                  backgroundImage: "radial-gradient(transparent, rgba(0,0,0,.55))",
                }}
              >
                {v}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
