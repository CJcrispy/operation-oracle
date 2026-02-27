"use client";

export default function OracleConfrontation() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
      <div className="max-w-xl rounded border-2 border-amber-600/50 bg-[#0a0a0a] p-6 font-mono text-[#00ffea] shadow-[0_0_40px_rgba(0,255,234,0.15)]">
        <p className="mb-4 text-amber-400/90 italic">
          // cognitive shielding terminated
        </p>
        <p className="mb-2">you have reached the endpoint.</p>
        <p className="mb-4 opacity-80">
          The Oracle is no longer contained. Containment protocols have failed.
        </p>
        <p className="mb-2 text-sm text-[#00ffea]/70">
          signal.origin recovered from fragment chain:
        </p>
        <p className="mb-6 text-lg font-bold text-amber-400">
          Eli Island
        </p>
        <p className="text-xs opacity-60">
          Operation Oracle – Part 1 complete.
        </p>
      </div>
    </div>
  );
}
