"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { FILE_NAMES } from "@/lib/content";

const PIECES: Record<string, string> = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
};

// Board is displayed flipped: Black (player) at bottom, White (AI) at top
const PIECE_VALUE: Record<string, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0, p: -1, n: -3, b: -3, r: -5, q: -9, k: 0 };

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

type Square = [number, number];
type Board = string[][];

function isWhite(piece: string): boolean {
  return piece === piece.toUpperCase() && piece !== ".";
}

function isBlack(piece: string): boolean {
  return piece !== "." && piece === piece.toLowerCase();
}

function getPawnMoves(board: Board, x: number, y: number): Square[] {
  const piece = board[y][x];
  const moves: Square[] = [];
  const isW = isWhite(piece);
  const dy = isW ? -1 : 1;
  const startRow = isW ? 6 : 1;
  const enemy = isW ? (p: string) => isBlack(p) : (p: string) => isWhite(p);

  if (y + dy >= 0 && y + dy < 8) {
    if (board[y + dy][x] === ".") {
      moves.push([x, y + dy]);
      if (y === startRow && board[y + 2 * dy][x] === ".") {
        moves.push([x, y + 2 * dy]);
      }
    }
    for (const dx of [-1, 1]) {
      const nx = x + dx;
      if (nx >= 0 && nx < 8 && enemy(board[y + dy][nx])) {
        moves.push([nx, y + dy]);
      }
    }
  }
  return moves;
}

function getKnightMoves(board: Board, x: number, y: number): Square[] {
  const piece = board[y][x];
  const moves: Square[] = [];
  const isW = isWhite(piece);
  const isFriendly = isW ? isWhite : isBlack;
  const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dx, dy] of jumps) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && !isFriendly(board[ny][nx])) {
      moves.push([nx, ny]);
    }
  }
  return moves;
}

function addRayMoves(board: Board, x: number, y: number, dx: number, dy: number, isW: boolean): Square[] {
  const moves: Square[] = [];
  const isFriendly = isW ? isWhite : isBlack;
  const isEnemy = isW ? isBlack : isWhite;
  let nx = x + dx, ny = y + dy;
  while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
    const p = board[ny][nx];
    if (p === ".") {
      moves.push([nx, ny]);
    } else {
      if (isEnemy(p)) moves.push([nx, ny]);
      break;
    }
    nx += dx; ny += dy;
  }
  return moves;
}

function getRookMoves(board: Board, x: number, y: number): Square[] {
  const piece = board[y][x];
  const isW = isWhite(piece);
  const isFriendly = isW ? isWhite : isBlack;
  const isEnemy = isW ? isBlack : isWhite;
  const moves: Square[] = [];
  // Horizontal and vertical: (±1, 0) and (0, ±1) — any number of squares in each direction
  const directions: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const [dx, dy] of directions) {
    let nx = x + dx, ny = y + dy;
    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      const p = board[ny][nx];
      if (p === ".") {
        moves.push([nx, ny]);
      } else {
        if (isEnemy(p)) moves.push([nx, ny]);
        break;
      }
      nx += dx;
      ny += dy;
    }
  }
  return moves;
}

function getBishopMoves(board: Board, x: number, y: number): Square[] {
  const isW = isWhite(board[y][x]);
  return [
    ...addRayMoves(board, x, y, 1, 1, isW),
    ...addRayMoves(board, x, y, -1, 1, isW),
    ...addRayMoves(board, x, y, 1, -1, isW),
    ...addRayMoves(board, x, y, -1, -1, isW),
  ];
}

function getQueenMoves(board: Board, x: number, y: number): Square[] {
  return [...getRookMoves(board, x, y), ...getBishopMoves(board, x, y)];
}

function getKingMoves(board: Board, x: number, y: number, castling: { K?: boolean; Q?: boolean; k?: boolean; q?: boolean }): Square[] {
  const piece = board[y][x];
  const isW = isWhite(piece);
  const moves: Square[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
        const p = board[ny][nx];
        if (p === "." || (isW ? isBlack(p) : isWhite(p))) moves.push([nx, ny]);
      }
    }
  }
  if (isW && y === 7) {
    if (castling.K && board[7][5] === "." && board[7][6] === "." && board[7][7] === "R") moves.push([6, 7]);
    if (castling.Q && board[7][1] === "." && board[7][2] === "." && board[7][3] === "." && board[7][0] === "R") moves.push([2, 7]);
  }
  if (!isW && y === 0) {
    if (castling.k && board[0][5] === "." && board[0][6] === "." && board[0][7] === "r") moves.push([6, 0]);
    if (castling.q && board[0][1] === "." && board[0][2] === "." && board[0][3] === "." && board[0][0] === "r") moves.push([2, 0]);
  }
  return moves;
}

