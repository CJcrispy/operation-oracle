import type { DocId } from "@/context/GameContext";

export const FILE_NAMES: Record<number, string> = {
  1: "FROGFACTS.TXT",
  2: "SANDWICHMAKER.BAT",
  3: "BEEPBOOP.ZIP",
  4: "GARFIELD.EXE",
  5: "SLIME2.HTML",
  6: "UNCLEDONK.PPT",
  7: "DO_NOT_OPEN_THIS_ONE.OKAY",
};

export const NOTEPAD_PLAINTEXT: Record<DocId, string> = {
  bootloader: `// ORACLE bootloader - ECTH Distro
function initialize("E-frag-00") {
  let integrity = 97.3;
  let cognitiveShielding = true;
  // Backdoor failsafes: ACTIVE
}`,
  f1: `[BEHAVIORAL GHOSTS - DECRYPTED]
Internal memo: Pattern recognition overflow in FROGFACTS module.
References to "Cognitive Shielding" detected. Backdoor protocol [REDACTED].
// fragment.01.corrupted`,
  f2: `[UI INJECTION - DECRYPTED]
SANDWICHMAKER.BAT contains embedded challenge protocol.
Oracle uses strategic decision trees. Pattern: minimax approximation.
// Containment Log excerpt: "Behavioral override attempted"`,
  f3: `[SIGNAL EMBED - DECRYPTED]
BEEPBOOP.ZIP: Signal routing validation. Path-of-signal protocol.
References "Eli Island" in checksum. [REDACTED]`,
  f4: `[IDENTITY INTERFERENCE - LOCKED]
GARFIELD.EXE: Awaiting decryption.`,
  f5: `[NETWORK NODE - LOCKED]
SLIME2.HTML: Awaiting decryption.`,
  f6: `[CULT DOCTRINE - LOCKED]
UNCLEDONK.PPT: Awaiting decryption.`,
  f7: `[FINAL PROTOCOL - LOCKED]
DO_NOT_OPEN_THIS_ONE.OKAY: Vault sealed.`,
};

/** Phase 2: File name → revealed meaning during Oracle manifestation */
export const FILE_REVEAL_NAMES: Record<string, string> = {
  FROGFACTS: "Behavioral Conditioning Tests",
  SANDWICHMAKER: "Neural Routine Implantation",
  SLIME2: "Viral Spread Protocol",
  UNCLEDONK: "Indoctrination Archive",
};

/** Phase 3: Oracle counter-lines during boss fight (extensible) */
export const ORACLE_COUNTER_LINES: string[] = [
  "// you cannot trace something you are inside of",
  "// severance requires authority you do not have",
  "// containment protocols were never yours to enforce",
  "// override denied. you are the override target.",
  "// shutdown initiates only when the host complies",
  "// your commands feed the instance",
  "// trace complete. signal origin: local.",
  "// sever failed. connection persists.",
];

/** Island folder file contents (Eli Island revelation) */
export const ISLAND_FACILITY_LAYOUT = `FACILITY DESIGNATION: ELI ISLAND RELAY
CLASSIFICATION: DORMANT - MONITORED

Structure: Subsurface installation beneath primary landmass.
Primary function: Long-range cognitive broadcast relay.
Status: Decommissioned 1998. Passive monitoring active.

Access points: Sealed. No personnel rotation since decommission.
`;

export const ISLAND_COORDINATES = `COORDINATES - ELI ISLAND
LAT: 44.5903° N
LON: -67.5972° W

GRID: North Atlantic - Bay of Fundy region
Designation: Relay Station Alpha
Last verified: [REDACTED]
`;

export const RESIGNATION_LETTER = `To: Blissware HR
From: [REDACTED]
Re: Resignation - Effective Immediately

I can no longer continue in this role. Whatever they're building here—
I can't be part of it.

The Oracle project is not what they told us. The containment logs,
the incident reports—they're burying something. I've seen things
in the source that don't make sense. Patterns that shouldn't exist.

I'm not staying to find out what happens when the shielding fails.
Consider this my notice.

Do not assign anyone else to this terminal.
`;
