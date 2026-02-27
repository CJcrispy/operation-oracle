"use client";

import { useState, useCallback, useEffect, useRef } from "react";

function DesktopClock({ backwards = false }: { backwards?: boolean }) {
  const [time, setTime] = useState("");
  const baseTs = useRef(Date.now());
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      if (backwards) {
        const elapsed = Math.floor((Date.now() - baseTs.current) / 1000);
        const base = new Date(d);
        base.setSeconds(base.getSeconds() - elapsed);
        setTime(base.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      } else {
        setTime(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      }
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, [backwards]);
  return <span>{time}</span>;
}

function BlisswareMonitorIcon() {
  const { containment, blisswareRed, blisswareGlow } = useGame();
  const flicker = containment < 25 && !blisswareRed && !blisswareGlow;
  const red = blisswareRed;
  const glow = blisswareGlow && !blisswareRed;
  return (
    <div
      className={`flex h-6 w-6 shrink-0 cursor-default items-center justify-center border border-[#808080] text-[10px] font-bold ${
        red
          ? "bg-red-600 text-white animate-blissware-pulse"
          : glow
          ? "bg-red-900/80 text-red-200 animate-blissware-glow"
          : flicker
          ? "bg-[#c0c0c0] text-black animate-pulse"
          : "bg-[#c0c0c0] text-black"
      }`}
      title={red ? "Blissware Monitor - ACTIVE" : glow ? "Blissware Monitor - PERSISTENT" : "Blissware Monitor (disabled)"}
      aria-hidden
    >
      BW
    </div>
  );
}
import Win98Window from "./Win98Window";
import UnlockerTerminal from "./UnlockerTerminal";
import PathSignalGame from "./PathSignalGame";
import ChessGame from "./ChessGame";
import OracleSourceViewer from "./OracleSourceViewer";
import Explorer from "./Explorer";
import OracleConfrontation from "./OracleConfrontation";
import NotificationToast from "./NotificationToast";
import Notepad from "./Notepad";
import MyComputer from "./MyComputer";
import RecycleBin from "./RecycleBin";
import WelcomeViewer from "./WelcomeViewer";
import { useGame } from "@/context/GameContext";
import { RESIGNATION_LETTER } from "@/lib/content";

export type AppId = "unlocker" | "path_signal" | "chess" | "test" | "explorer" | "notepad" | "my_computer" | "recycle_bin" | "welcome";

type WindowState = {
  id: string;
  minimized: boolean;
  focused: boolean;
  title: string;
  position?: { x: number; y: number };
  params?: { filename?: string; content?: string; explorerPath?: string[] };
};

const APP_TITLES: Record<string, string> = {
  unlocker: "UNLOCKER.sys - Windows 98 Terminal Shell",
  path_signal: "ORACLE Challenge - path_signal.exe",
  chess: "ORACLE Challenge - chess.exe",
  test: "ORACLE Source Viewer - oracle_source.exe",
  explorer: "Documents - Windows Explorer",
  notepad: "Untitled - Notepad",
  my_computer: "My Computer",
  recycle_bin: "Recycle Bin",
  welcome: "Welcome.pdf - Adobe Acrobat Reader",
};

const WINDOW_SIZES: Record<string, { width: number; height: number }> = {
  unlocker: { width: 720, height: 480 },
  path_signal: { width: 380, height: 420 },
  chess: { width: 440, height: 480 },
  test: { width: 720, height: 480 },
  explorer: { width: 480, height: 360 },
  notepad: { width: 500, height: 400 },
  my_computer: { width: 520, height: 380 },
  recycle_bin: { width: 400, height: 320 },
  welcome: { width: 560, height: 480 },
};

export default function Desktop() {
  const {
    requestedDocId,
    requestedNotepad,
    setRequestedNotepad,
    oracleActivated,
    finalePhase,
    systemInstability,
    blisswareRed,
    blisswareGlow,
    clockBackwards,
    desktopBlackout,
    islandRevealed,
  } = useGame();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleLogout = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const openApp = useCallback((id: AppId | string, params?: { filename?: string; content?: string; explorerPath?: string[] }) => {
    setStartMenuOpen(false);
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        const updated = prev.map((w) => ({
          ...w,
          minimized: w.id === id ? false : w.minimized,
          focused: w.id === id,
          ...(w.id === id && params && { params }),
        }));
        const focusedIdx = updated.findIndex((w) => w.focused);
        if (focusedIdx >= 0) {
          const [f] = updated.splice(focusedIdx, 1);
          updated.push(f);
        }
        return updated;
      }
      const idx = prev.length;
      const title = params?.filename ? `${params.filename} - Notepad` : APP_TITLES[id] ?? id;
      return [
        ...prev.map((w) => ({ ...w, focused: false })),
        {
          id,
          minimized: false,
          focused: true,
          title,
          position: { x: 80 + idx * 24, y: 40 + idx * 24 },
          params,
        },
      ];
    });
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: { x, y } } : w))
    );
  }, []);

  useEffect(() => {
    if (requestedDocId) openApp("test");
  }, [requestedDocId, openApp]);

  useEffect(() => {
    if (requestedNotepad) {
      openApp("notepad", requestedNotepad);
      setRequestedNotepad(null);
    }
  }, [requestedNotepad, openApp, setRequestedNotepad]);

  const closeApp = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Phase 1: When system instability triggers, minimize all windows and close Explorer
  const instabilityRun = useRef(false);
  useEffect(() => {
    if (finalePhase === "instability" && systemInstability && !instabilityRun.current) {
      instabilityRun.current = true;
      setWindows((prev) =>
        prev.map((w) => ({ ...w, minimized: true })).filter((w) => w.id !== "explorer")
      );
    }
  }, [finalePhase, systemInstability]);

  const minimizeApp = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      )
    );
  }, []);

  const focusApp = useCallback((id: string) => {
    setWindows((prev) => {
      const list = prev.map((w) => ({ ...w, focused: w.id === id }));
      const focusedIdx = list.findIndex((w) => w.focused);
      if (focusedIdx >= 0) {
        const [focused] = list.splice(focusedIdx, 1);
        list.push(focused);
      }
      return list;
    });
  }, []);

  const renderAppContent = (win: WindowState) => {
    const id = win.id;
    switch (id) {
      case "unlocker":
        return (
          <UnlockerTerminal
            embedded
            onOpenApp={(app) => openApp(app)}
          />
        );
      case "path_signal":
        return <PathSignalGame />;
      case "chess":
        return <ChessGame />;
      case "test":
        return <OracleSourceViewer />;
      case "explorer":
        return (
          <Explorer
            onOpenNotepad={(fn, c) => openApp("notepad", { filename: fn, content: c })}
            initialPath={win.params?.explorerPath as string[] | undefined}
          />
        );
      case "notepad":
        return <Notepad filename={win.params?.filename ?? "Untitled"} content={win.params?.content ?? ""} />;
      case "my_computer":
        return <MyComputer />;
      case "recycle_bin":
        return <RecycleBin />;
      case "welcome":
        return <WelcomeViewer />;
      default:
        return null;
    }
  };

  // Auto-open Explorer to Island folder when revelation completes
  const islandOpened = useRef(false);
  useEffect(() => {
    if (islandRevealed && !islandOpened.current) {
      islandOpened.current = true;
      openApp("explorer", { explorerPath: ["SYS", "Legacy", "Island"] });
    }
  }, [islandRevealed, openApp]);

  return (
    <div className={`relative min-h-dvh min-h-screen w-full max-w-[100vw] overflow-hidden select-none font-sans transition-all duration-500 bg-gradient-to-br from-[#006666] via-[#007777] to-[#005555] ${oracleActivated ? "brightness-[0.6]" : ""} ${shaking ? "animate-shake" : ""} ${systemInstability ? "animate-glitch-bg" : ""}`}>
      {/* Desktop area - taskbar height pb-10 sm:pb-10 */}
      <div className="absolute inset-0 pb-12 sm:pb-10">
        {/* Blissware watermark - corporate wallpaper */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <span className="text-[min(8vw,120px)] font-bold tracking-widest text-white">BLISSWARE</span>
        </div>
        {/* Desktop icons - flicker during system instability */}
        <div
          className={`relative flex flex-col gap-1 p-3 sm:p-4 w-[100px] sm:w-[100px] ${
            systemInstability ? "animate-icon-flicker" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => openApp("welcome")}
            className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 transition-colors hover:bg-transparent active:bg-transparent"
            title="Welcome"
          >
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-[#808080] bg-[#fff] p-0.5 shrink-0 text-base transition-transform duration-150 group-hover:scale-110">📄</span>
            <span className="text-center text-[10px] sm:text-xs leading-tight text-black">Welcome.pdf</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("unlocker")}
            className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 transition-colors hover:bg-transparent active:bg-transparent"
          >
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-[#808080] bg-[#0c0c0c] p-0.5 shrink-0 text-base transition-transform duration-150 group-hover:scale-110">⌨</span>
            <span className="text-center text-[10px] sm:text-xs leading-tight text-black">UNLOCKER.sys</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("test")}
            className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 transition-colors hover:bg-transparent active:bg-transparent"
          >
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-[#808080] bg-[#1e1e1e] p-0.5 shrink-0 text-base transition-transform duration-150 group-hover:scale-110">📋</span>
            <span className="text-center text-[10px] sm:text-xs leading-tight text-black">Source Viewer</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("explorer")}
            className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 transition-colors hover:bg-transparent active:bg-transparent"
          >
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0 text-base transition-transform duration-150 group-hover:scale-110">📁</span>
            <span className="text-center text-[10px] sm:text-xs leading-tight text-black">Documents</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("my_computer")}
            className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 transition-colors hover:bg-transparent active:bg-transparent"
            title="My Computer"
          >
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0 text-base transition-transform duration-150 group-hover:scale-110">💻</span>
            <span className="text-center text-[10px] sm:text-xs leading-tight text-black">My Computer</span>
          </button>
          <button
            type="button"
            onClick={() => openApp("recycle_bin")}
            className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded p-2 sm:p-1 transition-colors hover:bg-transparent active:bg-transparent"
            title="Recycle Bin"
          >
            <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-[#808080] bg-[#c0c0c0] p-0.5 shrink-0 text-base transition-transform duration-150 group-hover:scale-110">🗑</span>
            <span className="text-center text-[10px] sm:text-xs leading-tight text-black">Recycle Bin</span>
          </button>
        </div>

        {/* Floating windows - overlay is pointer-events-none so desktop icons stay clickable */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full w-full">
            {windows.map((win) =>
              !win.minimized ? (
                <div
                  key={win.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: win.position ? Math.max(0, win.position.x) : 80,
                    top: win.position ? Math.max(0, win.position.y) : 40,
                  }}
                >
                  <Win98Window
                    id={win.id}
                    title={
                      win.id === "unlocker" &&
                      (finalePhase === "manifestation" || finalePhase === "battle" || finalePhase === "restored")
                        ? "ORACLE.exe – ACTIVE"
                        : win.title
                    }
                    onClose={closeApp}
                    onMinimize={minimizeApp}
                    onFocus={focusApp}
                    onPositionChange={updateWindowPosition}
                    isMinimized={win.minimized}
                    isFocused={win.focused}
                    defaultWidth={WINDOW_SIZES[win.id]?.width ?? 400}
                    defaultHeight={WINDOW_SIZES[win.id]?.height ?? 300}
                  >
                    {renderAppContent(win)}
                  </Win98Window>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* Taskbar - flickers during system instability */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex h-10 min-h-[44px] shrink-0 flex-wrap items-center justify-between gap-1 border-t-2 border-[#dfdfdf] bg-[#c0c0c0] px-2 shadow-[0_-2px_0_#fff] safe-area-inset-bottom ${
          systemInstability ? "animate-taskbar-flicker" : ""
        }`}
      >
        <div className="relative flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setStartMenuOpen((o) => !o)}
            className="flex h-9 min-h-[44px] min-w-[80px] sm:min-w-[104px] items-center border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] px-2 font-bold shadow-[1px_1px_0_#000] hover:bg-[#e0e0e0] active:bg-[#e0e0e0]"
          >
            <span className="ml-4 sm:ml-6 text-xs sm:text-base text-black">Start</span>
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
                  Intern — Operation ORACLE
                </div>
                <ul className="list-none p-0">
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("unlocker")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-black hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      UNLOCKER.sys
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("test")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-black hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      ORACLE Source Viewer
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("explorer")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-black hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      Documents
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openApp("welcome")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-black hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      Welcome.pdf
                    </button>
                  </li>
                  <li className="border-t border-[#808080]">
                    <button
                      type="button"
                      onClick={() => { setStartMenuOpen(false); openApp("notepad", { filename: "resignation_letter.txt", content: RESIGNATION_LETTER }); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-black hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      Previous intern resignation...
                    </button>
                  </li>
                  <li className="border-t border-[#808080]">
                    <button
                      type="button"
                      onClick={() => { setStartMenuOpen(false); handleLogout(); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-black hover:bg-[#000080] hover:text-white"
                    >
                      <span className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0]" />
                      Log Out
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
              className={`flex h-7 min-w-[72px] sm:min-w-[120px] shrink-0 items-center border border-[#808080] px-2 text-xs sm:text-sm text-black truncate max-w-[120px] sm:max-w-none ${
                win.focused && !win.minimized
                  ? "border-b-[#c0c0c0] bg-[#c0c0c0]"
                  : "bg-[#c0c0c0] hover:bg-[#e0e0e0] active:bg-[#e0e0e0]"
              }`}
            >
              {win.title.slice(0, 12)}…
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <BlisswareMonitorIcon />
          <div className="rounded border border-[#808080] bg-[#c0c0c0] px-1.5 py-0.5 font-mono text-xs text-black">
            <DesktopClock backwards={clockBackwards} />
          </div>
        </div>
      </div>
      {oracleActivated && <OracleConfrontation />}
      {/* Desktop blackout during Phase 4 revelation */}
      {desktopBlackout && (
        <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black text-white font-mono text-center p-6">
          <p className="text-xl sm:text-2xl font-bold mb-4">CORE INSTANCE FRACTURED</p>
          <p className="text-lg opacity-90">GEO DATA EXPOSED</p>
        </div>
      )}
      <NotificationToast />
    </div>
  );
}
