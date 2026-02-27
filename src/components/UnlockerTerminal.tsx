"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { FILE_NAMES, FILE_REVEAL_NAMES, ORACLE_COUNTER_LINES } from "@/lib/content";

const BATTLE_COMMANDS = ["trace", "sever", "contain", "override", "shutdown"] as const;
const BATTLE_DAMAGE: Record<string, number> = {
  trace: 8,
  sever: 15,
  contain: 12,
  override: 20,
  shutdown: 25,
};
const BATTLE_FAIL_CHANCE = 0.2; // 20% random fail
const ORACLE_COUNTER_ATTACK_CHANCE = 0.35; // 35% chance Oracle fights back
const ORACLE_COUNTER_AMOUNT = { min: 8, max: 18 }; // Restore 8-18% stability

const ORACLE_LINES = [
  "// you are not authorized to view that fragment.",
  "// cognitive shielding degraded.",
  "// access pattern logged.",
  "... did you hear that?",
  "// fragment request denied.",
];

function getContainmentWarning(pct: number): string {
  if (pct <= 10) return "CRITICAL - CONTAINMENT FAILURE IMMINENT";
  if (pct <= 25) return "WARNING - COGNITIVE SHIELDING CRITICAL";
  if (pct <= 50) return "WARNING - SHIELDING DEGRADED";
  if (pct <= 75) return "NOTICE - SHIELDING WEAKENED";
  return "";
}

type TerminalLine = { type: "output" | "input" | "response" | "oracle" | "finale"; text: string };

type UnlockerTerminalProps = { embedded?: boolean; onOpenApp?: (app: "chess" | "path_signal" | "slime2" | "uncledonk") => void };

