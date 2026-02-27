"use client";

import { FINALE_WIN_MESSAGE, FINALE_LOSE_MESSAGE } from "@/lib/content";

type OracleConfrontationProps = { outcome: "win" | "lose" };

export default function OracleConfrontation({ outcome }: OracleConfrontationProps) {
  const isWin = outcome === "win";
  const msg = isWin ? FINALE_WIN_MESSAGE : FINALE_LOSE_MESSAGE;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
      <div className={`max-w-xl rounded border-2 p-6 font-mono shadow-[0_0_40px_rgba(0,255,234,0.15)] ${
        isWin ? "border-amber-600/50 bg-[#0a0a0a] text-[#00ffea]" : "border-red-900/60 bg-[#0a0505] text-red-200"
      }`}>
        <p className={`mb-4 italic ${isWin ? "text-amber-400/90" : "text-red-400/90"}`}>
          // cognitive shielding {isWin ? "terminated" : "override complete"}
        </p>
        <p className="mb-2 text-lg font-bold">{msg.title}</p>
        <p className="mb-4 opacity-90">{msg.subtitle}</p>
        <p className="mb-4 whitespace-pre-wrap opacity-80">{msg.body}</p>
        <p className="mb-2 text-sm opacity-70">signal.origin recovered from fragment chain:</p>
        <p className={`mb-6 text-lg font-bold ${isWin ? "text-amber-400" : "text-red-400"}`}>
          Eli Island
        </p>
        <p className="text-xs opacity-60">{msg.footnote}</p>
      </div>
    </div>
  );
}
