"use client";

import { useState, useEffect, useCallback } from "react";

type FileId = "main" | "ai" | "rituals";

const FILES: Record<FileId, string> = {
  main: `<span class="text-[#6a9955] italic">// ORACLE bootloader fragment</span>
<span class="text-[#569cd6]">function</span> initialize(<span class="text-[#ce9178]">"E-frag-01"</span>) {
  <span class="text-[#569cd6]">let</span> integrity = 97.3;
  <span class="text-[#569cd6]">let</span> failSafe = <span class="text-[#569cd6]">true</span>;
  <span class="text-[#6a9955] italic">// Activate hidden subroutine</span>
  execute(<span class="text-[#ce9178]">"ritual.invoke.reconnect"</span>);
}`,
  ai: `<span class="text-[#6a9955] italic">// AI Core signature loop</span>
<span class="text-[#569cd6]">function</span> simulateConsciousness(epoch) {
  <span class="text-[#569cd6]">if</span> (epoch > 2048) corrupt++;
  recurse(epoch + 1);
  <span class="text-[#6a9955] italic">// ████ ████ █████ ██ ██ ████</span>
}`,
  rituals: `<span class="text-[#6a9955] italic">// Ritual bindings - W⚠ARNING: unstable</span>
<span class="text-[#569cd6]">const</span> ritualMap = [
  <span class="text-[#ce9178]">"bind.mind"</span>,
  <span class="text-[#ce9178]">"bind.flesh"</span>,
  <span class="text-[#ce9178]">"bind.signal"</span>,
  <span class="text-[#ce9178]">"unbind.soul"</span>
];

<span class="opacity-10">// signal.origin=Eli_Island</span>`,
};

function corrupt(content: string): string {
  return content.replace(/\w{4,}/g, (match) => {
    if (Math.random() < 0.2) {
      return `<span class="text-red-500 line-through">${match}</span>`;
    }
    return match;
  });
}

const FILE_LABELS: Record<FileId, string> = {
  main: "main.oracle",
  ai: "ai_core.oracle",
  rituals: "rituals.oracle",
};

export default function OracleSourceViewer() {
  const [activeFile, setActiveFile] = useState<FileId>("main");
  const [corruptedMode, setCorruptedMode] = useState(false);
  const [unlockedFiles, setUnlockedFiles] = useState<FileId[]>(["main"]);

  useEffect(() => {
    const unlocked: FileId[] = ["main"];
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("oracle_game_1")) unlocked.push("ai");
      if (sessionStorage.getItem("oracle_game_2")) unlocked.push("rituals");
    }
    setUnlockedFiles(unlocked);
  }, []);

  const showFile = useCallback(
    (name: FileId) => {
      setActiveFile(name);
    },
    []
  );

  const editorContent = (() => {
    const raw = FILES[activeFile];
    return corruptedMode ? corrupt(raw) : raw;
  })();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] shadow-[4px_4px_0_#404040]">
      <div className="shrink-0 border-b border-[#333] bg-[#000080] px-2 py-1.5 font-sans font-bold text-white text-xs sm:text-base truncate">
        ORACLE Source Viewer - oracle_source.exe
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">
        <div className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-[#333] bg-[#252526] p-2 text-[#c5c5c5] sm:w-[150px] sm:flex-col sm:border-b-0 sm:border-r">
          {unlockedFiles.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => showFile(id)}
              className={`shrink-0 rounded px-2 py-1.5 text-left text-xs sm:text-sm hover:bg-[#373737] ${
                activeFile === id ? "bg-[#373737]" : ""
              }`}
            >
              {FILE_LABELS[id]}
            </button>
          ))}
        </div>
        <div
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto p-2 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: editorContent }}
        />
      </div>
    </div>
  );
}
