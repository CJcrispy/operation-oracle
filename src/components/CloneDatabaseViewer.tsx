"use client";

import { useState, useMemo } from "react";
import clonesData from "@/data/clones.json";

type CloneEntry = { name: string; status: string; description: string };
type CloneDb = Record<string, CloneEntry[]>;

export default function CloneDatabaseViewer() {
  const db = useMemo(() => clonesData as CloneDb, []);
  const categories = useMemo(() => Object.keys(db).filter((k) => Array.isArray(db[k])), [db]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClone, setSelectedClone] = useState<CloneEntry | null>(null);

  const entries = selectedCategory && db[selectedCategory] ? (db[selectedCategory] as CloneEntry[]) : [];

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat || null);
    setSelectedClone(null);
  };

  const handleSelectClone = (entry: CloneEntry) => {
    setSelectedClone(entry);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-2 border-black bg-[#0a0f0a] text-[#39ff14] shadow-[4px_4px_0_#1f5f1f]">
      <div className="shrink-0 border-b border-[#1f5f1f] bg-[#050505] px-3 py-2 font-mono text-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="text-[#39ff14]">CLONE INTEL DATABASE</span>
          <span className="text-[#39ff14]/60">— CLASSIFIED</span>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        {/* Category dropdown */}
        <div className="mb-4 shrink-0">
          <label htmlFor="clone-category" className="mb-1.5 block font-mono text-xs text-[#39ff14]/70">
            SELECT CATEGORY
          </label>
          <select
            id="clone-category"
            value={selectedCategory ?? ""}
            onChange={(e) => handleSelectCategory(e.target.value ?? "")}
            className="w-full max-w-xs cursor-pointer border border-[#1f5f1f] bg-[#050505] px-3 py-2 font-mono text-sm text-[#39ff14] outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/50 [&>option]:bg-[#050505] [&>option]:text-[#39ff14]"
          >
            <option value="">— Select person —</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Clone list — appears after category selected */}
        {selectedCategory && entries.length > 0 && (
          <div className="mb-4 shrink-0">
            <div className="mb-1.5 font-mono text-xs text-[#39ff14]/70">CLONES</div>
            <div className="flex flex-wrap gap-2">
              {entries.map((entry) => (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => handleSelectClone(entry)}
                  className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors hover:border-[#39ff14] hover:bg-[#1f5f1f]/30 hover:text-[#39ff14] ${
                    selectedClone?.name === entry.name
                      ? "border-[#39ff14] bg-[#1f5f1f]/50 text-[#39ff14]"
                      : "border-[#1f5f1f] text-[#39ff14]/80"
                  }`}
                >
                  {entry.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Right: Detail panel */}
        <div className="min-w-0 flex-1 overflow-y-auto p-4">
          {selectedClone ? (
            <div className="space-y-3 font-mono text-sm">
              <div className="border-b border-[#1f5f1f] pb-2">
                <div className="text-lg font-bold text-[#39ff14]">{selectedClone.name}</div>
                <div
                  className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
                    selectedClone.status === "ACTIVE"
                      ? "bg-[#1f5f1f]/50 text-[#39ff14]"
                      : selectedClone.status === "ROGUE" || selectedClone.status === "CONTAINED"
                        ? "bg-red-900/50 text-red-400"
                        : "bg-[#1f5f1f]/30 text-[#39ff14]/80"
                  }`}
                >
                  {selectedClone.status}
                </div>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-[#39ff14]/90">
                {selectedClone.description}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center font-mono text-sm text-[#39ff14]/50">
              {selectedCategory
                ? "Click on a clone to view their details."
                : "Select a category to browse clone entries."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
