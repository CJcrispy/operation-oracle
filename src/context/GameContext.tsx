"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/** File IDs 1–7. Each unlock drops containment. */
export const FILE_IDS = [1, 2, 3, 4, 5, 6, 7] as const;
export type FileId = (typeof FILE_IDS)[number];

/** Which app to open for each file unlock (File 1 → slider_puzzle, File 2 → chess, etc.) */
export const FILE_TO_APP: Record<FileId, "slider_puzzle" | "chess" | "path_signal" | "breakout" | "uncledonk" | null> = {
  1: "slider_puzzle",
  2: "chess",
  3: "path_signal",
  4: null,
  5: "breakout",
  6: "uncledonk",
  7: null, // final - special handling
};

/** Containment drop per unlock */
const CONTAINMENT_DROP_PER_FILE = 100 / 7;

/** Finale sequence phases */
export type FinalePhase =
  | "idle"
  | "instability"
  | "manifestation"
  | "battle"
  | "revelation"
  | "blackout"
  | "restored";

export type GameState = {
  containment: number;
  unlockedFiles: FileId[];
  pendingUnlock: FileId | null;
  oracleActivated: boolean;
  /** Finale sequence state */
  finalePhase: FinalePhase;
  oracleStability: number;
  playerHealth: number;
  systemInstability: boolean;
  blisswareRed: boolean;
  blisswareGlow: boolean;
  clockBackwards: boolean;
  desktopBlackout: boolean;
  islandRevealed: boolean;
};

export type DocId = "bootloader" | "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7";

export type Notification = { id: number; message: string };
export type NotepadRequest = { filename: string; content: string };

