"use client";

import { useCallback, useRef, useState, useEffect } from "react";

type Win98WindowProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize?: (id: string) => void;
  onFocus?: (id: string) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
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
  onPositionChange,
  isMinimized = false,
  isFocused = true,
  defaultWidth = 600,
  defaultHeight = 450,
  className = "",
}: Win98WindowProps) {
  const handleFocus = useCallback(() => onFocus?.(id), [id, onFocus]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || !onPositionChange) return;
      e.preventDefault();
      const el = document.getElementById(`win98-${id}`);
      const rect = el?.getBoundingClientRect();
      if (!rect) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [id, onPositionChange]
  );

  useEffect(() => {
    if (!isDragging || !onPositionChange) return;
    const onMove = (e: MouseEvent) => {
      const nx = Math.max(0, e.clientX - dragStartRef.current.x);
      const ny = Math.max(0, e.clientY - dragStartRef.current.y);
      onPositionChange(id, Math.round(nx), Math.round(ny));
    };
    const onUp = () => setIsDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, id, onPositionChange]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      id={`win98-${id}`}
      role="button"
      tabIndex={0}
      onClick={handleFocus}
      onFocus={handleFocus}
      className={`absolute flex flex-col border-2 border-black bg-[#c0c0c0] shadow-[2px_2px_0_#404040] ${isDragging ? "cursor-grabbing" : ""} ${className}`}
      style={{
        width: "100%",
        minWidth: 280,
        maxWidth: "min(calc(100vw - 2rem), " + defaultWidth + "px)",
        height: defaultHeight,
        minHeight: 160,
        maxHeight: "min(calc(100dvh - 6rem), " + defaultHeight + "px)",
        zIndex: isFocused ? 50 : 40,
        boxShadow: isFocused
          ? "2px 2px 0 #404040, 4px 4px 0 #000"
          : "2px 2px 0 #404040",
      }}
    >
      {/* Title bar - draggable */}
      <div
        role="presentation"
        onMouseDown={handleTitleMouseDown}
        className={`flex min-h-[28px] shrink-0 cursor-grab items-center justify-between bg-[#000080] px-1 py-0.5 text-white active:cursor-grabbing ${!onPositionChange ? "cursor-default" : ""}`}
      >
        <span className="truncate text-xs sm:text-sm font-bold">{title}</span>
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
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
