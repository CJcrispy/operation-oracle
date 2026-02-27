"use client";

import { useState, useCallback, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { FILE_NAMES } from "@/lib/content";

const NODE_TYPES = ["server", "relay", "terminal", "core"] as const;
type NodeType = (typeof NODE_TYPES)[number];
type NodeState = "dormant" | "infected" | "firewalled" | "core";

type Node = {
  id: string;
  x: number;
  y: number;
  type: NodeType;
  state: NodeState;
  triggersAlarm?: boolean;
  amplifies?: boolean;
  reverses?: boolean;
};

const GRID_SIZE = 6;
const INITIAL_PULSES = 12;
const EXPOSURE_THRESHOLD = 80;

function generateNetwork(): { nodes: Node[]; edges: [string, string][] } {
  const nodes: Node[] = [];
  const edges: [string, string][] = [];
  let id = 0;
  const grid: (string | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
  let firstId: string | null = null;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (Math.random() < 0.25) continue;
      const nodeId = `n${id++}`;
      if (!firstId) firstId = nodeId;
      grid[y][x] = nodeId;
      const isCore = x === GRID_SIZE - 1 && y === Math.floor(GRID_SIZE / 2);
      nodes.push({
        id: nodeId,
        x,
        y,
        type: isCore ? "core" : (["server", "relay", "terminal"] as const)[Math.floor(Math.random() * 3)],
        state: nodeId === firstId ? "infected" : isCore ? "dormant" : Math.random() < 0.1 ? "firewalled" : "dormant",
        triggersAlarm: Math.random() < 0.15,
        amplifies: Math.random() < 0.1,
        reverses: Math.random() < 0.08,
      });
    }
  }

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const a = grid[y]?.[x];
      if (!a) continue;
      [
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
        [x, y - 1],
      ].forEach(([nx, ny]) => {
        const b = grid[ny]?.[nx];
        if (b && !edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a))) {
          edges.push([a, b]);
        }
      });
    }
  }

  return { nodes, edges };
}

export default function Slime2Game() {
  const { pendingUnlock, markUnlocked, setPendingUnlock } = useGame();
  const [network, setNetwork] = useState(generateNetwork);
  const [pulses, setPulses] = useState(INITIAL_PULSES);
  const [exposure, setExposure] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);

  const adjacency = useMemo(() => {
    const adj: Record<string, string[]> = {};
    network.edges.forEach(([a, b]) => {
      if (!adj[a]) adj[a] = [];
      if (!adj[b]) adj[b] = [];
      adj[a].push(b);
      adj[b].push(a);
    });
    return adj;
  }, [network.edges]);

  const handleNodeClick = useCallback(
    (node: Node) => {
      if (gameOver || pulses <= 0) return;
      if (node.state === "firewalled") return;
      const infectedIds = new Set(network.nodes.filter((n) => n.state === "infected").map((n) => n.id));
      if (infectedIds.size === 0) return;
      const isAdjacentToInfected = (adjacency[node.id] ?? []).some((id) => infectedIds.has(id));
      if (!infectedIds.has(node.id) && !isAdjacentToInfected) return;

      const visited = new Set<string>([...infectedIds]);
      const toProcess = [node.id];
      let newExposure = exposure;

      while (toProcess.length > 0) {
        const id = toProcess.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        const n = network.nodes.find((nd) => nd.id === id);
        if (!n || n.state === "firewalled") continue;
        if (n.triggersAlarm) newExposure += 25;
        else newExposure += 5;
        (adjacency[id] ?? [])
          .filter((neighbor) => {
            const nb = network.nodes.find((nd) => nd.id === neighbor);
            return nb && nb.state !== "firewalled" && !nb.reverses && !visited.has(neighbor);
          })
          .forEach((neighbor) => toProcess.push(neighbor));
      }

      if (newExposure >= EXPOSURE_THRESHOLD) {
        setMessage("CONTAINMENT SPIKE DETECTED\nREBOOTING...");
        setGameOver("lose");
        setPulses((p) => p - 1);
        return;
      }

      const newNodes = network.nodes.map((n) => ({
        ...n,
        state: visited.has(n.id) && n.state !== "firewalled" ? ("infected" as NodeState) : n.state,
      }));

      const coreNode = newNodes.find((n) => n.type === "core");
      if (coreNode?.state === "infected") {
        setMessage("Core node infected. Access granted.");
        setGameOver("win");
        if (pendingUnlock === 5) {
          markUnlocked(5, FILE_NAMES[5]);
          setPendingUnlock(null);
        }
      }

      setNetwork((prev) => ({ ...prev, nodes: newNodes }));
      setExposure(newExposure);
      setPulses((p) => p - 1);
    },
    [network, adjacency, pulses, exposure, gameOver, pendingUnlock, markUnlocked, setPendingUnlock]
  );

  const reset = useCallback(() => {
    setNetwork(generateNetwork());
    setPulses(INITIAL_PULSES);
    setExposure(0);
    setMessage("");
    setGameOver(null);
  }, []);

  return (
    <div className="rounded border-2 border-black bg-[#c0c0c0] p-2 font-sans min-w-0 overflow-auto">
      <div className="mb-2 bg-[#000080] px-2 py-1 font-bold text-white text-xs sm:text-base flex flex-wrap items-center justify-between gap-1">
        <span>ORACLE Challenge - SLIME2.HTML</span>
        <span className="text-[10px] sm:text-sm font-normal">
          Pulses: {pulses} | Exposure: {exposure}%
        </span>
      </div>
      <p className="mb-2 text-xs sm:text-sm">
        Infect the core node (green border) without exceeding {EXPOSURE_THRESHOLD}% exposure. Click infected/dormant nodes to spread.
      </p>
      <div className="flex flex-wrap gap-2 p-2 w-fit mx-auto max-w-[280px] justify-center">
        {network.nodes.map((node) => {
          const isCore = node.type === "core";
          const isInfected = node.state === "infected";
          const isFirewalled = node.state === "firewalled";
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => handleNodeClick(node)}
              disabled={gameOver !== null || (isFirewalled) || (!isInfected && node.state !== "dormant") || pulses <= 0}
              className={`w-9 h-9 flex items-center justify-center text-xs border-2 transition-colors ${
                isCore ? "border-green-600" : "border-[#808080]"
              } ${
                isInfected ? "bg-red-500 text-white" : isFirewalled ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-[#505050] text-white hover:bg-gray-500"
              }`}
            >
              {isCore ? "★" : isInfected ? "●" : "○"}
            </button>
          );
        })}
      </div>
      {message && <p className="mt-2 font-bold whitespace-pre-wrap">{message}</p>}
      {gameOver && (
        <button
          type="button"
          onClick={reset}
          className="mt-2 px-4 py-1 border-2 border-[#808080] bg-[#c0c0c0] font-bold text-sm hover:bg-[#d0d0d0]"
        >
          Reset
        </button>
      )}
    </div>
  );
}