export type GameContextValue = GameState & {
  isUnlocked: (fileId: FileId) => boolean;
  markUnlocked: (fileId: FileId, fileName?: string) => void;
  setPendingUnlock: (fileId: FileId | null) => void;
  dropContainment: () => void;
  activateOracle: () => void;
  requestedDocId: DocId | null;
  setRequestedDocId: (id: DocId | null) => void;
  requestedNotepad: NotepadRequest | null;
  setRequestedNotepad: (r: NotepadRequest | null) => void;
  notifications: Notification[];
  addNotification: (message: string) => void;
  dismissNotification: (id: number) => void;
  /** Finale controls */
  triggerFinale: () => void;
  setFinalePhase: (p: FinalePhase) => void;
  reduceOracleStability: (amount: number) => void;
  increaseOracleStability: (amount: number) => void;
  reducePlayerHealth: (amount: number) => void;
  increasePlayerHealth: (amount: number) => void;
  finaleOutcome: "win" | "lose" | null;
  setFinaleOutcome: (o: "win" | "lose" | null) => void;
  setContainment: (n: number) => void;
  setBlisswareRed: (v: boolean) => void;
  setBlisswareGlow: (v: boolean) => void;
  setClockBackwards: (v: boolean) => void;
  setDesktopBlackout: (v: boolean) => void;
  setIslandRevealed: (v: boolean) => void;
  setSystemInstability: (v: boolean) => void;
  onExplorerClose: (() => void) | null;
  setOnExplorerClose: (fn: (() => void) | null) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [containment, setContainment] = useState(100);
  const [unlockedFiles, setUnlockedFiles] = useState<FileId[]>([]);
  const [pendingUnlock, setPendingUnlockState] = useState<FileId | null>(null);
  const [oracleActivated, setOracleActivated] = useState(false);
  const [finalePhase, setFinalePhaseState] = useState<FinalePhase>("idle");
  const [oracleStability, setOracleStability] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [finaleOutcome, setFinaleOutcome] = useState<"win" | "lose" | null>(null);
  const [systemInstability, setSystemInstability] = useState(false);
  const [blisswareRed, setBlisswareRed] = useState(false);
  const [blisswareGlow, setBlisswareGlow] = useState(false);
  const [clockBackwards, setClockBackwards] = useState(false);
  const [desktopBlackout, setDesktopBlackout] = useState(false);
  const [islandRevealed, setIslandRevealed] = useState(false);
  const [onExplorerCloseRef, setOnExplorerClose] = useState<(() => void) | null>(null);
  const [requestedDocId, setRequestedDocId] = useState<DocId | null>(null);
  const [requestedNotepad, setRequestedNotepad] = useState<NotepadRequest | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextNotifId = useRef(0);

  const addNotification = useCallback((message: string) => {
    const id = nextNotifId.current++;
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 4000);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const isUnlocked = useCallback(
    (fileId: FileId) => unlockedFiles.includes(fileId),
    [unlockedFiles]
  );

  const dropContainment = useCallback(() => {
    setContainment((prev) => Math.max(0, prev - CONTAINMENT_DROP_PER_FILE));
  }, []);

  const markUnlocked = useCallback((fileId: FileId, fileName?: string) => {
    const already = unlockedFiles.includes(fileId);
    setUnlockedFiles((prev) =>
      already ? prev : [...prev, fileId].sort((a, b) => a - b)
    );
    if (!already) {
      setContainment((prev) => Math.max(0, prev - CONTAINMENT_DROP_PER_FILE));
      addNotification(`File decrypted: ${fileName ?? `File ${fileId}`}`);
      setRequestedDocId(`f${fileId}` as DocId);
    }
  }, [unlockedFiles, addNotification]);

  const setPendingUnlock = useCallback((fileId: FileId | null) => {
    setPendingUnlockState(fileId);
  }, []);

  const activateOracle = useCallback(() => {
    setOracleActivated(true);
  }, []);

  const setFinalePhase = useCallback((p: FinalePhase) => {
    setFinalePhaseState(p);
  }, []);

  const reduceOracleStability = useCallback((amount: number) => {
    setOracleStability((prev) => Math.max(0, prev - amount));
  }, []);

  const increaseOracleStability = useCallback((amount: number) => {
    setOracleStability((prev) => Math.min(100, prev + amount));
  }, []);

  const reducePlayerHealth = useCallback((amount: number) => {
    setPlayerHealth((prev) => Math.max(0, prev - amount));
  }, []);

  const increasePlayerHealth = useCallback((amount: number) => {
    setPlayerHealth((prev) => Math.min(100, prev + amount));
  }, []);

  const addFinaleLines = useCallback((_lines: string[]) => {
    // Used by UnlockerTerminal to append lines - passed via callback
  }, []);

  const triggerFinale = useCallback(() => {
    setFinalePhaseState("instability");
    setFinaleOutcome(null);
    setPlayerHealth(100);
    setUnlockedFiles((prev) => (prev.includes(7) ? prev : ([...prev, 7].sort((a, b) => a - b) as (1 | 2 | 3 | 4 | 5 | 6 | 7)[])));
    setContainment(3);
    setSystemInstability(true);
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      containment,
      unlockedFiles,
      pendingUnlock,
      oracleActivated,
      isUnlocked,
      markUnlocked,
      setPendingUnlock,
      dropContainment,
      activateOracle,
      requestedDocId,
      setRequestedDocId,
      requestedNotepad,
      setRequestedNotepad,
      notifications,
      addNotification,
      dismissNotification,
      finalePhase,
      oracleStability,
      playerHealth,
      systemInstability,
      blisswareRed,
      blisswareGlow,
      clockBackwards,
      desktopBlackout,
      islandRevealed,
      triggerFinale,
      setFinalePhase,
      reduceOracleStability,
      increaseOracleStability,
      reducePlayerHealth,
      increasePlayerHealth,
      finaleOutcome,
      setFinaleOutcome,
      addFinaleLines,
      setContainment,
      setBlisswareRed,
      setBlisswareGlow,
      setClockBackwards,
      setDesktopBlackout,
      setIslandRevealed,
      setSystemInstability,
      onExplorerClose: onExplorerCloseRef,
      setOnExplorerClose,
    }),
    [
      containment,
      unlockedFiles,
      pendingUnlock,
      oracleActivated,
      isUnlocked,
      markUnlocked,
      setPendingUnlock,
      dropContainment,
      activateOracle,
      requestedDocId,
      requestedNotepad,
      notifications,
      addNotification,
      dismissNotification,
      finalePhase,
      oracleStability,
      playerHealth,
      systemInstability,
      blisswareRed,
      blisswareGlow,
      clockBackwards,
      desktopBlackout,
      islandRevealed,
      triggerFinale,
      setFinalePhase,
      reduceOracleStability,
      increaseOracleStability,
      reducePlayerHealth,
      increasePlayerHealth,
      finaleOutcome,
      addFinaleLines,
      setFinaleOutcome,
      setSystemInstability,
      onExplorerCloseRef,
    ]
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within GameProvider");
  }
  return ctx;
}
