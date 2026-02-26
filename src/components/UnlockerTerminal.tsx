"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const INITIAL_LINES = [
  "UNLOCKER.sys [v0.72 - ECTH Distro]",
  "Scanning local node...",
  "Found 7 locked modules.",
  "Cognitive shielding: WEAK",
  "User access: GRANTED [INTERN]",
  "",
  "Available Files:",
  "[1] FROGFACTS.TXT         - Encrypted - Behavioral Ghosts",
  "[2] SANDWICHMAKER.BAT     - Flagged - UI Injection",
  "[3] BEEPBOOP.ZIP          - Encoded - Signal Embed",
  "[4] GARFIELD.EXE          - Masked - Identity Interference",
  "[5] SLIME2.HTML           - Network - Spreading Node Active",
  "[6] UNCLEDONK.PPT         - Fragmented - Cult Doctrine",
  "[7] DO_NOT_OPEN_THIS_ONE.OKAY - Vaulted - Final Protocol",
  "",
];

type TerminalLine = { type: "output" | "input" | "response"; text: string };

function processCommand(cmd: string): string {
  switch (cmd.toLowerCase()) {
    case "unlock 1":
      return ">> UNLOCK SEQUENCE INITIATED: FROGFACTS.TXT\n>> Decryption active...\n>> Puzzle launch available.";
    case "analyze 1":
      return ">> File flagged for behavioral overwrite. Tracking patterns embedded.";
    case "help":
      return "> Commands: unlock [#], analyze [#], log, containment_status";
    default:
      return "> Unknown command or locked sequence.";
  }
}

type UnlockerTerminalProps = { embedded?: boolean };

export default function UnlockerTerminal({ embedded = false }: UnlockerTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(
    INITIAL_LINES.map((text) => ({ type: "output", text }))
  );
  const [input, setInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;

      setLines((prev) => [
        ...prev,
        { type: "input", text: `> ${cmd}` },
        { type: "response", text: processCommand(cmd) },
      ]);
      setInput("");
      inputRef.current?.focus();
    },
    [input]
  );

  const terminalContent = (
    <>
      <div
        ref={terminalRef}
        className={`overflow-y-auto border border-[#3c3c3c] bg-[#0c0c0c] p-3 sm:p-4 font-mono text-xs sm:text-sm text-[#00ffea] ${embedded ? "min-h-[200px] h-[min(380px,60dvh)]" : "min-h-[240px] h-[min(400px,70dvh)] border-t"}`}
      >
          {lines.map((line, i) => (
            <div
              key={i}
              className="mb-2 whitespace-pre-wrap"
              data-line-type={line.type}
            >
              {line.text}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex">
            <span className="mr-1.5">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm text-[#00ffea] outline-none placeholder:text-[#00ffea]/60"
              placeholder=""
              autoFocus
              autoComplete="off"
            />
          </form>
        </div>
    </>
  );

  if (embedded) {
    return <div className="h-full font-mono text-[#dcdcdc]">{terminalContent}</div>;
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