function getRawMoves(board: Board, x: number, y: number, castling: { K?: boolean; Q?: boolean; k?: boolean; q?: boolean }, enPassant: Square | null): Square[] {
  const piece = board[y][x];
  if (piece === ".") return [];
  const upper = piece.toUpperCase();
  if (upper === "P") {
    const moves = getPawnMoves(board, x, y);
    if (enPassant) {
      const [ex, ey] = enPassant;
          const isW = isWhite(piece);
          if (isW && y === 3 && Math.abs(x - ex) === 1 && ey === 2) moves.push([ex, ey]);
          if (!isW && y === 4 && Math.abs(x - ex) === 1 && ey === 5) moves.push([ex, ey]);
        }
    return moves;
  }
  if (upper === "N") return getKnightMoves(board, x, y);
  if (upper === "B") return getBishopMoves(board, x, y);
  if (upper === "R") return getRookMoves(board, x, y);
  if (upper === "Q") return getQueenMoves(board, x, y);
  if (upper === "K") return getKingMoves(board, x, y, castling);
  return [];
}

function copyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function findKing(board: Board, white: boolean): Square | null {
  const k = white ? "K" : "k";
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      if (board[y][x] === k) return [x, y];
  return null;
}

function isSquareAttacked(board: Board, x: number, y: number, byWhite: boolean): boolean {
  const attacker = byWhite ? (p: string) => isWhite(p) : (p: string) => isBlack(p);
  for (let cy = 0; cy < 8; cy++) {
    for (let cx = 0; cx < 8; cx++) {
      if (!attacker(board[cy][cx])) continue;
      const moves = getRawMoves(board, cx, cy, {}, null);
      if (moves.some(([mx, my]) => mx === x && my === y)) return true;
    }
  }
  return false;
}

function applyMove(board: Board, from: Square, to: Square, enPassant: Square | null, castling: { K?: boolean; Q?: boolean; k?: boolean; q?: boolean }): { board: Board; newCastling: typeof castling; newEnPassant: Square | null; promo?: string } {
  const next = copyBoard(board);
  const [fx, fy] = from;
  const [tx, ty] = to;
  const piece = next[fy][fx];
  const captured = next[ty][tx];
  next[ty][tx] = piece;
  next[fy][fx] = ".";

  let newEnPassant: Square | null = null;
  const newCastling = { ...castling };

  if (piece === "P" || piece === "p") {
    if (Math.abs(fy - ty) === 2) newEnPassant = [fx, (fy + ty) / 2];
    if (enPassant && tx === enPassant[0] && ty === enPassant[1]) {
      next[fy][tx] = "."; // remove en passant victim
    }
  }

  if (piece === "K" && fy === 7 && fx === 4) {
    newCastling.K = false;
    newCastling.Q = false;
    if (tx === 6) { next[7][5] = "R"; next[7][7] = "."; }
    if (tx === 2) { next[7][3] = "R"; next[7][0] = "."; }
  }
  if (piece === "k" && fy === 0 && fx === 4) {
    newCastling.k = false;
    newCastling.q = false;
    if (tx === 6) { next[0][5] = "r"; next[0][7] = "."; }
    if (tx === 2) { next[0][3] = "r"; next[0][0] = "."; }
  }
  if (piece === "R" || piece === "r") {
    if (fy === 7 && fx === 0) newCastling.Q = false;
    if (fy === 7 && fx === 7) newCastling.K = false;
    if (fy === 0 && fx === 0) newCastling.q = false;
    if (fy === 0 && fx === 7) newCastling.k = false;
  }
  if (captured === "R" || captured === "r") {
    if (ty === 7 && tx === 0) newCastling.Q = false;
    if (ty === 7 && tx === 7) newCastling.K = false;
    if (ty === 0 && tx === 0) newCastling.q = false;
    if (ty === 0 && tx === 7) newCastling.k = false;
  }

  return { board: next, newCastling, newEnPassant };
}

