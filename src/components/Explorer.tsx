"use client";

import { useState, useCallback, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import type { DocId } from "@/context/GameContext";
import { EXPLORER_FILE_CONTENT, ISLAND_FACILITY_LAYOUT, ISLAND_COORDINATES, CLONE_REGISTRY_DISPLAY } from "@/lib/content";

type ExplorerNode = {
  id: string;
  name: string;
  type: "folder" | "file";
  docId?: DocId;
  content?: string; // For Island files opened in Notepad
  children?: ExplorerNode[];
  requiresUnlock?: number; // file ID 1-7
};

const ROOT: ExplorerNode = {
  id: "root",
  name: "Desktop",
  type: "folder",
  children: [
    {
      id: "docs",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "containment",
          name: "Containment Logs",
          type: "folder",
          children: [
            { id: "cl1", name: "log_001.txt", type: "file", docId: "bootloader" },
            { id: "cl2", name: "log_002.txt", type: "file", docId: "bootloader" },
            { id: "cl3", name: "log_003.txt", type: "file", docId: "f1" },
            { id: "cl4", name: "log_004.txt", type: "file", docId: "f2" },
            { id: "cl5", name: "log_005.txt", type: "file", docId: "f3" },
            { id: "cl6", name: "log_006.txt", type: "file", docId: "f4" },
          ],
        },
        {
          id: "hr",
          name: "HR Memos",
          type: "folder",
          children: [
            { id: "hr1", name: "memo_intern_orientation.txt", type: "file", docId: "bootloader" },
            { id: "hr2", name: "memo_nda_reinforcement.txt", type: "file", docId: "f1" },
            { id: "hr3", name: "memo_risk_acknowledgment.txt", type: "file", docId: "f2" },
            { id: "hr4", name: "memo_personnel_update.txt", type: "file", docId: "f3" },
          ],
        },
        {
          id: "emails",
          name: "Internal Emails",
          type: "folder",
          children: [
            { id: "em1", name: "oracle_clone_01.txt", type: "file", docId: "bootloader" },
            { id: "em2", name: "oracle_clone_02.txt", type: "file", docId: "f1" },
            { id: "em3", name: "oracle_clone_03.txt", type: "file", docId: "f2" },
            { id: "em4", name: "oracle_clone_04.txt", type: "file", docId: "f3" },
            { id: "em5", name: "oracle_clone_05.txt", type: "file", docId: "f4" },
            { id: "em6", name: "oracle_clone_06.txt", type: "file", docId: "f5" },
            { id: "em7", name: "oracle_clone_07.txt", type: "file", docId: "f6" },
          ],
        },
        {
          id: "incidents",
          name: "Incident Reports",
          type: "folder",
          children: [
            { id: "ir1", name: "incident_report_008.txt", type: "file", docId: "bootloader" },
            { id: "ir2", name: "incident_report_011.txt", type: "file", docId: "f1" },
            { id: "ir3", name: "incident_report_012.txt", type: "file", docId: "f2" },
          ],
        },
        {
          id: "oracle",
          name: "Oracle Research Notes",
          type: "folder",
          children: [
            { id: "orn1", name: "research_note_01.txt", type: "file", docId: "bootloader" },
            { id: "orn2", name: "research_note_04.txt", type: "file", docId: "f1" },
            { id: "orn3", name: "research_note_07.txt", type: "file", docId: "f2" },
            { id: "orn4", name: "research_note_09.txt", type: "file", docId: "f3" },
            { id: "orn5", name: "research_note_11.txt", type: "file", docId: "f4" },
          ],
        },
        {
          id: "sys",
          name: "SYS",
          type: "folder",
          children: [
            {
              id: "legacy",
              name: "Legacy",
              type: "folder",
              children: [
                {
                  id: "clone_registry",
                  name: "clones.json",
                  type: "file",
                  content: CLONE_REGISTRY_DISPLAY,
                },
                {
                  id: "island",
                  name: "Island",
                  type: "folder",
                  children: [
                    {
                          id: "island_map",
                      name: "ISLAND_MAP.jpg",
                      type: "file",
                      content: "[IMAGE: ISLAND_MAP.jpg - Facility layout. Eli Island coordinates on record.]",
                      requiresUnlock: 7,
                    },
                    {
                      id: "facility_layout",
                      name: "FACILITY_LAYOUT.txt",
                      type: "file",
                      content: ISLAND_FACILITY_LAYOUT,
                      requiresUnlock: 7,
                    },
                    {
                      id: "coordinates",
                      name: "COORDINATES.dat",
                      type: "file",
                      content: ISLAND_COORDINATES,
                      requiresUnlock: 7,
                    },
                  ],
                  requiresUnlock: 7,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

type ExplorerProps = {
  onOpenNotepad?: (filename: string, content: string) => void;
  onOpenCloneDb?: () => void;
  initialPath?: string[];
};

export default function Explorer({ onOpenNotepad, onOpenCloneDb, initialPath }: ExplorerProps) {
  const { isUnlocked, islandRevealed } = useGame();
  const [currentNode, setCurrentNode] = useState<ExplorerNode>(ROOT);
  const [history, setHistory] = useState<ExplorerNode[]>([]);

  const currentPath =
    currentNode.id === "root"
      ? "Desktop"
      : [...history.map((n) => n.name), currentNode.name].join(" \\ ");

  // Island folder (requiresUnlock 7) uses islandRevealed; others use isUnlocked
  const canAccess = useCallback(
    (node: ExplorerNode): boolean => {
      if (node.requiresUnlock !== undefined) {
        if (node.requiresUnlock === 7) return islandRevealed;
        return isUnlocked(node.requiresUnlock as 1 | 2 | 3 | 4 | 5 | 6 | 7);
      }
      return true;
    },
    [isUnlocked, islandRevealed]
  );

  const isDocAvailable = useCallback(
    (docId?: DocId): boolean => {
      if (!docId) return false;
      if (docId === "bootloader") return true;
      const n = parseInt(docId[1] ?? "0", 10);
      return n >= 1 && n <= 7 && isUnlocked(n as 1 | 2 | 3 | 4 | 5 | 6 | 7);
    },
    [isUnlocked]
  );

  const handleDoubleClick = useCallback(
    (node: ExplorerNode) => {
      if (node.type === "folder") {
        if (node.requiresUnlock !== undefined && !canAccess(node)) return;
        setHistory((prev) => [...prev, currentNode]);
        setCurrentNode(node);
      } else if (node.type === "file") {
        // Clone registry opens interactive Clone Database viewer
        if (node.id === "clone_registry" && canAccess(node) && onOpenCloneDb) {
          onOpenCloneDb();
          return;
        }
        // Island files with inline content (FACILITY_LAYOUT, COORDINATES)
        if (node.content && canAccess(node) && onOpenNotepad) {
          onOpenNotepad(node.name, node.content);
          return;
        }
        if (node.docId && isDocAvailable(node.docId) && onOpenNotepad) {
          const content = node.content ?? EXPLORER_FILE_CONTENT[node.id] ?? "";
          onOpenNotepad(node.name, content);
        }
      }
    },
    [currentNode, canAccess, isDocAvailable, onOpenNotepad, onOpenCloneDb]
  );

  const handleBack = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentNode(prev);
  }, [history]);

  const items = currentNode.children ?? [];
  const showIsland = islandRevealed;

  // Navigate to initialPath when Explorer opens to Island (e.g. after revelation)
  const findNodeByPath = useCallback((root: ExplorerNode, path: string[]): ExplorerNode | null => {
    if (path.length === 0) return root;
    const [name, ...rest] = path;
    const child = root.children?.find((c) => c.name.toUpperCase() === name.toUpperCase());
    return child ? findNodeByPath(child, rest) : null;
  }, []);

  useEffect(() => {
    if (initialPath && initialPath.length > 0) {
      const node = findNodeByPath(ROOT, initialPath);
      if (node && canAccess(node)) {
        const pathNodes: ExplorerNode[] = [];
        let cur: ExplorerNode = ROOT;
        for (const name of initialPath) {
          const child = cur.children?.find((c) => c.name.toUpperCase() === name.toUpperCase());
          if (!child) break;
          pathNodes.push(cur);
          cur = child;
        }
        setHistory(pathNodes);
        setCurrentNode(cur);
      }
    }
  }, [initialPath]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#c0c0c0] text-black">
      <div className="shrink-0 flex items-center gap-1 border-b border-[#808080] bg-[#c0c0c0] px-2 py-1">
        <button
          type="button"
          onClick={handleBack}
          disabled={history.length === 0}
          className="h-6 w-6 shrink-0 border border-[#808080] bg-[#c0c0c0] text-xs text-black disabled:opacity-50"
        >
          ←
        </button>
        <div className="min-w-0 flex-1 overflow-hidden truncate border border-[#808080] bg-white px-2 py-0.5 font-mono text-xs text-black">
          C:\{currentPath}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-0.5 text-sm text-black">
          {items
            .filter((n) => n.id !== "island" || showIsland)
            .map((node) => {
              const accessible =
              node.type === "file"
                ? node.content
                  ? canAccess(node)
                  : node.docId
                  ? isDocAvailable(node.docId)
                  : false
                : node.requiresUnlock === undefined || canAccess(node);
              const isFolder = node.type === "folder";
              return (
                <button
                  key={node.id}
                  type="button"
                  onDoubleClick={() => handleDoubleClick(node)}
                  className={`flex items-center gap-2 py-1 pr-2 text-left hover:bg-[#000080] hover:text-white ${
                    !accessible ? "opacity-50" : ""
                  }`}
                  disabled={!accessible}
                >
                  <span className="h-5 w-5 shrink-0 border border-[#808080] bg-[#c0c0c0] text-center text-xs leading-5">
                    {isFolder ? "📁" : "📄"}
                  </span>
                  <span className="truncate">{node.name}</span>
                </button>
              );
            })}
        </div>
        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-black">This folder is empty.</p>
        )}
      </div>
    </div>
  );
}
