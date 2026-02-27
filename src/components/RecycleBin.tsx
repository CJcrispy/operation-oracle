"use client";

import { RECYCLE_BIN_FILES } from "@/lib/content";

type RecycleBinProps = {
  onOpenNotepad?: (filename: string, content: string) => void;
};

export default function RecycleBin({ onOpenNotepad }: RecycleBinProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#c0c0c0]">
      <div className="shrink-0 border-b border-[#808080] px-2 py-1">
        <p className="text-xs text-black">6 item(s)</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-0.5 text-sm text-black">
          {RECYCLE_BIN_FILES.map((file) => (
            <button
              key={file.name}
              type="button"
              onDoubleClick={() => onOpenNotepad?.(file.name, file.content)}
              className="flex items-center gap-2 py-1 pr-2 text-left hover:bg-[#000080] hover:text-white"
            >
              <span className="h-5 w-5 shrink-0 border border-[#808080] bg-[#c0c0c0] text-center text-xs leading-5">
                📄
              </span>
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