function getLegalMoves(board: Board, x: number, y: number, whiteTurn: boolean, castling: { K?: boolean; Q?: boolean; k?: boolean; q?: boolean }, enPassant: Square | null): Square[] {
  const piece = board[y][x];
  if (piece === ".") return [];
  if (whiteTurn !== isWhite(piece)) return [];
  const raw = getRawMoves(board, x, y, castling, enPassant);
  const legal: Square[] = [];
  for (const to of raw) {
    if (piece === "K" || piece === "k") {
      const isW = piece === "K";
      if (Math.abs(to[0] - x) === 2) {
        const midX = (x + to[0]) / 2;
        const midY = y;
        const temp = copyBoard(board);
        temp[y][x] = ".";
        temp[midY][midX] = piece;
        if (isSquareAttacked(temp, midX, midY, !isW)) continue;
      }
    }
    const { board: after } = applyMove(board, [x, y], to, enPassant, castling);
    const king = findKing(after, whiteTurn);
    if (king && !isSquareAttacked(after, king[0], king[1], !whiteTurn)) legal.push(to);
  }
  return legal;
}

function isInCheck(board: Board, white: boolean): boolean {
  const king = findKing(board, white);
  if (!king) return false;
  return isSquareAttacked(board, king[0], king[1], !white);
}

function hasLegalMove(board: Board, whiteTurn: boolean, castling: { K?: boolean; Q?: boolean; k?: boolean; q?: boolean }, enPassant: Square | null): boolean {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (getLegalMoves(board, x, y, whiteTurn, castling, enPassant).length > 0) return true;
    }
  }
  return false;
}

function evaluateBoard(board: Board): number {
  let score = 0;
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) {
      const p = board[y][x];
      if (p !== ".") score += PIECE_VALUE[p] ?? 0;
    }
  return score; // positive = good for White (AI)
}

function getAIMove(board: Board, castling: { K?: boolean; Q?: boolean; k?: boolean; q?: boolean }, enPassant: Square | null): { from: Square; to: Square } | null {
  const moves: { from: Square; to: Square }[] = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const legals = getLegalMoves(board, x, y, true, castling, enPassant);
      for (const to of legals) moves.push({ from: [x, y], to });
    }
  }
  if (moves.length === 0) return null;
  let best: { from: Square; to: Square } | null = null;
  let bestScore = -Infinity;
  for (const move of moves) {
    const { board: after } = applyMove(board, move.from, move.to, enPassant, castling);
    const score = evaluateBoard(after);
    if (score > bestScore) { bestScore = score; best = move; }
  }
  return best;
}