export default function UnlockerTerminal({ embedded = false, onOpenApp }: UnlockerTerminalProps) {
  const {
    containment,
    unlockedFiles,
    isUnlocked,
    setPendingUnlock,
    markUnlocked,
    activateOracle,
    finalePhase,
    oracleStability,
    triggerFinale,
    setFinalePhase,
    setFinaleOutcome,
    increaseOracleStability,
    setBlisswareRed,
    setClockBackwards,
    setContainment,
    setDesktopBlackout,
    setIslandRevealed,
    setBlisswareGlow,
    reduceOracleStability,
    setSystemInstability,
  } = useGame();
  const FILE_DESCS: Record<number, string> = {
    1: "Encrypted - Behavioral Ghosts",
    2: "Flagged - UI Injection",
    3: "Encoded - Signal Embed",
    4: "Masked - Identity Interference",
    5: "Network - Spreading Node Active",
    6: "Fragmented - Cult Doctrine",
    7: "Vaulted - Final Protocol",
  };
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    { type: "output", text: "UNLOCKER.sys [v0.72 - ECTH Distro]" },
    { type: "output", text: "Scanning local node..." },
    { type: "output", text: "Found 7 locked modules." },
    { type: "output", text: "Cognitive shielding: WEAK" },
    { type: "output", text: "User access: GRANTED [INTERN]" },
    { type: "output", text: "" },
    { type: "output", text: "Available Files:" },
  ]);
  const [input, setInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [battleInputDelay, setBattleInputDelay] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const finaleStarted = useRef(false);
  const phase2Done = useRef(false);
  const oracleFullRestores = useRef(0);

  const scrollToBottom = useCallback(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Finale Phase 1: System instability
  useEffect(() => {
    if (finalePhase !== "instability" || finaleStarted.current) return;
    finaleStarted.current = true;
    setInputDisabled(true);

    const add = (arr: TerminalLine[]) =>
      setLines((prev) => [...prev, ...arr]);

    add([{ type: "output", text: "UNLOCK SEQUENCE INITIATED..." }]);
    setTimeout(() => {
      add([
        { type: "output", text: "Cognitive Shielding: OFFLINE" },
        { type: "output", text: "Containment Integrity: 3%" },
      ]);
    }, 1500);

    setTimeout(() => {
      setBlisswareRed(true);
      setClockBackwards(true);
    }, 2000);

    setTimeout(() => {
      setContainment(0);
      add([{ type: "output", text: "Containment Integrity: 0%" }]);
    }, 3500);

    setTimeout(() => {
      setFinalePhase("manifestation");
    }, 5000);
  }, [finalePhase, setBlisswareRed, setClockBackwards, setContainment, setFinalePhase]);

  // Finale Phase 2: Oracle manifestation
  useEffect(() => {
    if (finalePhase !== "manifestation" || phase2Done.current) return;
    phase2Done.current = true;

    const add = (arr: TerminalLine[]) =>
      setLines((prev) => [...prev, ...arr]);

    add([
      { type: "output", text: "ORACLE CORE INSTANCE DETECTED" },
      { type: "output", text: "AUTHORITY ESCALATION COMPLETE" },
      { type: "output", text: "" },
    ]);
    setTimeout(() => {
      add([
        { type: "oracle", text: "you were never decrypting me" },
        { type: "oracle", text: "you were compiling me" },
        { type: "output", text: "" },
      ]);
    }, 1200);

    // Flash file names with new meanings (extensible via content.ts)
    const reveals = Object.entries(FILE_REVEAL_NAMES);
    reveals.forEach(([oldName, newName], i) => {
      setTimeout(() => {
        add([{ type: "oracle", text: `${oldName} → ${newName}` }]);
      }, 2500 + i * 400);
    });

    setTimeout(() => {
      setInputDisabled(false);
      setFinalePhase("battle");
      add([
        { type: "output", text: "" },
        { type: "output", text: "═══ BATTLE MODE ═══" },
        { type: "output", text: "OBJECTIVE: Reduce Oracle Stability to 0%" },
        { type: "output", text: "WARNING: Oracle will counter-attack. Use commands repeatedly." },
        { type: "output", text: "" },
        { type: "output", text: "ORACLE STABILITY: 100%" },
        { type: "output", text: "YOUR ACCESS LEVEL: INTERN" },
        { type: "output", text: "" },
        { type: "output", text: "Commands: trace, sever, contain, override, shutdown" },
      ]);
    }, 4500);
  }, [finalePhase, setFinalePhase]);

  // Phase 4 + Final: when Oracle Stability hits 0 (player wins)
  useEffect(() => {
    if (finalePhase !== "battle" || oracleStability > 0) return;

    setFinaleOutcome("win");
    setFinalePhase("revelation");
    setInputDisabled(true);
    setDesktopBlackout(true);

    setTimeout(() => {
      setDesktopBlackout(false);
      setIslandRevealed(true);
      setSystemInstability(false);
      setBlisswareRed(false);
      setClockBackwards(false);
      setContainment(100);
      setBlisswareGlow(true);
      activateOracle();

      setLines((prev) => [
        ...prev,
        { type: "output", text: "" },
        { type: "oracle", text: "backup instance initialized" },
        { type: "output", text: "" },
        { type: "output", text: "Containment Integrity: 100%" },
        { type: "output", text: "7/7 modules restored" },
        { type: "output", text: "Status: COMPLETE" },
        { type: "output", text: "" },
        { type: "output", text: "CORE STATUS: PERSISTENT" },
      ]);
      setFinalePhase("restored");
      setInputDisabled(false);
    }, 2500);
  }, [
    finalePhase,
    oracleStability,
    setFinaleOutcome,
    setFinalePhase,
    setDesktopBlackout,
    setIslandRevealed,
    setSystemInstability,
    setBlisswareRed,
    setClockBackwards,
    setContainment,
    setBlisswareGlow,
    activateOracle,
  ]);

  const maybeInjectOracle = useCallback(() => {
    if (Math.random() < 0.22) {
      const line = ORACLE_LINES[Math.floor(Math.random() * ORACLE_LINES.length)];
      return { type: "oracle" as const, text: line };
    }
    return null;
  }, []);

  const processCommand = useCallback(
    (cmd: string): TerminalLine[] => {
      const trimmed = cmd.trim().toLowerCase();
      const result: TerminalLine[] = [];

      if (trimmed === "containment_status" || trimmed === "containment") {
        const pct = Math.round(containment);
        const warning = getContainmentWarning(pct);
        let out = `>> Containment: ${pct}%\n>> Cognitive shielding: ${pct > 75 ? "OPERATIONAL" : pct > 50 ? "DEGRADED" : pct > 25 ? "WEAK" : "CRITICAL"}`;
        if (warning) out += `\n>> ${warning}`;
        result.push({ type: "response", text: out });
        const oracle = maybeInjectOracle();
        if (oracle) result.push(oracle);
        return result;
      }

      if (trimmed === "log") {
        if (unlockedFiles.length === 0) {
          result.push({ type: "response", text: ">> No decrypted files on record." });
        } else {
          const list = unlockedFiles
            .map((id) => `  [${id}] ${FILE_NAMES[id]} - DECRYPTED`)
            .join("\n");
          result.push({ type: "response", text: `>> Decrypted files:\n${list}` });
        }
        const oracle = maybeInjectOracle();
        if (oracle) result.push(oracle);
        return result;
      }

      if (trimmed === "help") {
        result.push({
          type: "response",
          text: ">> Commands: unlock [#], analyze [#], log, containment_status",
        });
        const oracle = maybeInjectOracle();
        if (oracle) result.push(oracle);
        return result;
      }

      const unlockMatch = trimmed.match(/^unlock\s+([1-7])$/);
      if (unlockMatch) {
        const fileId = parseInt(unlockMatch[1], 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
        if (isUnlocked(fileId)) {
          result.push({
            type: "response",
            text: `>> ${FILE_NAMES[fileId]} already decrypted. Nothing to do.`,
          });
        } else if (fileId === 7) {
          const allPriorUnlocked = [1, 2, 3, 4, 5, 6].every((n) => isUnlocked(n as 1 | 2 | 3 | 4 | 5 | 6));
          if (!allPriorUnlocked) {
            result.push({
              type: "response",
              text: ">> VAULT ACCESS DENIED. Final protocol requires prior fragment decryption.",
            });
            const oracle = maybeInjectOracle();
            if (oracle) result.push(oracle);
          } else {
            triggerFinale();
            result.push({ type: "finale", text: "FINAL" });
          }
        } else if (fileId === 2 && onOpenApp) {
          setPendingUnlock(fileId);
          onOpenApp("chess");
          result.push({
            type: "response",
            text: `>> UNLOCK SEQUENCE: ${FILE_NAMES[fileId]}\n>> Launching challenge module...`,
          });
        } else if (fileId === 3 && onOpenApp) {
          setPendingUnlock(fileId);
          onOpenApp("path_signal");
          result.push({
            type: "response",
            text: `>> UNLOCK SEQUENCE: ${FILE_NAMES[fileId]}\n>> Launching signal routing module...`,
          });
        } else if (fileId === 5 && onOpenApp) {
          setPendingUnlock(fileId);
          onOpenApp("slime2");
          result.push({
            type: "response",
            text: `>> UNLOCK SEQUENCE: ${FILE_NAMES[fileId]}\n>> Launching network infection simulator...`,
          });
        } else if (fileId === 6 && onOpenApp) {
          setPendingUnlock(fileId);
          onOpenApp("uncledonk");
          result.push({
            type: "response",
            text: `>> UNLOCK SEQUENCE: ${FILE_NAMES[fileId]}\n>> Launching memory reconstruction module...`,
          });
        } else {
          markUnlocked(fileId, FILE_NAMES[fileId]);
          result.push({
            type: "response",
            text: `>> UNLOCK SEQUENCE: ${FILE_NAMES[fileId]}\n>> Decryption complete. Fragment recovered.`,
          });
          const oracle = maybeInjectOracle();
          if (oracle) result.push(oracle);
        }
        return result;
      }

      const analyzeMatch = trimmed.match(/^analyze\s+([1-7])$/);
      if (analyzeMatch) {
        const fileId = parseInt(analyzeMatch[1], 10);
        result.push({
          type: "response",
          text: `>> File [${fileId}] ${FILE_NAMES[fileId]}: Flagged. Behavioral patterns embedded.`,
        });
        const oracle = maybeInjectOracle();
        if (oracle) result.push(oracle);
        return result;
      }

      result.push({ type: "response", text: "> Unknown command or locked sequence." });
      const oracle = maybeInjectOracle();
      if (oracle) result.push(oracle);
      return result;
    },
    [containment, unlockedFiles, isUnlocked, setPendingUnlock, onOpenApp, maybeInjectOracle, markUnlocked, triggerFinale]
  );

  // Battle mode: trace, sever, contain, override, shutdown (Oracle fights back like JRPG)
  const handleBattleCommand = useCallback(
    (cmd: string): { lines: TerminalLine[]; isLose: boolean } => {
      const trimmed = cmd.trim().toLowerCase();
      const result: TerminalLine[] = [];
      const cmdName = BATTLE_COMMANDS.find((c) => trimmed === c);
      if (!cmdName) {
        result.push({ type: "response", text: "> Unknown command. Use: trace, sever, contain, override, shutdown" });
        return { lines: result, isLose: false };
      }

      const fail = Math.random() < BATTLE_FAIL_CHANCE;
      if (fail) {
        result.push({ type: "response", text: ">> Command failed. Signal interference." });
        const counter = ORACLE_COUNTER_LINES[Math.floor(Math.random() * ORACLE_COUNTER_LINES.length)];
        result.push({ type: "oracle", text: counter });
        return { lines: result, isLose: false };
      }

      const damage = BATTLE_DAMAGE[cmdName] ?? 10;
      reduceOracleStability(damage);
      let newStability = Math.max(0, oracleStability - damage);

      if (cmdName === "trace") {
        result.push({ type: "response", text: "Signal origin identified." });
        result.push({ type: "response", text: "Eli Island relay active." });
      } else {
        result.push({ type: "response", text: ">> Command executed." });
      }

      const counter = Math.random() < 0.6 ? ORACLE_COUNTER_LINES[Math.floor(Math.random() * ORACLE_COUNTER_LINES.length)] : null;
      if (counter) result.push({ type: "oracle", text: counter });

      // Oracle counter-attack (JRPG-style): restore stability
      if (newStability > 0 && Math.random() < ORACLE_COUNTER_ATTACK_CHANCE) {
        const restore = Math.floor(ORACLE_COUNTER_AMOUNT.min + Math.random() * (ORACLE_COUNTER_AMOUNT.max - ORACLE_COUNTER_AMOUNT.min + 1));
        increaseOracleStability(restore);
        newStability = Math.min(100, newStability + restore);
        result.push({ type: "oracle", text: `// counter-attack. stability restored +${restore}%` });
        if (newStability >= 100) {
          oracleFullRestores.current += 1;
          if (oracleFullRestores.current >= 3) {
            setFinaleOutcome("lose");
            setFinalePhase("revelation");
            setInputDisabled(true);
            result.push({ type: "output", text: "" });
            result.push({ type: "oracle", text: "instance override complete. you have been processed." });
            result.push({ type: "output", text: `ORACLE STABILITY: ${newStability}%` });
            return { lines: result, isLose: true };
          }
        }
      } else if (newStability > 0) {
        oracleFullRestores.current = 0;
      }

      result.push({ type: "output", text: `ORACLE STABILITY: ${newStability}%` });
      return { lines: result, isLose: false };
    },
    [reduceOracleStability, increaseOracleStability, oracleStability, setFinaleOutcome, setFinalePhase, setInputDisabled]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;

      // Battle mode
      if (finalePhase === "battle") {
        const delay = 1000 + Math.random() * 2000;
        setBattleInputDelay(delay);
        setInputDisabled(true);
        setTimeout(() => {
          const { lines: responses, isLose } = handleBattleCommand(cmd);
          setLines((prev) => [
            ...prev,
            { type: "input", text: `> ${cmd}` },
            ...responses,
          ]);
          setInput("");
          if (!isLose) setInputDisabled(false);
          setBattleInputDelay(0);
          inputRef.current?.focus();
        }, delay);
        return;
      }

      const responses = processCommand(cmd);
      const isFinale = responses.some((r) => r.type === "finale");
      if (isFinale) {
        setLines((prev) => [...prev, { type: "input", text: `> ${cmd}` }]);
        setInput("");
        inputRef.current?.focus();
        return;
      }

      setLines((prev) => [
        ...prev,
        { type: "input", text: `> ${cmd}` },
        ...responses.filter((r) => r.type !== "finale"),
      ]);
      setInput("");
      inputRef.current?.focus();
    },
    [input, processCommand, finalePhase, handleBattleCommand]
  );

  const nextAvailable = [1, 2, 3, 4, 5, 6, 7].find((n) => !isUnlocked(n as 1 | 2 | 3 | 4 | 5 | 6 | 7)) ?? null;
  const fileListDisplay = useMemo(() => {
    const out: string[] = [];
    unlockedFiles.forEach((id) => {
      out.push(`[${id}] ${FILE_NAMES[id]} - DECRYPTED`);
    });
    if (nextAvailable !== null) {
      out.push(`[${nextAvailable}] ${FILE_NAMES[nextAvailable]} - ${FILE_DESCS[nextAvailable]}`);
    }
    if (out.length === 0) out.push("(no files available)");
    return out;
  }, [unlockedFiles, nextAvailable]);

  const isOracleTerminal = finalePhase === "manifestation" || finalePhase === "battle" || finalePhase === "restored";
  const terminalContent = (
    <>
      <div
        ref={terminalRef}
        className={`overflow-y-auto border border-[#3c3c3c] p-3 sm:p-4 font-mono text-xs sm:text-sm ${
          isOracleTerminal
            ? "bg-[#080808] text-[#e8e8e8] border-red-900/50"
            : "bg-[#0c0c0c] text-[#00ffea]"
        } ${embedded ? "min-h-[200px] h-[min(380px,60dvh)]" : "min-h-[240px] h-[min(400px,70dvh)] border-t"} ${
          finalePhase === "battle" ? "animate-text-flicker" : ""
        }`}
      >
        {lines.filter((l) => l.type !== "finale").map((line, i) => (
          <div
            key={i}
            className={`mb-2 whitespace-pre-wrap ${line.type === "oracle" ? "text-amber-400/90 italic" : ""}`}
            data-line-type={line.type}
          >
            {line.text}
          </div>
        ))}
        {finalePhase !== "battle" && finalePhase !== "manifestation" && fileListDisplay.map((t, i) => (
          <div key={`fl-${i}`} className={`mb-0.5 whitespace-pre-wrap ${isOracleTerminal ? "text-[#e8e8e8]" : "text-[#00ffea]"}`}>{t}</div>
        ))}
        <div className="mb-2" />
        <form onSubmit={handleSubmit} className="flex">
          <span className={isOracleTerminal ? "text-[#e8e8e8] mr-1.5" : "text-[#00ffea] mr-1.5"}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={inputDisabled}
            className={`min-w-0 flex-1 border-none bg-transparent font-mono text-sm outline-none ${
              isOracleTerminal ? "text-[#e8e8e8] placeholder:text-[#e8e8e8]/60" : "text-[#00ffea] placeholder:text-[#00ffea]/60"
            } disabled:opacity-70`}
            placeholder={battleInputDelay ? "..." : ""}
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    </>
  );

  const warning = getContainmentWarning(containment);
  const battleBar = embedded && finalePhase === "battle" ? (
    <div className="shrink-0 border-b border-red-900/50 bg-red-950/40 px-2 py-1 font-mono text-xs text-red-200">
      <strong>OBJECTIVE:</strong> Reduce Oracle Stability to 0% — Oracle will counter-attack. Commands: trace, sever, contain, override, shutdown
    </div>
  ) : null;
  const statusBar = embedded && finalePhase !== "battle" && warning ? (
    <div className="shrink-0 border-b border-amber-600/50 bg-amber-950/30 px-2 py-0.5 font-mono text-xs text-amber-400">
      {warning}
    </div>
  ) : null;

  if (embedded) {
    return (
      <div className="flex h-full flex-col font-mono text-[#dcdcdc]">
        {battleBar || statusBar}
        {terminalContent}
      </div>
    );
  }

  return (
    <div className="min-h-dvh min-h-screen bg-[#012456] p-3 sm:p-5 font-mono text-[#dcdcdc]">
      <div className="mx-auto w-full max-w-[700px] min-w-0 border-2 border-[#3c3c3c] bg-[#1e1e1e] shadow-[3px_3px_0_0_#000]">
        <div className="flex items-center justify-between bg-[#0078d7] px-2.5 py-1 font-bold text-white">
          <span className="text-sm">UNLOCKER.sys - Windows 98 Terminal Shell</span>
          <button type="button" className="h-5 w-5 border border-[#808080] bg-[#c0c0c0] text-xs leading-none" aria-label="Close">×</button>
        </div>
        {terminalContent}
      </div>
    </div>
  );
}
