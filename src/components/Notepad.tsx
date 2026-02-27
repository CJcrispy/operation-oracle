"use client";

type NotepadProps = {
  filename: string;
  content: string;
};

export default function Notepad({ filename, content }: NotepadProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#fff]">
      <div className="shrink-0 flex items-center gap-1 border-b border-[#808080] bg-[#c0c0c0] px-1 py-0.5">
        <span className="text-xs font-bold text-black">File</span>
        <span className="text-xs text-black">Edit</span>
        <span className="text-xs text-black">Format</span>
        <span className="text-xs text-black">View</span>
        <span className="text-xs text-black">Help</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2 font-mono text-sm text-black whitespace-pre-wrap">
        {content}
      </div>
      <div className="shrink-0 border-t border-[#808080] bg-[#c0c0c0] px-2 py-0.5 text-xs text-black">
        {filename}
      </div>
    </div>
  );
}