export default function ChessGame() {
  const { pendingUnlock, markUnlocked, setPendingUnlock } = useGame();
  const [board, setBoard] = useState<Board>(() => INITIAL_BOARD.map((r) => [...r]));
  const [whiteTurn, setWhiteTurn] = useState(true);
  const [selected, setSelected] = useState<Square | null>(null);
  const [castling, setCastling] = useState({ K: true, Q: true, k: true, q: true });
  const [enPassant, setEnPassant] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [promo, setPromo] = useState<{ square: Square; piece: string } | null>(null);
  const [gameOver, setGameOver] = useState<string | null>(null);

  const aiWon = gameOver === "Black wins by checkmate";

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD.map((r) => [...r]));
    setWhiteTurn(true);
    setSelected(null);
    setCastling({ K: true, Q: true, k: true, q: true });
    setEnPassant(null);
    setLastMove(null);
    setPromo(null);
    setGameOver(null);
  }, []);

  const legalMoves = useMemo(() => {
    if (!selected || gameOver) return [];
    return getLegalMoves(board, selected[0], selected[1], whiteTurn, castling, enPassant);
  }, [board, selected, whiteTurn, castling, enPassant, gameOver]);

  const inCheck = useMemo(() => isInCheck(board, whiteTurn), [board, whiteTurn]);
  const checkmate = useMemo(() => !hasLegalMove(board, whiteTurn, castling, enPassant) && inCheck, [board, whiteTurn, castling, enPassant, inCheck]);
  const stalemate = useMemo(() => !hasLegalMove(board, whiteTurn, castling, enPassant) && !inCheck, [board, whiteTurn, castling, enPassant, inCheck]);

  const handleMove = useCallback(
    (to: Square) => {
      if (!selected || gameOver) return;
      const [fx, fy] = selected;
      const piece = board[fy][fx];
      const { board: nextBoard, newCastling, newEnPassant } = applyMove(board, selected, to, enPassant, castling);
      const finalBoard = nextBoard.map((r) => [...r]);
      const needPromo = (piece === "P" && to[1] === 0) || (piece === "p" && to[1] === 7);
      if (needPromo) {
        setPromo({ square: to, piece });
        setBoard(finalBoard);
        setLastMove({ from: selected, to });
        setCastling((prev) => ({ ...prev, ...newCastling }));
        setEnPassant(newEnPassant);
        setSelected(null);
        return;
      }
      setBoard(finalBoard);
      setLastMove({ from: selected, to });
      setCastling((prev) => ({ ...prev, ...newCastling }));
      setEnPassant(newEnPassant);
      setWhiteTurn((t) => !t);
      setSelected(null);
      const opponentInCheck = isInCheck(finalBoard, !whiteTurn);
      const opponentHasMove = hasLegalMove(finalBoard, !whiteTurn, newCastling, newEnPassant);
      if (!opponentHasMove) setGameOver(opponentInCheck ? (whiteTurn ? "Black wins by checkmate" : "White wins by checkmate") : "Stalemate - draw");
    },
    [board, selected, enPassant, castling, gameOver, whiteTurn]
  );

  const handlePromo = useCallback(
    (choice: string) => {
      if (!promo) return;
      const next = copyBoard(board);
      next[promo.square[1]][promo.square[0]] = isWhite(promo.piece) ? choice : choice.toLowerCase();
      setBoard(next);
      setPromo(null);
      setWhiteTurn((t) => !t);
      const inCheckAfter = isInCheck(next, !whiteTurn);
      const hasMove = hasLegalMove(next, !whiteTurn, castling, null);
      if (!hasMove) setGameOver(inCheckAfter ? (whiteTurn ? "White wins by checkmate" : "Black wins by checkmate") : "Stalemate - draw");
    },
    [promo, board, whiteTurn, castling]
  );

  const handleClick = useCallback(
    (displayX: number, displayY: number) => {
      if (promo || gameOver) return;
      const boardY = 7 - displayY;
      const sq: Square = [displayX, boardY];
      const targetPiece = board[boardY][displayX];
      const isTargetLegal = legalMoves.some(([mx, my]) => mx === displayX && my === boardY);

      if (selected && isTargetLegal) {
        handleMove(sq);
        return;
      }
      if (selected) {
        setSelected(null);
        return;
      }
      const canSelect = !whiteTurn && isBlack(targetPiece);
      if (canSelect && targetPiece !== ".") setSelected(sq);
    },
    [board, selected, legalMoves, whiteTurn, promo, gameOver, handleMove]
  );

  const isLegalTarget = useCallback(
    (displayX: number, displayY: number) => legalMoves.some(([mx, my]) => mx === displayX && my === 7 - displayY),
    [legalMoves]
  );

  const isLastMove = useCallback(
    (displayX: number, displayY: number) => {
      if (!lastMove) return false;
      const boardY = 7 - displayY;
      return (lastMove.from[0] === displayX && lastMove.from[1] === boardY) || (lastMove.to[0] === displayX && lastMove.to[1] === boardY);
    },
    [lastMove]
  );

  // AI plays White - when it's White's turn, pick and apply a move
  const runAIMove = useCallback(() => {
    const move = getAIMove(board, castling, enPassant);
    if (!move) return;
    const piece = board[move.from[1]][move.from[0]];
    const { board: nextBoard, newCastling, newEnPassant } = applyMove(board, move.from, move.to, enPassant, castling);
    const needPromo = piece === "P" && move.to[1] === 0;
    if (needPromo) {
      const final = copyBoard(nextBoard);
      final[move.to[1]][move.to[0]] = "Q";
      setBoard(final);
      setLastMove({ from: move.from, to: move.to });
      setCastling((prev) => ({ ...prev, ...newCastling }));
      setEnPassant(newEnPassant);
      setWhiteTurn(false);
      const opponentInCheck = isInCheck(final, false);
      const opponentHasMove = hasLegalMove(final, false, newCastling, newEnPassant);
      if (!opponentHasMove) setGameOver(opponentInCheck ? "Black wins by checkmate" : "Stalemate - draw");
    } else {
      setBoard(nextBoard.map((r) => [...r]));
      setLastMove({ from: move.from, to: move.to });
      setCastling((prev) => ({ ...prev, ...newCastling }));
      setEnPassant(newEnPassant);
      setWhiteTurn(false);
      const opponentInCheck = isInCheck(nextBoard, false);
      const opponentHasMove = hasLegalMove(nextBoard, false, newCastling, newEnPassant);
      if (!opponentHasMove) setGameOver(opponentInCheck ? "Black wins by checkmate" : "Stalemate - draw");
    }
  }, [board, castling, enPassant]);

  useEffect(() => {
    if (whiteTurn && !promo && !gameOver) {
      const timer = setTimeout(runAIMove, 400);
      return () => clearTimeout(timer);
    }
  }, [whiteTurn, promo, gameOver, runAIMove]);

  // On player win during unlock flow: mark file 2 decrypted
  useEffect(() => {
    if (gameOver === "White wins by checkmate" && pendingUnlock === 2) {
      markUnlocked(2, FILE_NAMES[2]);
      setPendingUnlock(null);
    }
  }, [gameOver, pendingUnlock, markUnlocked, setPendingUnlock]);

  // Display: Black at bottom (rows 0-1), White at top (rows 6-7). Flip rows for rendering.
  const displayBoard = useMemo(() => board.slice().reverse(), [board]);

  return (
    <div className="rounded border-2 border-black bg-[#c0c0c0] p-2 font-sans min-w-0 overflow-auto">
      <div className="mb-2 bg-[#000080] px-2 py-1 font-bold text-white text-xs sm:text-base flex flex-wrap items-center justify-between gap-1">
        <span>ORACLE Challenge - chess.exe</span>
        <span className="text-[10px] sm:text-sm font-normal">
          {gameOver ? gameOver : inCheck ? (whiteTurn ? "Black is in check" : "White is in check") : whiteTurn ? "AI thinking…" : "Your move (White)"}
        </span>
      </div>

      {promo && (
        <div className="mb-2 flex flex-wrap items-center gap-1 rounded border border-black bg-[#c0c0c0] p-2">
          <span className="text-xs">Promote to:</span>
          {(["Q", "R", "B", "N"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePromo(p)}
              className="flex h-8 w-8 items-center justify-center border border-[#808080] bg-[#e0e0e0] text-xl hover:bg-[#fff]"
            >
              {PIECES[isWhite(promo.piece) ? p : p.toLowerCase()]}
            </button>
          ))}
        </div>
      )}

      <div
        className="grid gap-0 w-fit max-w-full mx-auto"
        style={{
          gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
          gridTemplateRows: "repeat(8, minmax(0, 1fr))",
          width: "min(100%, 384px)",
          aspectRatio: "1",
        }}
      >
        {displayBoard.map((row, displayY) =>
          row.map((cell, displayX) => {
            const boardY = 7 - displayY;
            const light = (displayX + displayY) % 2 === 1;
            const baseBg = light ? "bg-[#eee]" : "bg-[#888]";
            const selectedBg = selected?.[0] === displayX && selected?.[1] === boardY ? "ring-2 ring-red-600 ring-inset" : "";
            const lastBg = isLastMove(displayX, displayY) ? (light ? "bg-[#baca44]" : "bg-[#8b9e2a]") : "";
            const legalDot = selected && isLegalTarget(displayX, displayY) && cell === "." ? "before:content-[''] before:absolute before:inset-0 before:m-auto before:w-2 before:h-2 before:rounded-full before:bg-black/40" : "";
            const legalCapture = selected && isLegalTarget(displayX, displayY) && cell !== "." ? "ring-2 ring-inset ring-red-500/80" : "";
            const pieceColor = cell !== "." ? (isWhite(cell) ? "text-[#1a1a1a] [text-shadow:-2px_-2px_0_#000,-2px_0_0_#000,-2px_2px_0_#000,0_-2px_0_#000,0_2px_0_#000,2px_-2px_0_#000,2px_0_0_#000,2px_2px_0_#000]" : "text-[#f0f0f0]") : "";
            return (
              <button
                key={`${displayY}-${displayX}`}
                type="button"
                onClick={() => handleClick(displayX, displayY)}
                className={`relative flex aspect-square min-h-[32px] min-w-[32px] max-h-[48px] max-w-[48px] w-full h-full items-center justify-center text-xl sm:text-3xl ${pieceColor} ${lastBg || baseBg} ${selectedBg} ${legalCapture} ${legalDot} ${inCheck && cell === "k" ? "ring-2 ring-red-600" : ""}`}
              >
                {cell !== "." ? PIECES[cell] ?? cell : null}
              </button>
            );
          })
        )}
      </div>

      {gameOver && (
        <div className="mt-2 text-center">
          <p className="text-sm font-bold">{gameOver}</p>
          {aiWon && (
            <button
              type="button"
              onClick={resetGame}
              className="mt-2 px-4 py-1 border-2 border-[#808080] bg-[#c0c0c0] font-bold text-sm hover:bg-[#d0d0d0] active:border-black"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
