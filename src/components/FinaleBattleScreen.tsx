"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import {
  BATTLE_ABILITIES,
  BATTLE_DAMAGE,
  BATTLE_MENU_LABELS,
  BATTLE_FAIL_CHANCE,
  ORACLE_COUNTER_LINES,
  ORACLE_COUNTER_ATTACK_CHANCE,
  ORACLE_COUNTER_AMOUNT,
  ORACLE_ATTACK_LINES,
  ORACLE_ATTACK_DAMAGE,
  HEAL_AMOUNT,
  DEFEND_DAMAGE_REDUCTION,
} from "@/lib/content";

const MENU_OPTIONS = BATTLE_ABILITIES.map((c) => ({ id: c, label: BATTLE_MENU_LABELS[c] ?? c }));

export default function FinaleBattleScreen() {
  const {
    oracleStability,
    playerHealth,
    reduceOracleStability,
    increaseOracleStability,
    reducePlayerHealth,
    increasePlayerHealth,
    setFinaleOutcome,
    setFinalePhase,
    setDesktopBlackout,
  } = useGame();

  const [dialogue, setDialogue] = useState("you were never decrypting me. you were compiling me.");
  const [menuVisible, setMenuVisible] = useState(true);
  const [busy, setBusy] = useState(false);
  const [defending, setDefending] = useState(false);
  const oracleFullRestores = useRef(0);

  const oracleAttacksPlayer = useCallback(
    (damageMultiplier: number = 1) => {
      const base = Math.floor(
        ORACLE_ATTACK_DAMAGE.min +
          Math.random() * (ORACLE_ATTACK_DAMAGE.max - ORACLE_ATTACK_DAMAGE.min + 1)
      );
      const finalDamage = Math.max(1, Math.floor(base * damageMultiplier));
      reducePlayerHealth(finalDamage);
      const line = ORACLE_ATTACK_LINES[Math.floor(Math.random() * ORACLE_ATTACK_LINES.length)];
      setDialogue(`${line} (-${finalDamage} HP)`);
    },
    [reducePlayerHealth]
  );

  const executeCommand = useCallback(
    (cmd: (typeof BATTLE_ABILITIES)[number]) => {
      if (busy || oracleStability <= 0 || playerHealth <= 0) return;

      setBusy(true);
      setMenuVisible(false);
      const wasDefending = defending;
      setDefending(false);

      if (cmd === "defend") {
        setDefending(true);
        setDialogue("Shields raised. Damage reduced for next attack.");
        setTimeout(() => {
          oracleAttacksPlayer(DEFEND_DAMAGE_REDUCTION);
          setTimeout(() => {
            setMenuVisible(true);
            setBusy(false);
          }, 1200);
        }, 800);
        return;
      }

      if (cmd === "heal") {
        increasePlayerHealth(HEAL_AMOUNT);
        setDialogue(`Access patterns stabilized. +${HEAL_AMOUNT} HP`);
        setTimeout(() => {
          oracleAttacksPlayer(1);
          setTimeout(() => {
            setMenuVisible(true);
            setBusy(false);
          }, 1200);
        }, 800);
        return;
      }

      // Attack commands
      const delay = 800 + Math.random() * 600;
      const fail = Math.random() < BATTLE_FAIL_CHANCE;
      if (fail) {
        const counter = ORACLE_COUNTER_LINES[Math.floor(Math.random() * ORACLE_COUNTER_LINES.length)];
        setDialogue(counter);
        setTimeout(() => {
          oracleAttacksPlayer(wasDefending ? DEFEND_DAMAGE_REDUCTION : 1);
          setTimeout(() => {
            setMenuVisible(true);
            setBusy(false);
          }, 1200);
        }, 800);
        return;
      }

      const damage = BATTLE_DAMAGE[cmd] ?? 10;
      reduceOracleStability(damage);
      const newStability = Math.max(0, oracleStability - damage);

      const actionLines: Record<string, string> = {
        trace: "Signal origin identified. Eli Island relay active.",
        sever: "Connection severed.",
        contain: "Containment protocols enforced.",
        override: "Override sequence initiated.",
        shutdown: "Shutdown command sent.",
      };
      setDialogue(actionLines[cmd] ?? "Command executed.");

      setTimeout(() => {
        const counter =
          Math.random() < 0.65
            ? ORACLE_COUNTER_LINES[Math.floor(Math.random() * ORACLE_COUNTER_LINES.length)]
            : null;
        if (counter) setDialogue(counter);

        if (newStability > 0 && Math.random() < ORACLE_COUNTER_ATTACK_CHANCE) {
          const restore = Math.floor(
            ORACLE_COUNTER_AMOUNT.min +
              Math.random() * (ORACLE_COUNTER_AMOUNT.max - ORACLE_COUNTER_AMOUNT.min + 1)
          );
          setTimeout(() => {
            increaseOracleStability(restore);
            setDialogue(`// counter-attack. stability restored +${restore}%`);
            const afterRestore = Math.min(100, newStability + restore);
            if (afterRestore >= 100) {
              oracleFullRestores.current += 1;
              if (oracleFullRestores.current >= 3) {
                setFinaleOutcome("lose");
                setFinalePhase("revelation");
                setDesktopBlackout(true);
                setDialogue("instance override complete. you have been processed.");
                setBusy(false);
                return;
              }
            }
            oracleAttacksPlayer(wasDefending ? DEFEND_DAMAGE_REDUCTION : 1);
            setTimeout(() => {
              setMenuVisible(true);
              setBusy(false);
            }, 1200);
          }, 800);
        } else {
          if (newStability > 0) oracleFullRestores.current = 0;
          oracleAttacksPlayer(wasDefending ? DEFEND_DAMAGE_REDUCTION : 1);
          setTimeout(() => {
            setMenuVisible(true);
            setBusy(false);
          }, 1200);
        }
      }, delay);
    },
    [
      busy,
      oracleStability,
      playerHealth,
      defending,
      reduceOracleStability,
      increaseOracleStability,
      increasePlayerHealth,
      oracleAttacksPlayer,
      setFinaleOutcome,
      setFinalePhase,
      setDesktopBlackout,
    ]
  );

  // Win condition: oracle stability hits 0
  useEffect(() => {
    if (oracleStability <= 0 && !busy) {
      setFinaleOutcome("win");
      setFinalePhase("revelation");
      setDesktopBlackout(true);
      setDialogue("backup instance initialized. containment restored.");
      setMenuVisible(false);
    }
  }, [oracleStability, busy, setFinaleOutcome, setFinalePhase, setDesktopBlackout]);

  // Lose condition: player health hits 0
  useEffect(() => {
    if (playerHealth <= 0 && !busy) {
      setFinaleOutcome("lose");
      setFinalePhase("revelation");
      setDesktopBlackout(true);
      setDialogue("instance override complete. you have been processed.");
      setMenuVisible(false);
    }
  }, [playerHealth, busy, setFinaleOutcome, setFinalePhase, setDesktopBlackout]);

  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-[#0a0a0a] font-mono text-[#e8e8e8] animate-battle-transition">
      {/* Oracle "sprite" area */}
      <div className="flex min-h-0 flex-1 items-center justify-center border-b-2 border-amber-600/40 bg-[#0d0d0d] p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-lg border-2 border-amber-500/60 bg-amber-950/30 text-4xl sm:text-5xl animate-pulse"
            style={{ boxShadow: "0 0 24px rgba(251,191,36,0.2)" }}
          >
            ★
          </div>
          <p className="text-xs uppercase tracking-widest text-amber-500/90">ORACLE</p>
          <p className="text-center text-xs text-amber-400/60">Cognitive Instance — Eli Island Relay</p>
        </div>
      </div>

      {/* Oracle stability + Player health bars */}
      <div className="shrink-0 space-y-2 border-b border-amber-600/30 bg-[#080808] px-4 py-2">
        <div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-amber-400/90">ORACLE STABILITY</span>
            <span className={`font-bold ${oracleStability <= 25 ? "text-red-400" : "text-amber-400"}`}>
              {Math.max(0, oracleStability)}%
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.max(0, oracleStability)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-emerald-400/90">INTERN HP</span>
            <span className={`font-bold ${playerHealth <= 25 ? "text-red-400" : "text-emerald-400"}`}>
              {Math.max(0, playerHealth)}
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.max(0, playerHealth)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dialogue box */}
      <div className="animate-dialogue-pulse shrink-0 rounded-t-lg border-2 border-t border-l border-r border-amber-500/50 bg-[#0f0f0f] p-4 shadow-lg">
        {defending && <p className="mb-2 text-xs text-emerald-400/80">[Defending — next attack reduced]</p>}
        <p className="min-h-[3rem] text-sm sm:text-base italic text-amber-200/95">{dialogue}</p>

        {menuVisible && (
          <div className="mt-4 flex flex-wrap gap-2">
            {MENU_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => executeCommand(opt.id)}
                disabled={busy || oracleStability <= 0 || playerHealth <= 0}
                className={`rounded border-2 px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  opt.id === "defend"
                    ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-900/50"
                    : opt.id === "heal"
                    ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-200 hover:border-cyan-400 hover:bg-cyan-900/50"
                    : "border-amber-500/60 bg-amber-950/40 text-amber-200 hover:border-amber-400 hover:bg-amber-900/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {busy && <p className="mt-2 text-xs text-amber-500/70">Oracle is responding...</p>}
      </div>
    </div>
  );
}
