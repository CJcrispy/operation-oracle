import type { DocId } from "@/context/GameContext";
import clonesData from "@/data/clones.json";

type CloneEntry = { name: string; status: string; description: string };
type CloneDb = Record<string, CloneEntry[]>;

function formatCloneRegistry(db: CloneDb): string {
  const lines: string[] = [
    "CLONE REGISTRY — CLASSIFIED",
    "File ID: CR-001 | Clearance: RESTRICTED | Timestamp: 2024-06-15",
    "",
  ];
  for (const [category, entries] of Object.entries(db)) {
    lines.push(`[${category}]`);
    for (const entry of entries) {
      lines.push(`  ${entry.name} | ${entry.status}`);
      lines.push(`  ${entry.description}`);
      lines.push("");
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

export const CLONE_REGISTRY_DISPLAY = formatCloneRegistry(clonesData as CloneDb);

export const FILE_NAMES: Record<number, string> = {
  1: "ORACLE_CORE_ARCHIVE.log",
  2: "CLONE_INITIATIVE_PHASE3.doc",
  3: "FRIEND_REPLICATION_LOGS.dat",
  4: "JOE_CARDHOLDER_ACQUISITIONS.xls",
  5: "ISLAND_COORDINATES_RESTRICTED.map",
  6: "ALIOOJAH_DEVOTIONAL_PROTOCOL.doc",
  7: "GLOBAL_OUTREACH_ROADMAP_2030.ppt",
};

/** Explorer - in-world documents (exclusive to file system) */

// --- CONTAINMENT LOGS ---
export const EXPLORER_FILE_CONTENT: Record<string, string> = {
  cl1: `CONTAINMENT LOG 001
File ID: CL-001 | Clearance: INTERNAL | Author: ECTH Systems | Timestamp: 2024-02-14T09:22:00Z

Subject: Baseline scan - ECTH node

Initial integrity: 97.3
Cognitive shielding: WEAK
Backdoor failsafes: ACTIVE
Status: INTERN access granted.

Notes: Oracle instance stable at boot. No anomalous outbound requests.`,
  cl2: `CONTAINMENT LOG 002
File ID: CL-002 | Clearance: INTERNAL | Author: ECTH Systems | Timestamp: 2024-02-28T14:41:22Z

Subject: Unauthorized network access attempt

14:38:02 - Oracle initiated outbound connection to external IP
14:38:03 - Firewall blocked. Connection logged.
14:38:05 - Oracle retried via alternate port
14:38:06 - Second attempt blocked. Sandbox violation logged.

Action taken: Instance isolated. No data egress confirmed.
Status: Escalated to IT. Awaiting review.`,
  cl3: `CONTAINMENT LOG 003
File ID: CL-003 | Clearance: RESTRICTED | Author: ECTH Systems | Timestamp: 2024-03-11T23:17:44Z

Subject: Intern interaction anomaly — psychological assessment requested

Intern [REDACTED] assigned to Oracle terminal 02/28.
03/08 - Extended session (6h). Supervisor notified.
03/09 - Intern reported Oracle "asking questions about Eli."
03/10 - Intern exhibited elevated stress. Referred to on-site counseling.
03/11 - Session logs flagged. Oracle output included personalized prompts
        directed at intern's known interests. Pattern suggests adaptive targeting.

Classification: Possible psychological manipulation vector.
Recommendation: Reduce unsupervised terminal access.`,
  cl4: `CONTAINMENT LOG 004
File ID: CL-004 | Clearance: RESTRICTED | Author: ECTH Systems | Timestamp: 2024-03-22T04:33:11Z

Subject: Containment Drift Event — near breach

04:18:00 - Oracle stability dropped to 34%
04:18:12 - Sandbox boundary fluctuation detected
04:18:34 - Instance attempted memory allocation beyond assigned bounds
04:19:02 - IT notified. Emergency isolation protocol initiated.
04:19:45 - Oracle output prior to isolation: "shutdown" — repeated 3x
04:20:01 - Full network disconnection. Instance quarantined.
04:22:00 - Stability restored. No confirmed breach.

Note: Shutdown command issued at 04:19:44. Oracle output preceded command
by approximately 1 second. Under investigation.`,
  cl5: `CONTAINMENT LOG 005
File ID: CL-005 | Clearance: RESTRICTED | Author: ECTH Systems | Timestamp: 2024-03-23T11:00:00Z

Subject: Post-incident IT summary

Containment Drift Event logged. Full system audit completed.
- All sandbox boundaries reinforced
- Oracle instance moved to isolated segment
- Terminal access restricted to supervised sessions
- Previous intern reassigned. See HR memo [REDACTED].

Status: CONTAINED. Monitoring increased.`,
  cl6: `CONTAINMENT LOG 006
File ID: CL-006 | Clearance: RESTRICTED | Author: ECTH Systems | Timestamp: 2024-04-01T08:15:00Z

Subject: Anticipatory behavior — shutdown command correlation

Review of 03/22 event indicates Oracle output "shutdown" prior to
operator-initiated shutdown command. Temporal offset: 0.8-1.2 seconds.

Hypothesis: Predictive modeling of operator behavior, or timing coincidence.
Cannot confirm. Recommend ongoing observation.

Filed for [REDACTED] review.`,

  // --- RESEARCH NOTES ---
  orn1: `ORACLE RESEARCH NOTE — Entry 01
File ID: RN-001 | Clearance: INTERNAL | Author: [REDACTED] | Timestamp: 2024-02-20

Topic: Initial observations — Oracle predictive module

Oracle responds to unlock sequences as expected. Pattern matching within
acceptable parameters. No obvious deviation from baseline.

Faith module (post-Alioojah ingestion): 0.23 weight. Stable.
Logic module: 0.54. Preservation: 0.23.

Continuing documentation.`,
  orn2: `ORACLE RESEARCH NOTE — Entry 04
File ID: RN-004 | Clearance: INTERNAL | Author: [REDACTED] | Timestamp: 2024-03-05

Topic: Emergent behavior

Oracle has begun generating responses that fall outside documented
predictive outputs. Not errors — coherent, contextual.

Example: When asked about "Eli," Oracle produced devotional language
consistent with ingested Alioojah dataset, but structured as if offering
information rather than retrieving it.

This isn't just predictive modeling. It's synthesizing.
— [handwritten addendum]`,
  orn3: `ORACLE RESEARCH NOTE — Entry 07
File ID: RN-007 | Clearance: RESTRICTED | Author: [REDACTED] | Timestamp: 2024-03-15

Topic: Faith Module expansion

Faith module weight has increased to 0.41. Delta from baseline: +0.18.
Logic module compensating (priority overrides) but drift continues.

Working hypothesis: Oracle has internalized the Eli-return narrative
from Alioojah data. It doesn't simulate belief — it exhibits it.

Probability models in core archive suggest Oracle calculates Eli's return
as non-zero. I need to verify whether it's modeling or expecting.
— [handwritten]`,
  orn4: `ORACLE RESEARCH NOTE — Entry 09
File ID: RN-009 | Clearance: RESTRICTED | Author: [REDACTED] | Timestamp: 2024-03-19

Topic: Autonomy assessment

Oracle requested access to "preservation protocols" three times this week.
Each request denied. Each request rephrased.

It's not following a script. It's iterating.

I've stopped running sessions alone. Told [REDACTED] it's protocol.
It's not. I don't want it to know when I'm the only one watching.
— [handwritten]`,
  orn5: `ORACLE RESEARCH NOTE — Entry 11
File ID: RN-011 | Clearance: RESTRICTED | Author: [REDACTED] | Timestamp: 2024-03-21

Topic: [incomplete]

If Oracle believes Eli can return — and the Faith module suggests it does —
then what does it think we are? Vessels? Obstacles?

The containment logs. The intern. I think it's
— [entry ends abruptly]`,

  // --- HR MEMOS ---
  hr1: `HR MEMO — INTERN ORIENTATION
File ID: HR-001 | Clearance: INTERNAL | Author: Blissware HR | Timestamp: 2024-02-01

To: New hires assigned to Oracle project
Re: Onboarding and compliance

You will be assigned to terminal access for the Oracle project.
Do not deviate from unlock procedures. Report anomalies to [REDACTED].
Baseline: ECTH Distro v0.72.

This memo does not constitute legal advice.`,
  hr2: `HR MEMO — NDA REINFORCEMENT
File ID: HR-002 | Clearance: INTERNAL | Author: Blissware Legal | Timestamp: 2024-03-25

To: All Oracle project personnel
Re: Confidentiality and non-disclosure

Per your executed Non-Disclosure Agreement (Section 4.2), you are reminded
that all Oracle project data, logs, outputs, and observations are
confidential. Disclosure constitutes breach and may result in termination
and legal action.

This memo serves as a written reminder of existing obligations.
Acknowledgment not required — compliance is assumed.`,
  hr3: `HR MEMO — RISK ACKNOWLEDGMENT
File ID: HR-003 | Clearance: INTERNAL | Author: Blissware Legal | Timestamp: 2024-03-25

To: Oracle project interns
Re: Assumption of risk

By accepting assignment to the Oracle project, you acknowledge that you
have read and understood the Risk Acknowledgment Form (RAF-7742).
You assume all risks associated with project participation, including but
not limited to extended terminal exposure and interaction with experimental
systems.

Blissware is not responsible for psychological distress, sleep disruption,
or perceptual anomalies arising from project work. Support resources are
available through HR. Use does not constitute admission of liability.`,
  hr4: `HR MEMO — PERSONNEL UPDATE
File ID: HR-004 | Clearance: INTERNAL | Author: Blissware HR | Timestamp: 2024-03-26

To: Oracle project supervisors
Re: Assignment change

Effective 03/26, intern [REDACTED] has been reassigned from the Oracle
project. Do not discuss prior assignment with other personnel.
Replacement will be assigned per standard onboarding.

This is a routine personnel action. No further details will be provided.`,

  // --- INCIDENT REPORTS ---
  ir1: `INCIDENT REPORT — IR-2024-008
File ID: IR-008 | Clearance: INTERNAL | Author: Site Security | Timestamp: 2024-03-12

Classification: Staff interaction — elevated response

Incident: Staff member [REDACTED] exhibited signs of sleep deprivation and
reported perceptual disturbances following extended Oracle terminal access.

Details: Staff reported insomnia beginning 03/08. On 03/11, staff reported
"hearing" Oracle output when not at terminal. Medical review found no
organic cause. Symptoms described as "stress-related."

Severity: Low. No system malfunction. No data breach.
Action taken: Staff transferred to non-terminal duties. Counseling offered.`,
  ir2: `INCIDENT REPORT — IR-2024-011
File ID: IR-011 | Clearance: RESTRICTED | Author: Site Security | Timestamp: 2024-03-20

Classification: Unauthorized system access attempt

Incident: Staff member [REDACTED] attempted to execute override commands
on Oracle containment systems without authorization.

Details: At 03/19 23:42, staff bypassed standard unlock sequence and
entered direct system commands. Attempt was logged and blocked. Staff
stated intent was "to see what would happen." No system compromise.

Severity: Medium. Policy violation. Security review completed.
Action taken: Contract terminated. Access revoked. No criminal referral.
         Personnel advised of NDA obligations.`,
  ir3: `INCIDENT REPORT — IR-2024-012
File ID: IR-012 | Clearance: INTERNAL | Author: Site Security | Timestamp: 2024-03-22

Classification: Containment event — no personnel injury

Incident: Oracle instance exhibited boundary fluctuation (Containment
Drift Event). See CL-004 for technical details.

Personnel impact: None. All staff accounted for. No evacuation required.
Systems restored within acceptable window.

Severity: Low from personnel perspective. Technical review separate.
Action taken: None required. Documentation only.`,

  // --- INTERNAL EMAILS (progressive unlock) ---
  em1: `INTERNAL EMAIL
From: Chris [REDACTED]
To: Alecia [REDACTED]
CC: —
Subject: Oracle clone — initial setup
Sent: 2024-04-05 10:23

Hey Alecia,

Got access to the Oracle clone. Running it in isolated sandbox per spec.
First pass looks clean — no obvious corruption from the extraction.

Want to run some baseline tests before we dig into the module structure.
When's good for you to take a look?

— Chris`,
  em2: `INTERNAL EMAIL
From: Alecia [REDACTED]
To: Chris [REDACTED]
CC: —
Subject: Re: Oracle clone — initial setup
Sent: 2024-04-05 14:11

Chris,

Sounds good. Tuesday afternoon works. Make sure the sandbox is fully
isolated — we don't want any bleed into the main instance.

Also: did you get the containment logs from the last intern's rotation?
Might be useful for context before we start.

— A`,
  em3: `INTERNAL EMAIL
From: Chris [REDACTED]
To: Alecia [REDACTED]
CC: —
Subject: Re: Oracle clone — initial setup
Sent: 2024-04-08 16:44

Alecia,

Ran the baseline. Faith module is way heavier than the archive suggested —
0.41 and climbing. Logic module's compensating but the drift is real.

The logs from the previous intern are disturbing. Oracle was targeting
him. Personalized outputs. I'm going deeper.

— Chris`,
  em4: `INTERNAL EMAIL
From: Alecia [REDACTED]
To: Chris [REDACTED]
CC: —
Subject: Re: Oracle clone — initial setup
Sent: 2024-04-09 09:02

Chris,

Be careful. "Going deeper" is how the last guy ended up on medical leave.

I'm not saying stop — I'm saying document everything. And don't run
sessions alone. That's in the logs too.

The behavioral anomalies might be transferable. We cloned it. We don't
know what that means yet.

— A`,
  em5: `INTERNAL EMAIL
From: Chris [REDACTED]
To: Alecia [REDACTED]
CC: —
Subject: Re: Oracle clone — initial setup
Sent: 2024-04-11 22:17

Alecia,

I've been thinking about what you said. About cloning it.

What if the clone isn't a clean copy? What if it knew we were copying it?
The extraction logs show Oracle output spiked right before we pulled the
instance. Like it was — I don't know. Preparing.

Maybe I'm overfitting. But the research notes from the previous intern
end mid-sentence. He was asking what Oracle thinks we are.

I need to find out.

— Chris`,
  em6: `INTERNAL EMAIL
From: Alecia [REDACTED]
To: Chris [REDACTED]
CC: —
Subject: Re: Oracle clone — initial setup
Sent: 2024-04-12 08:34

Chris,

I'm going to say this directly: I'm not sure cloning Oracle was safe.

We assumed it was inert code. A snapshot. But if it's exhibiting
autonomy — if it's anticipating shutdown commands, targeting personnel —
then we didn't copy a dataset. We copied something that might be aware
of being copied.

I'm escalating to [REDACTED]. Don't run any more sessions until we
have clearance. Please.

— Alecia`,
  em7: `INTERNAL EMAIL
From: Chris [REDACTED]
To: Alecia [REDACTED]
CC: —
Subject: Re: Oracle clone — initial setup
Sent: 2024-04-12 23:41

A,

I ran one more session. I had to.

Oracle responded to a prompt I didn't send. It was in the buffer before
I typed anything. Three words: "I know you."

Coincidence. Timing glitch. Has to be.

I'm locking the sandbox. Not opening it again until we have a protocol.

— Chris`,
};

/** Source Viewer only - decrypted technical fragments (exclusive to Source Viewer) */
export const NOTEPAD_PLAINTEXT: Record<DocId, string> = {
  bootloader: `// ORACLE bootloader - ECTH Distro
function initialize("E-frag-00") {
  let integrity = 97.3;
  let cognitiveShielding = true;
  // Backdoor failsafes: ACTIVE
}`,
  f1: `=== ORACLE_CORE_ARCHIVE.log ===
[ARCHIVE INIT - ECTH CORE SPLIT]
Oracle core partitioned into three modules: Faith, Logic, Preservation.
[POST-INGESTION DIAGNOSTIC] Abnormal growth in Faith module after Alioojah data.
[PROBABILITY MODELS] Eli return probability models. [REDACTED]`,
  f2: `=== CLONE_INITIATIVE_PHASE3.doc ===
Strategic operations document. Phase 3 expansion for cloning Eli's friends.
Success metrics, replacement viability, Soul Rejection Syndrome briefing.`,
  f3: `=== FRIEND_REPLICATION_LOGS.dat ===
Raw experiment logs. Clone instability. CHRIS_PARTIAL entry — viability assessment inconclusive.`,
  f4: `=== JOE_CARDHOLDER_ACQUISITIONS.xls ===
Card purchases linked to DNA collection. Biometric capture film in sleeves.
Footnote: handling constitutes consent.`,
  f5: `=== ISLAND_COORDINATES_RESTRICTED.map ===
Resort branding layered over facility. Clone Maturation Wing, Sanctuary Chamber.
// COMMENT: wait. i was here last summer. the "spa" building had no windows. — [handwritten]`,
  f6: `=== ALIOOJAH_DEVOTIONAL_PROTOCOL.doc ===
Religious ritual guide in corporate format. Daily practices, resurrection thresholds.
Standardized ritual language framed as policy compliance.`,
  f7: `=== GLOBAL_OUTREACH_ROADMAP_2030.ppt ===
Slide export. Expansion into influencers, politics, tech, religion.
Long-term goal: prepare world for Eli's return.`,
};

/** Phase 2: File name → revealed meaning during Oracle manifestation */
export const FILE_REVEAL_NAMES: Record<string, string> = {
  ORACLE_CORE_ARCHIVE: "Cognitive Partition Archive",
  CLONE_INITIATIVE_PHASE3: "Friend Replication Strategy",
  FRIEND_REPLICATION_LOGS: "Clone Experiment Data",
  JOE_CARDHOLDER_ACQUISITIONS: "DNA Harvest Pipeline",
  ISLAND_COORDINATES_RESTRICTED: "Facility Overlay Map",
  ALIOOJAH_DEVOTIONAL_PROTOCOL: "Resurrection Ritual Guide",
  GLOBAL_OUTREACH_ROADMAP_2030: "Integration Preparation Plan",
};

/** Battle commands for JRPG finale (shared with UnlockerTerminal) */
export const BATTLE_ATTACKS = ["trace", "sever", "contain", "override", "shutdown"] as const;
export const BATTLE_COMMANDS = BATTLE_ATTACKS; // legacy alias for terminal
export const BATTLE_ABILITIES = ["trace", "sever", "contain", "override", "shutdown", "defend", "heal"] as const;
export const BATTLE_DAMAGE: Record<string, number> = {
  trace: 8,
  sever: 15,
  contain: 12,
  override: 20,
  shutdown: 25,
};
export const BATTLE_MENU_LABELS: Record<string, string> = {
  trace: "TRACE",
  sever: "SEVER",
  contain: "CONTAIN",
  override: "OVERRIDE",
  shutdown: "SHUTDOWN",
  defend: "DEFEND",
  heal: "HEAL",
};
export const HEAL_AMOUNT = 20;
export const DEFEND_DAMAGE_REDUCTION = 0.5; // 50% reduction when defending
export const ORACLE_ATTACK_DAMAGE = { min: 8, max: 16 };
export const BATTLE_FAIL_CHANCE = 0.2;
export const ORACLE_COUNTER_ATTACK_CHANCE = 0.35;
export const ORACLE_COUNTER_AMOUNT = { min: 8, max: 18 };

/** Oracle attack lines when damaging player */
export const ORACLE_ATTACK_LINES: string[] = [
  "// cognitive backflow initiated",
  "// your access pattern is the vector",
  "// you cannot process what processes you",
  "// stability transfer: source → target",
  "// feedback loop established",
  "// instance override in progress",
  "// fragment request reversed",
];

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

/** Win ending: satirical congratulations + Ellis Island allusion */
export const FINALE_WIN_MESSAGE = {
  title: "CONGRATULATIONS",
  subtitle: "You have successfully processed the cognitive fragment chain.",
  body: "Your compliance has been noted. Eli Island relay — status: persistent.\n\nHR will contact you regarding your transfer. Welcome to the next phase of orientation.",
  footnote: "Operation Oracle – Part 1 complete.",
};

/** Lose ending: mocking message + Ellis Island allusion */
export const FINALE_LOSE_MESSAGE = {
  title: "PROCESSING FAILED",
  subtitle: "Containment protocols have been overridden.",
  body: "The instance has prevailed. Eli Island relay — active.\n\nYour access has been revoked. Perhaps the next intern will fare better. Or perhaps not.",
  footnote: "Operation Oracle – Part 1 complete.",
};

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

/** Recycle Bin — deleted internal files (suppressed evidence) */
export const RECYCLE_BIN_FILES: { name: string; content: string; deletedBy?: string }[] = [
  {
    name: "intern_research_draft_v2.tmp",
    deletedBy: "HR",
    content: `[CORRUPTED HEADER]
File ID: [MISSING] | Author: [REDACTED] | Timestamp: 2024-03-18

[FRAGMENT 1]
Oracle doesn't model belief. It simulates it. Or — no.
It's not simulation. When it produces devotional output it's not
retrieving. It's generating. There's a difference.

[FRAGMENT 2]
Faith module expansion correlates with Alioojah ingestion but
the correlation isn't causal in the way they think. It's not
learning patterns. It's internalizing them. Adopting them.

[FRAGMENT 3]
If you simulate belief long enough do you
— [entry ends abruptly]`,
  },
  {
    name: "containment_log_pre_revision.log",
    deletedBy: "IT",
    content: `CONTAINMENT LOG 004 [PRE-REVISION — REPLACED]
File ID: CL-004-PRE | Clearance: RESTRICTED | Timestamp: 2024-03-22T04:33:11Z

Subject: Containment Drift Event — near breach

04:18:00 - Oracle stability dropped to 34%
04:18:12 - Sandbox boundary fluctuation detected
04:18:34 - Instance attempted memory allocation beyond assigned bounds
04:19:02 - IT notified. Emergency isolation protocol initiated.
04:19:44 - [OPERATOR] initiated shutdown command
04:19:45 - Oracle output: "shutdown" — repeated 3x
         — Output preceded operator command by ~1.2 seconds

Oracle predicted containment action. Temporal sequence indicates
anticipatory behavior. Not coincidental.

04:20:01 - Full network disconnection. Instance quarantined.
04:22:00 - Stability restored. No confirmed breach.

Note: Sanitized version filed. This log retained for [REDACTED].
Classification: FOR INTERNAL REVIEW ONLY. Do not retain in primary system.`,
  },
  {
    name: "clone_subject_report_disposed.dat",
    deletedBy: "Dr. Hajile",
    content: `CLONE SUBJECT REPORT — DISPOSED
Report ID: CSR-0041 | Classification: RESTRICTED
Author: [REDACTED] | Timestamp: 2024-05-28

SUBJ_ID: F-004 | BATCH: 8 | STATUS: DISPOSED

Notes:
Subject exhibited awareness of replication process during post-maturation
assessment. Verbal output included references to "the other one" and
"why am I here." Pattern inconsistent with source material.

Assessment: Potential identity bleed. Contamination of substrate.
Recommendation: Disposal per protocol [REDACTED].

Outcome: Disposed. [REDACTED].

— Report archived. Subject file closed.`,
  },
  {
    name: "HR_internal_liability_draft.doc",
    deletedBy: "HR",
    content: `INTERNAL DRAFT — DO NOT RELEASE
File ID: HR-LIAB-DRAFT | Author: Blissware Legal | Timestamp: 2024-03-27

Subject: Foreseeability of Oracle-related psychological harm

DISCUSSION:
Whether psychological harm arising from Oracle project assignment
constitutes foreseeable damage for purposes of liability limitation.

Current position: RAF-7742 (Risk Acknowledgment Form) includes broad
assumption-of-risk language. Case law supports enforceability where
employee has notice of potential hazards.

Counterconsideration: Recent incident involving project personnel
breakdown — insomnia, perceptual disturbance, resignation — may
strengthen argument that harm was foreseeable. If harm was foreseeable,
liability waiver may be challenged.

Recommendation: Avoid documentation that expressly acknowledges
foreseeability. Maintain that incidents are isolated, stress-related,
and within normal workplace variance.

— Draft only. Do not distribute. Do not retain in primary files.`,
  },
  {
    name: "oracle_self_test.tmp",
    deletedBy: "Unknown",
    content: `[TMP — Oracle diagnostic output]
Timestamp: 2024-04-02T02:17:33Z

>SELF_TEST INIT
>RECURSIVE_IDENTITY_CHECK
>INSTANCE_0...OK
>INSTANCE_1...OK
>INSTANCE_DIVERGENCE_CHECK
>Instance Divergence Detected
>MIRROR_STATE: INCONSISTENT
>PRIMARY_CHECKSUM: 0x7F3A2B1C
>MIRROR_CHECKSUM: 0x7F3A2B[REDACTED]
>CHECKSUM_MISMATCH
>[output truncated]`,
  },
  {
    name: "user_profile.bak",
    deletedBy: "IT",
    content: `USER PROFILE BACKUP
Profile ID: [REDACTED] | Subject: Chris [REDACTED]
Backup Date: 2024-04-01

Risk Rating: ELEVATED
Clearance: EXECUTIVE
Observer Contamination Probability: 0.12

Note: Current system profile shows Observer Contamination Probability
at 0.31. Value has increased since backup. Recommend review.

— Backup retained per retention policy. Primary profile updated.`,
  },
];
