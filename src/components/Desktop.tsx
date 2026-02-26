"use client";

import { useState, useCallback } from "react";
import Win98Window from "./Win98Window";
import UnlockerTerminal from "./UnlockerTerminal";
import PathSignalGame from "./PathSignalGame";
import ChessGame from "./ChessGame";
import OracleSourceViewer from "./OracleSourceViewer";

export type AppId = "unlocker" | "path_signal" | "chess" | "test";

type WindowState = {
  id: AppId;
  minimized: boolean;
  focused: boolean;
  title: string;
  position?: { x: number; y: number };
};

const APP_TITLES: Record<AppId, string> = {
  unlocker: "UNLOCKER.sys - Windows 98 Terminal Shell",
  path_signal: "ORACLE Challenge - path_signal.exe",
  chess: "ORACLE Challenge - chess.exe",
  test: "ORACLE Source Viewer - oracle_source.exe",
};

const WINDOW_SIZES: Record<AppId, { width: number; height: number }> = {
  unlocker: { width: 720, height: 480 },
  path_signal: { width: 380, height: 420 },
  chess: { width: 440, height: 480 },
  test: { width: 720, height: 480 },
};

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const openApp = useCallback((id: AppId) => {
    setStartMenuOpen(false);
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        return prev.map((w) => ({
          ...w,
          minimized: w.id === id ? false : w.minimized,
          focused: w.id === id,
        }));
      }
      return [
        ...prev.map((w) => ({ ...w, focused: false })),
        {
          id,
          minimized: false,
          focused: true,
          title: APP_TITLES[id],
        },
      ];
    });
  }, []);

  const closeApp = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      )
    );
  }, []);

  const focusApp = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => ({ ...w, focused: w.id === id }))
    );
  }, []);

  const renderAppContent = (id: AppId) => {
    switch (id) {
      case "unlocker":
        return <UnlockerTerminal embedded />;
      case "path_signal":
        return <PathSignalGame />;
      case "chess":
        return <ChessGame />;
      case "test":
        return <OracleSourceViewer />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-dvh min-h-screen w-full max-w-[100vw] overflow-hidden bg-[#008080] select-none font-sans">
      {/* Desktop area - taskbar height pb-10 sm:pb-10 */}
      <div className="absolute inset-0 pb-12 sm:pb-10">
        {/* Desktop icons - grid on small screens for better touch targets */}
        <div className="flex flex-col gap-1 p-3 sm:p-4 w-[100px] sm:w-[100px]">
          <button
            type="button"
            onClick={() => openApp("unlocker")}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 hover:bg-[#000080] hover:text-white active:bg-[#000080]"
          >
            <span className="h-8 w-8 sm:h-10 sm:w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0" />
            <span className="text-center text-[10px] sm:text-xs leading-tight">UNLOCKER.sys</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("path_signal")}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 hover:bg-[#000080] hover:text-white active:bg-[#000080]"
          >
            <span className="h-8 w-8 sm:h-10 sm:w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0" />
            <span className="text-center text-[10px] sm:text-xs leading-tight">Path Signal</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("chess")}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 hover:bg-[#000080] hover:text-white active:bg-[#000080]"
          >
            <span className="h-8 w-8 sm:h-10 sm:w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0" />
            <span className="text-center text-[10px] sm:text-xs leading-tight">Chess</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("test")}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 hover:bg-[#000080] hover:text-white active:bg-[#000080]"
          >
            <span className="h-8 w-8 sm:h-10 sm:w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0" />
            <span className="text-center text-[10px] sm:text-xs leading-tight">Source Viewer</span>
          </button>
        </div>

        {/* Floating windows - overlay is pointer-events-none so desktop icons stay clickable */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full w-full">
            {windows.map((win, i) =>
              !win.minimized ? (
                <div
                  key={win.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `max(0.5rem, ${80 + i * 24}px)`,
                    top: `max(0.5rem, ${40 + i * 24}px)`,
                  }}
                >
                  <Win98Window
                    id={win.id}
                    title={win.title}
                    onClose={closeApp}
                    onMinimize={minimizeApp}
                    onFocus={focusApp}
                    isMinimized={win.minimized}
                    isFocused={win.focused}
                    defaultWidth={WINDOW_SIZES[win.id].width}
                    defaultHeight={WINDOW_SIZES[win.id].height}
                  >
                    {renderAppContent(win.id)}
                  </Win98Window>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 flex h-10 min-h-[44px] shrink-0 flex-wrap items-center justify-between gap-1 border-t-2 border-[#dfdfdf] bg-[#c0c0c0] px-2 shadow-[0_-2px_0_#fff] safe-area-inset-bottom">
        <div className="relative flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setStartMenuOpen((o) => !o)}
            className="flex h-9 min-h-[44px] min-w-[80px] sm:min-w-[104px] items-center border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] px-2 font-bold shadow-[1px_1px_0_#000] hover:bg-[#e0e0e0] active:bg-[#e0e0e0]"
          >
            <span className="ml-4 sm:ml-6 text-xs sm:text-base">Start</span>
          </button>
          {startMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                role="presentation"
                onClick={() => setStartMenuOpen(false)}
              />
              <div className="absolute bottom-full left-0 z-50 mt-1 w-[min(18rem,100vw-1rem)] max-w-72 border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] shadow-[2px_2px_0_#000]">
                <div className="border-b-2 border-[#000080] bg-[#000080] px-2 py-1 text-white">
                  Operation ORACLE
                </div>
                <ul className="list-none p-0">
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("unlocker")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      UNLOCKER.sys
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("path_signal")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      Path of the Signal
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("chess")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      Chess
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("test")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      ORACLE Source Viewer
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {windows.map((win) => (
            <button
              key={win.id}
              type="button"
              onClick={() =>
                setWindows((prev) =>
                  prev.map((w) =>
                    w.id === win.id
                      ? { ...w, minimized: !w.minimized, focused: true }
                      : { ...w, focused: false }
                  )
                )
              }
              className={`flex h-7 min-w-[72px] sm:min-w-[120px] shrink-0 items-center border border-[#808080] px-2 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none ${
                win.focused && !win.minimized
                  ? "border-b-[#c0c0c0] bg-[#c0c0c0]"
                  : "bg-[#c0c0c0] hover:bg-[#e0e0e0] active:bg-[#e0e0e0]"
              }`}
            >
              {win.title.slice(0, 12)}…
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 text-xs sm:block sm:text-sm">Operation ORACLE</div>
      </div>
    </div>
  );
}
