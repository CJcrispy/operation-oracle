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
    <div className="relative h-screen w-screen overflow-hidden bg-[#008080] select-none font-sans">
      {/* Desktop area */}
      <div className="absolute inset-0 pb-10">
        {/* Desktop icons */}
        <div className="flex flex-col gap-1 p-4" style={{ width: 100 }}>
          <button
            type="button"
            onClick={() => openApp("unlocker")}
            className="flex flex-col items-center gap-1 rounded p-1 hover:bg-[#000080] hover:text-white"
          >
            <span className="h-10 w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5" />
            <span className="text-center text-xs">UNLOCKER.sys</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("path_signal")}
            className="flex flex-col items-center gap-1 rounded p-1 hover:bg-[#000080] hover:text-white"
          >
            <span className="h-10 w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5" />
            <span className="text-center text-xs">Path Signal</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("chess")}
            className="flex flex-col items-center gap-1 rounded p-1 hover:bg-[#000080] hover:text-white"
          >
            <span className="h-10 w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5" />
            <span className="text-center text-xs">Chess</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("test")}
            className="flex flex-col items-center gap-1 rounded p-1 hover:bg-[#000080] hover:text-white"
          >
            <span className="h-10 w-10 rounded border border-[#808080] bg-[#c0c0c0] p-0.5" />
            <span className="text-center text-xs">Source Viewer</span>
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
                    left: 80 + i * 24,
                    top: 40 + i * 24,
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
      <div className="absolute bottom-0 left-0 right-0 flex h-10 items-center justify-between border-t-2 border-[#dfdfdf] bg-[#c0c0c0] px-2 shadow-[0_-2px_0_#fff]">
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setStartMenuOpen((o) => !o)}
            className="flex h-9 min-w-[104px] items-center border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] px-2 font-bold shadow-[1px_1px_0_#000] hover:bg-[#e0e0e0]"
          >
            <span className="ml-6">Start</span>
          </button>
          {startMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                role="presentation"
                onClick={() => setStartMenuOpen(false)}
              />
              <div className="absolute bottom-full left-0 z-50 mt-1 w-72 border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] shadow-[2px_2px_0_#000]">
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
        <div className="flex gap-1">
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
              className={`flex h-7 min-w-[120px] items-center border border-[#808080] px-2 text-sm ${
                win.focused && !win.minimized
                  ? "border-b-[#c0c0c0] bg-[#c0c0c0]"
                  : "bg-[#c0c0c0] hover:bg-[#e0e0e0]"
              }`}
            >
              {win.title.slice(0, 16)}...
            </button>
          ))}
        </div>
        <div className="text-sm">Operation ORACLE</div>
      </div>
    </div>
  );
}
