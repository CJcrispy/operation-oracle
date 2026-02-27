"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { FILE_NAMES } from "@/lib/content";

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 90;
const PADDLE_HEIGHT = 12;
const PADDLE_WIDE_WIDTH = 140;
const BALL_RADIUS = 6;
const BRICK_COLS = 8;
const BRICK_ROWS = 6;
const BRICK_PADDING = 4;
const BRICK_OFFSET_TOP = 36;
const BRICK_OFFSET_LEFT = 12;
const BASE_BALL_SPEED = 5.5;
const MAX_BALL_SPEED = 12;
const SPEED_RAMP_PER_HIT = 0.08;
const MOVE_ROW = 2;
const MOVE_SPEED = 1.2;

const BRICK_COLORS = ["#00ff88", "#00ffcc", "#00ccff", "#ffaa00", "#ff6600", "#ff3366"];

type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  hit: boolean;
  hitsNeeded: number;
  hits: number;
  row: number;
  moveDir: number;
  baseX: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

type PowerUpType = "wide" | "slow" | "extra" | "sticky" | "life";
type PowerUp = { x: number; y: number; type: PowerUpType; vy: number };

type Ball = { x: number; y: number; dx: number; dy: number };

function createBricks(): Brick[] {
  const w = (CANVAS_WIDTH - BRICK_OFFSET_LEFT * 2 - BRICK_PADDING * (BRICK_COLS - 1)) / BRICK_COLS;
  const h = 16;
  const bricks: Brick[] = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    const moveDir = row === MOVE_ROW ? (Math.random() > 0.5 ? 1 : -1) : 0;
    for (let col = 0; col < BRICK_COLS; col++) {
      const x = BRICK_OFFSET_LEFT + col * (w + BRICK_PADDING);
      bricks.push({
        x,
        y: BRICK_OFFSET_TOP + row * (h + BRICK_PADDING),
        w,
        h,
        hit: false,
        hitsNeeded: row === 0 ? 3 : row <= 2 ? 2 : 1,
        hits: 0,
        row,
        moveDir,
        baseX: x,
      });
    }
  }
  return bricks;
}

function spawnParticles(x: number, y: number, color: string, count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const v = 2 + Math.random() * 4;
    out.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 2,
      life: 1,
      color,
    });
  }
  return out;
}

function maybeSpawnPowerUp(x: number, y: number): PowerUp | null {
  if (Math.random() > 0.25) return null;
  const types: PowerUpType[] = ["wide", "slow", "extra", "sticky", "life"];
  const t = types[Math.floor(Math.random() * types.length)];
  return { x: x + 20, y, type: t, vy: 2 };
}

