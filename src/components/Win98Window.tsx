"use client";

import { useCallback } from "react";

type Win98WindowProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize?: (id: string) => void;
  onFocus?: (id: string) => void;
  isMinimized?: boolean;
  isFocused?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  className?: string;
};

export default function Win98Window({
  id,
  title,
  children,
  onClose,
  onMinimize,
  onFocus,
  isMinimized = false,
  isFocused = true,
  defaultWidth = 600,
  defaultHeight = 450,
  className = "",
}: Win98WindowProps) {
  const handleFocus = useCallback(() => onFocus?.(id), [id, onFocus]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleFocus}
      onFocus={handleFocus}
      className={`absolute flex flex-col border-2 border-black bg-[#c0c0c0] shadow-[2px_2px_0_#404040] ${className}`}
      style={{
        width: defaultWidth,
        minWidth: 280,
        height: defaultHeight,
        minHeight: 200,
        maxWidth: "min(100vw - 1rem, " + defaultWidth + "px)",
        maxHeight: "min(100dvh - 5rem, " + defaultHeight + "px)",
        zIndex: isFocused ? 50 : 40,
        boxShadow: isFocused
          ? "2px 2px 0 #404040, 4px 4px 0 #000"
          : "2px 2px 0 #404040",
      }}
    >
      {/* Title bar */}
      <div className="flex min-h-[28px] shrink-0 items-center justify-between bg-[#000080] px-1 py-0.5 text-white">
        <span className="truncate text-xs sm:text-sm font-bold">{title}</span>
        <div className="flex items-center gap-0.5">
          {onMinimize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize(id);
              }}
              className="flex h-4 w-5 items-center justify-center border border-[#808080] bg-[#c0c0c0] text-[#000] hover:bg-[#e0e0e0]"
              aria-label="Minimize"
            >
              <span className="text-xs">−</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="flex h-4 w-5 items-center justify-center border border-[#808080] bg-[#c0c0c0] text-[#000] hover:bg-[#e0e0e0]"
            aria-label="Close"
          >
            <span className="text-xs font-bold">×</span>
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto overflow-x-hidden border border-t-0 border-black bg-[#c0c0c0] p-1">
        {children}
      </div>
    </div>
  );
}
