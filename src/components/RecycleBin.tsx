"use client";

export default function RecycleBin() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#c0c0c0] p-4">
      <p className="text-sm text-black">The Recycle Bin is empty.</p>
      <p className="mt-4 text-xs text-black/70">(This folder is empty.)</p>
    </div>
  );
}