export default function BreakoutGame() {
  const { pendingUnlock, markUnlocked, setPendingUnlock } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bricksLeft, setBricksLeft] = useState(BRICK_COLS * BRICK_ROWS);
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const [running, setRunning] = useState(false);
  const [lives, setLives] = useState(3);
  const livesRef = useRef(3);

  const gameState = useRef({
    bricks: createBricks(),
    balls: [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 0, dy: 0 }] as Ball[],
    paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    paddleWidth: PADDLE_WIDTH,
    ballLaunched: false,
    speedMultiplier: 1,
    particles: [] as Particle[],
    powerUps: [] as PowerUp[],
    lastBrickHitTime: 0,
    comboCount: 0,
    comboText: null as { text: string; x: number; y: number; t: number } | null,
    wideUntil: 0,
    slowUntil: 0,
    sticky: false,
    screenShake: 0,
    movePhase: 0,
  });
  const mouseX = useRef(gameState.current.paddleX);
  const rafId = useRef<number | null>(null);

  const reset = useCallback(() => {
    gameState.current = {
      bricks: createBricks(),
      balls: [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 60, dx: 0, dy: 0 }],
      paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
      paddleWidth: PADDLE_WIDTH,
      ballLaunched: false,
      speedMultiplier: 1,
      particles: [],
      powerUps: [],
      lastBrickHitTime: 0,
      comboCount: 0,
      comboText: null,
      wideUntil: 0,
      slowUntil: 0,
      sticky: false,
      screenShake: 0,
      movePhase: 0,
    };
    mouseX.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    setBricksLeft(BRICK_COLS * BRICK_ROWS);
    setGameOver(null);
    setRunning(false);
  }, []);

  const launchBall = useCallback(() => {
    const gs = gameState.current;
    if (!gs.ballLaunched && gs.balls.length > 0) {
      gs.ballLaunched = true;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      const speed = BASE_BALL_SPEED * gs.speedMultiplier;
      gs.balls[0].dx = Math.cos(angle) * speed;
      gs.balls[0].dy = Math.sin(angle) * speed;
    }
  }, []);

  const start = useCallback(() => {
    reset();
    livesRef.current = 3;
    setLives(3);
    setRunning(true);
  }, [reset]);

  useEffect(() => {
    if (!running || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paddleY = CANVAS_HEIGHT - PADDLE_HEIGHT - 8;
    const now = () => performance.now() / 1000;

    const loop = () => {
      const gs = gameState.current;
      const t = now();

      if (t > gs.wideUntil) gs.paddleWidth = PADDLE_WIDTH;
      if (t > gs.slowUntil) gs.speedMultiplier = Math.min(gs.speedMultiplier, 1.5);

      const pw = gs.paddleWidth;
      const px = Math.max(0, Math.min(CANVAS_WIDTH - pw, mouseX.current - pw / 2 + PADDLE_WIDTH / 2));
      gs.paddleX = px;

      gs.movePhase += 0.03;
      gs.bricks.forEach((b) => {
        if (b.moveDir !== 0) {
          b.x = b.baseX + Math.sin(gs.movePhase) * 30 * b.moveDir;
        }
      });

      gs.particles = gs.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        return p.life > 0;
      });

      gs.powerUps = gs.powerUps.filter((pu) => {
        pu.y += pu.vy;
        if (pu.y > CANVAS_HEIGHT) return false;
        const py = paddleY;
        if (
          pu.y + 12 >= py &&
          pu.y <= py + PADDLE_HEIGHT &&
          pu.x >= px &&
          pu.x <= px + pw
        ) {
          if (pu.type === "wide") gs.wideUntil = t + 8;
          if (pu.type === "slow") gs.slowUntil = t + 6;
          if (pu.type === "extra") {
            const speed = BASE_BALL_SPEED * gs.speedMultiplier;
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
            gs.balls.push({
              x: px + pw / 2,
              y: paddleY - BALL_RADIUS - 2,
              dx: Math.cos(angle) * speed,
              dy: Math.sin(angle) * speed,
            });
          }
          if (pu.type === "sticky") gs.sticky = true;
          if (pu.type === "life") {
            livesRef.current += 1;
            setLives((l) => l + 1);
          }
          return false;
        }
        return true;
      });

      if (gs.screenShake > 0) gs.screenShake -= 0.3;

      if (!gs.ballLaunched) {
        gs.balls[0].x = px + pw / 2;
        gs.balls[0].y = paddleY - BALL_RADIUS - 2;
      }

      const speedScale = t < gs.slowUntil ? 0.6 : 1;
      const sm = Math.min(MAX_BALL_SPEED / BASE_BALL_SPEED, gs.speedMultiplier);

      const ballsToAdd: Ball[] = [];
      let lostBall = false;

      for (let bi = gs.balls.length - 1; bi >= 0; bi--) {
        const ball = gs.balls[bi];
        if (!gs.ballLaunched && bi === 0) continue;

        let ballX = ball.x;
        let ballY = ball.y;
        let dx = ball.dx * speedScale * sm;
        let dy = ball.dy * speedScale * sm;

        ballX += dx;
        ballY += dy;

        if (ballX - BALL_RADIUS < 0 || ballX + BALL_RADIUS > CANVAS_WIDTH) dx = -dx;
        if (ballY - BALL_RADIUS < 0) dy = -dy;

        if (ballY + BALL_RADIUS > CANVAS_HEIGHT) {
          if (gs.sticky && gs.balls.length === 1) {
            gs.ballLaunched = false;
            ball.x = px + pw / 2;
            ball.y = paddleY - BALL_RADIUS - 2;
            ball.dx = 0;
            ball.dy = 0;
            gs.sticky = false;
          } else {
            gs.balls.splice(bi, 1);
            lostBall = true;
          }
          continue;
        }

        if (
          ballY + BALL_RADIUS >= paddleY &&
          ballY - BALL_RADIUS <= paddleY + PADDLE_HEIGHT &&
          ballX >= px &&
          ballX <= px + pw
        ) {
          dy = -Math.abs(dy);
          const hitPos = (ballX - px) / pw;
          dx = (hitPos - 0.5) * 10;
          gs.speedMultiplier = Math.min(gs.speedMultiplier + SPEED_RAMP_PER_HIT, MAX_BALL_SPEED / BASE_BALL_SPEED);
        }

        for (let i = 0; i < gs.bricks.length; i++) {
          const b = gs.bricks[i];
          if (b.hit) continue;
          if (
            ballX + BALL_RADIUS >= b.x &&
            ballX - BALL_RADIUS <= b.x + b.w &&
            ballY + BALL_RADIUS >= b.y &&
            ballY - BALL_RADIUS <= b.y + b.h
          ) {
            b.hits++;
            const brickCenterX = b.x + b.w / 2;
            const brickCenterY = b.y + b.h / 2;
            const color = BRICK_COLORS[b.row % BRICK_COLORS.length];
            gs.particles.push(...spawnParticles(brickCenterX, brickCenterY, color, 8));
            gs.screenShake = 3;

            const dt = t - gs.lastBrickHitTime;
            if (dt < 0.5) {
              gs.comboCount++;
              gs.comboText = { text: `${gs.comboCount}x COMBO!`, x: brickCenterX, y: brickCenterY, t: 1 };
            } else {
              gs.comboCount = 1;
            }
            gs.lastBrickHitTime = t;

            if (b.hits >= b.hitsNeeded) {
              b.hit = true;
              setBricksLeft((prev) => prev - 1);
              const pu = maybeSpawnPowerUp(brickCenterX, b.y);
              if (pu) gs.powerUps.push(pu);
            }
            dy = -dy;
            gs.speedMultiplier = Math.min(gs.speedMultiplier + SPEED_RAMP_PER_HIT * 0.5, MAX_BALL_SPEED / BASE_BALL_SPEED);
            break;
          }
        }

        ball.x = ballX;
        ball.y = ballY;
        ball.dx = dx / (speedScale * sm);
        ball.dy = dy / (speedScale * sm);
      }

      if (lostBall) {
        if (gs.balls.length === 0) {
          const newLives = livesRef.current - 1;
          livesRef.current = newLives;
          setLives(newLives);
          if (newLives <= 0) {
            setGameOver("lose");
            setRunning(false);
            return;
          }
          gs.balls = [{ x: px + pw / 2, y: paddleY - BALL_RADIUS - 2, dx: 0, dy: 0 }];
          gs.ballLaunched = false;
        }
      }

      if (gs.wideUntil > t) gs.paddleWidth = PADDLE_WIDE_WIDTH;

      const remaining = gs.bricks.filter((b) => !b.hit);
      if (remaining.length === 0) {
        setGameOver("win");
        setRunning(false);
        if (pendingUnlock === 5) {
          markUnlocked(5, FILE_NAMES[5]);
          setPendingUnlock(null);
        }
        return;
      }

      const shakeX = gs.screenShake > 0 ? (Math.random() - 0.5) * gs.screenShake : 0;
      const shakeY = gs.screenShake > 0 ? (Math.random() - 0.5) * gs.screenShake : 0;
      ctx.save();
      ctx.translate(shakeX, shakeY);

      ctx.fillStyle = "#0c0c0c";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      gs.bricks.forEach((b) => {
        if (b.hit) return;
        const color = BRICK_COLORS[b.row % BRICK_COLORS.length];
        ctx.fillStyle = color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = "#00cc66";
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        if (b.hitsNeeded > 1) {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(String(b.hitsNeeded - b.hits), b.x + b.w / 2, b.y + b.h / 2 + 4);
        }
      });

      if (gs.comboText) {
        gs.comboText.t -= 0.02;
        if (gs.comboText.t > 0) {
          ctx.globalAlpha = gs.comboText.t;
          ctx.fillStyle = "#ffff00";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(gs.comboText.text, gs.comboText.x, gs.comboText.y - 20);
          ctx.globalAlpha = 1;
        } else {
          gs.comboText = null;
        }
      }

      gs.particles.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      gs.powerUps.forEach((pu) => {
        const colors: Record<PowerUpType, string> = {
          wide: "#ffaa00",
          slow: "#00aaff",
          extra: "#ff44aa",
          sticky: "#aaff44",
          life: "#44ff44",
        };
        ctx.fillStyle = colors[pu.type];
        ctx.fillRect(pu.x - 10, pu.y, 20, 12);
      });

      ctx.fillStyle = "#00ffea";
      ctx.fillRect(px, paddleY, gs.paddleWidth, PADDLE_HEIGHT);

      gs.balls.forEach((ball) => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [running, gameOver, pendingUnlock, markUnlocked, setPendingUnlock]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      mouseX.current = (e.clientX - rect.left) * scaleX;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        launchBall();
      }
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        e.preventDefault();
        mouseX.current = Math.max(0, mouseX.current - 20);
      }
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        e.preventDefault();
        mouseX.current = Math.min(CANVAS_WIDTH, mouseX.current + 20);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [launchBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleClick = () => launchBall();
    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [launchBall]);

  useEffect(() => {
    if (!running && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const gs = gameState.current;
        ctx.fillStyle = "#0c0c0c";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gs.bricks.forEach((b) => {
          if (b.hit) return;
          ctx.fillStyle = BRICK_COLORS[b.row % BRICK_COLORS.length];
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = "#00cc66";
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        });
        ctx.fillStyle = "#00ffea";
        ctx.fillRect(gs.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 8, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(gs.balls[0]?.x ?? CANVAS_WIDTH / 2, gs.balls[0]?.y ?? CANVAS_HEIGHT - 60, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [running, gameOver]);

  return (
    <div className="rounded border-2 border-black bg-[#c0c0c0] p-2 font-sans min-w-0 overflow-auto">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 bg-[#000080] px-2 py-1 font-bold text-white text-xs sm:text-base">
        <span>ORACLE Challenge - BREAKOUT.EXE</span>
        <span className="font-normal">Mouse / A,D or Arrows. Space/Click to launch.</span>
      </div>
      {!running && !gameOver && (
        <p className="mb-2 text-sm">
          Click <strong>Start</strong>. Ball sticks to paddle until you <strong>Space</strong> or <strong>Click</strong>.
          Move with mouse or A/D keys. Break all bricks!
        </p>
      )}
      {gameOver && (
        <p className={`mb-2 font-bold ${gameOver === "win" ? "text-green-700" : "text-red-700"}`}>
          {gameOver === "win" ? "All bricks destroyed. Fragment recovered." : "Ball lost. Reboot to retry."}
        </p>
      )}
      <div className="relative inline-block overflow-hidden rounded border-2 border-[#404040] bg-[#0c0c0c]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block cursor-none"
          style={{ width: "100%", maxWidth: CANVAS_WIDTH, imageRendering: "pixelated" }}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-4 items-center">
        {!running && (
          <button
            type="button"
            onClick={gameOver ? reset : start}
            className="rounded border-2 border-[#808080] bg-[#c0c0c0] px-4 py-1 font-bold text-sm hover:bg-[#d0d0d0]"
          >
            {gameOver ? "Reset" : "Start"}
          </button>
        )}
        {running && (
          <>
            <span className="py-1 text-sm">Bricks: {bricksLeft}</span>
            <span className="py-1 text-sm">Lives: {lives}</span>
          </>
        )}
      </div>
    </div>
  );
}
