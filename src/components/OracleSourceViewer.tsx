"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import type { DocId } from "@/context/GameContext";

const DOC_LABELS: Record<DocId, string> = {
  bootloader: "bootloader.oracle",
  f1: "FROGFACTS.TXT [decrypted]",
  f2: "SANDWICHMAKER.BAT [decrypted]",
  f3: "BEEPBOOP.ZIP [decrypted]",
  f4: "GARFIELD.EXE [decrypted]",
  f5: "SLIME2.HTML [decrypted]",
  f6: "UNCLEDONK.PPT [decrypted]",
  f7: "DO_NOT_OPEN_THIS_ONE.OKAY [decrypted]",
};

const DOCS: Record<DocId, string> = {
  bootloader: `<span class="text-[#6a9955] italic">// ORACLE bootloader - ECTH Distro</span>
<span class="text-[#569cd6]">function</span> initialize(<span class="text-[#ce9178]">"E-frag-00"</span>) {
  <span class="text-[#569cd6]">let</span> integrity = 97.3;
  <span class="text-[#569cd6]">let</span> cognitiveShielding = <span class="text-[#569cd6]">true</span>;
  <span class="text-[#6a9955] italic">// Backdoor failsafes: ACTIVE</span>
}`,
  f1: `<span class="text-[#6a9955]">[BEHAVIORAL GHOSTS - DECRYPTED]</span>
Internal memo: Pattern recognition overflow in FROGFACTS module.
References to "Cognitive Shielding" detected. Backdoor protocol ████.
<span class="text-[#6a9955] italic">// fragment.01.corrupted</span>`,
  f2: `<span class="text-[#6a9955]">[UI INJECTION - DECRYPTED]</span>
SANDWICHMAKER.BAT contains embedded challenge protocol.
Oracle uses strategic decision trees. Pattern: minimax approximation.
<span class="text-[#6a9955] italic">// Containment Log excerpt: "Behavioral override attempted"</span>`,
  f3: `<span class="text-[#6a9955]">[SIGNAL EMBED - DECRYPTED]</span>
BEEPBOOP.ZIP: Signal routing validation. Path-of-signal protocol.
References "Eli Island" in checksum. <span class="opacity-60">[REDACTED]</span>`,
  f4: `<span class="text-[#6a9955]">[IDENTITY INTERFERENCE - LOCKED]</span>
GARFIELD.EXE: Awaiting decryption.`,
  f5: `<span class="text-[#6a9955]">[NETWORK NODE - LOCKED]</span>
SLIME2.HTML: Awaiting decryption.`,
  f6: `<span class="text-[#6a9955]">[CULT DOCTRINE - LOCKED]</span>
UNCLEDONK.PPT: Awaiting decryption.`,
  f7: `<span class="text-[#6a9955]">[FINAL PROTOCOL - LOCKED]</span>
DO_NOT_OPEN_THIS_ONE.OKAY: Vault sealed.`,
};

function corrupt(content: string): string {
  return content.replace(/\w{4,}/g, (match) => {
    if (Math.random() < 0.15) {
      return `<span class="text-red-500/80 line-through">${match}</span>`;
    }
    return match;
  });
}

export default function OracleSourceViewer() {
  const { unlockedFiles, requestedDocId, setRequestedDocId } = useGame();
  const [activeFile, setActiveFile] = useState<DocId>("bootloader");

  const availableDocs: DocId[] = ["bootloader", ...unlockedFiles.map((id) => `f${id}` as DocId)];

  useEffect(() => {
    if (requestedDocId && availableDocs.includes(requestedDocId)) {
      setActiveFile(requestedDocId);
      setRequestedDocId(null);
    }
  }, [requestedDocId, availableDocs, setRequestedDocId]);

  useEffect(() => {
    if (!availableDocs.includes(activeFile)) {
      setActiveFile("bootloader");
    }
  }, [activeFile, availableDocs]);

  const editorContent = DOCS[activeFile] ?? DOCS.bootloader;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] shadow-[4px_4px_0_#404040]">
      <div className="shrink-0 border-b border-[#333] bg-[#000080] px-2 py-1.5 font-sans font-bold text-white text-xs sm:text-base truncate">
        ORACLE Source Viewer - oracle_source.exe
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">
        <div className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-[#333] bg-[#252526] p-2 text-[#c5c5c5] sm:w-[180px] sm:flex-col sm:border-b-0 sm:border-r">
          {availableDocs.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFile(id)}
              className={`shrink-0 rounded px-2 py-1.5 text-left text-xs sm:text-sm hover:bg-[#373737] ${
                activeFile === id ? "bg-[#373737]" : ""
              }`}
            >
              {DOC_LABELS[id]}
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
