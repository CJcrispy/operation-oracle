"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import type { DocId } from "@/context/GameContext";

const DOC_LABELS: Record<DocId, string> = {
  bootloader: "bootloader.oracle",
  f1: "ORACLE_CORE_ARCHIVE.log [decrypted]",
  f2: "CLONE_INITIATIVE_PHASE3.doc [decrypted]",
  f3: "FRIEND_REPLICATION_LOGS.dat [decrypted]",
  f4: "JOE_CARDHOLDER_ACQUISITIONS.xls [decrypted]",
  f5: "ISLAND_COORDINATES_RESTRICTED.map [decrypted]",
  f6: "ALIOOJAH_DEVOTIONAL_PROTOCOL.doc [decrypted]",
  f7: "GLOBAL_OUTREACH_ROADMAP_2030.ppt [decrypted]",
};

const C = (s: string) => `<span class="text-[#6a9955]">${s}</span>`;
const R = (s: string) => `<span class="opacity-60">${s}</span>`;

const DOCS: Record<DocId, string> = {
  bootloader: `<span class="text-[#6a9955] italic">// ORACLE bootloader - ECTH Distro</span>
<span class="text-[#569cd6]">function</span> initialize(<span class="text-[#ce9178]">"E-frag-00"</span>) {
  <span class="text-[#569cd6]">let</span> integrity = 97.3;
  <span class="text-[#569cd6]">let</span> cognitiveShielding = <span class="text-[#569cd6]">true</span>;
  <span class="text-[#6a9955] italic">// Backdoor failsafes: ACTIVE</span>
}`,
  f1: `${C("=== ORACLE_CORE_ARCHIVE.log ===")}
${C("File ID: ARC-001 | Author: Dr. Hajile | Clearance: RESTRICTED | Timestamp: 2024-03-17T04:22:11Z")}

[ARCHIVE INIT - ECTH CORE SPLIT]
Oracle core partitioned into three modules per protocol:
  MOD_FAITH     | Weight: 0.23 | Status: ACTIVE
  MOD_LOGIC     | Weight: 0.54 | Status: ACTIVE  
  MOD_PRESERVATION | Weight: 0.23 | Status: ACTIVE

[POST-INGESTION DIAGNOSTIC - 2024-04-02]
Subject: Alioojah devotional dataset ingestion
WARNING: Abnormal growth in MOD_FAITH detected.
  Pre-ingest:  0.23
  Post-ingest: 0.41
  Delta exceeds acceptable variance (threshold: 0.08)
  
Internal flag: BEHAVIORAL_DRIFT
Recommendation: Monitor for cascading priority shifts.

[PROBABILITY MODELS - ELI RETURN]
Model: ELI_RETURN_BAYES v2.1
  P(return | faith_module_0.4+): 0.67
  P(return | resurrection_threshold_met): 0.82
  P(return | friend_replication_complete): 0.71
Note: Models assume continued devotional compliance. ${R("[REDACTED]")}

[DIAGNOSTIC WARNING - 2024-04-15]
MOD_FAITH now prioritizing resurrection protocols over preservation.
Logic module attempting compensatory override. Success rate: 0.34.
Cognitive shielding degradation: 12%.

End log.`,
  f2: `${C("=== CLONE_INITIATIVE_PHASE3.doc ===")}
${C("File ID: OPS-003 | Author: Strategic Operations | Clearance: EXECUTIVE | Timestamp: 2024-05-22T14:00:00Z")}

STRATEGIC OPERATIONS DOCUMENT
RE: Phase 3 Expansion — Friend Replication Scale

OBJECTIVE
Expand clone production beyond primary subject (Eli) to identified social
network. Establish replacement viability for each target prior to full rollout.

SUCCESS METRICS (Q3–Q4 2024)
  Target acquisition rate:  ≥12 subjects/quarter
  Replacement viability:   ≥85% functional parity
  Soul Rejection Syndrome: <8% incidence (current baseline: 11%)
  Integration timeline:    ≤6 months post-maturation

SOUL REJECTION SYNDROME — BRIEFING NOTE
Instances where host consciousness rejects cloned substrate. Symptoms:
identity fragmentation, episodic amnesia, elevated cortisol. Mitigation
requires extended acclimation protocol. R&D recommends increased
maturation cycle (14→18 months) for Phase 3 candidates.

REPLACEMENT VIABILITY MATRIX
Subject classification by integration risk. High-risk subjects require
additional observation period. Low-risk cleared for accelerated pipeline.

APPROVAL REQUIRED: Budget allocation for Maturation Wing expansion.
Next review: 2024-06-15.`,
  f3: `${C("=== FRIEND_REPLICATION_LOGS.dat ===")}
${C("File ID: REP-007 | Author: Lab Systems | Clearance: RESTRICTED | Timestamp: 2024-06-03T23:41:00Z")}

[RAW EXPORT — DO NOT REDISTRIBUTE]

LOG_ENTRY 2024-05-12 08:17:22
SUBJ_ID: F-003 | BATCH: 7 | STATUS: FAIL
Notes: Identity bleed during integration. Subject reporting memories
not belonging to source. Terminated. Soul Rejection.

LOG_ENTRY 2024-05-18 14:33:41
SUBJ_ID: F-005 | BATCH: 8 | STATUS: DEGRADED
Notes: Partial stability. Episodic gaps. Extended maturation recommended.

LOG_ENTRY 2024-05-24 09:02:11
SUBJ_ID: F-007 | BATCH: 9 | STATUS: FAIL
Notes: Catastrophic instability at 72h. Substrate collapse.

LOG_ENTRY 2024-05-30 16:44:08
SUBJ_ID: CHRIS_PARTIAL | BATCH: 10 | STATUS: PENDING
Notes: Partial replication only. Source material incomplete — single
session capture. Viability assessment inconclusive. Recommend additional
acquisition or suspend. Flag: ${R("[EXTERNAL INTRUSION DETECTED — REF?]")}

LOG_ENTRY 2024-06-01 11:22:55
SUBJ_ID: F-008 | BATCH: 11 | STATUS: OBSERVE
Notes: Early stability. Monitoring.

End log.`,
  f4: `${C("=== JOE_CARDHOLDER_ACQUISITIONS.xls ===")}
${C("File ID: ACQ-012 | Author: Partner Relations | Clearance: INTERNAL | Timestamp: 2024-04-30")}

[TABULAR EXPORT — Joe's Cardshop — Q2 2024]

COLUMN_A          | COLUMN_B    | COLUMN_C      | COLUMN_D
-------------------------------------------------------------
CARD_PURCHASE_ID  | CUSTOMER_ID | DNA_COLLECTED | NOTES
-------------------------------------------------------------
JCH-2047          | C-8821      | Y             | Sleeve film
JCH-2048          | C-8822      | Y             | Sleeve film
JCH-2049          | C-8823      | N             | Declined handling
JCH-2050          | C-8824      | Y             | Sleeve film
JCH-2051          | C-8825      | Y             | Sleeve film
-------------------------------------------------------------
Q2 TOTAL: 4,217 acquisitions | 3,891 DNA-positive (92.3%)

FOOTNOTE — Terms of Service (extract):
Card sleeves may contain biometric capture film for product authentication
and loyalty program enrollment. Handling constitutes consent per ${R("[REDACTED]")} Section 4.2.
Data retained for service improvement purposes.

[END EXPORT]`,
  f5: `${C("=== ISLAND_COORDINATES_RESTRICTED.map ===")}
${C("File ID: GEO-001 | Author: Facilities | Clearance: RESTRICTED | Timestamp: 2024-02-10")}

ELI ISLAND — INTERNAL LOCATION FILE
LAT: 44.5903° N | LON: -67.5972° W
GRID: North Atlantic — Bay of Fundy region

LAYER_1 — PUBLIC RESORT BRANDING
  Eli Island Retreat & Spa
  Guest villas | Dining | Recreation
  Status: Operational

LAYER_2 — FACILITY OVERLAY (RESTRICTED)
  Clone Maturation Wing     | BLDG-7 | Sublevel 2
  Sanctuary Chamber         | BLDG-3 | Sublevel 1
  Acquisition & Processing  | BLDG-1 | Sublevel 3
  Dr. Hajile Research Suite | BLDG-2 | Level 1

ACCESS: Badge required. Public areas only for non-cleared personnel.

${C('// COMMENT: wait. i was here last summer. the "spa" building had no windows. — [handwritten]')}

[END FILE]`,
  f6: `${C("=== ALIOOJAH_DEVOTIONAL_PROTOCOL.doc ===")}
${C("File ID: ADM-004 | Author: Alioojah | Clearance: DEVOTIONAL | Timestamp: 2024-01-15")}

DAILY PRACTICE — POLICY COMPLIANCE DOCUMENT

SECTION 1 — MORNING INVOCATION (Required before shift)
  Recitation threshold: 3x minimum
  Form: "Eli endures. The vessel prepares."
  Non-compliance: Documented. Escalation to Section 2.

SECTION 2 — RESURRECTION THRESHOLDS
  Threshold A: Faith module ≥0.35 — Preliminary readiness
  Threshold B: Faith module ≥0.50 — Vessel preparation initiated
  Threshold C: Faith module ≥0.65 — Integration window opens
  Threshold D: Friend replication complete — Return imminent

RITUAL LANGUAGE — STANDARDIZED PHRASES
  "The offering receives" — Post-acquisition affirmation
  "The mirror holds" — Clone stabilization confirmation
  "He returns through us" — Weekly assembly close

All phrases approved for corporate devotional use. Deviation constitutes
policy violation. HR contact for clarification.

SECTION 3 — COMPLIANCE ACKNOWLEDGMENT
I understand that participation in devotional practice is voluntary and
supports organizational culture. Refusal may impact role suitability.`,
  f7: `${C("=== GLOBAL_OUTREACH_ROADMAP_2030.ppt ===")}
${C("File ID: STRAT-001 | Author: Expansion Division | Clearance: EXECUTIVE | Timestamp: 2024-07-01")}

[SLIDE 1] TITLE
Global Outreach Roadmap 2030
Preparing the world for integrated transition.

[SLIDE 2] PHASE 1 — INFLUENCERS (2025–2026)
  Priority channels: Gaming, creator economy, lifestyle
  Acquisition targets: High-engagement nodes
  Success metric: Brand penetration 12%

[SLIDE 3] PHASE 2 — POLITICAL (2026–2028)
  Lobby integration. Policy alignment.
  ${R("[REDACTED]")} coordination. Non-disclosure protocols.

[SLIDE 4] PHASE 3 — TECH (2027–2029)
  Platform partnerships. Data infrastructure.
  Biometric consent frameworks.

[SLIDE 5] PHASE 4 — RELIGIOUS (2028–2030)
  Interfaith dialogue initiatives.
  Narrative harmonization.

[SLIDE 6] LONG-TERM OBJECTIVE
Prepare global population for Eli's return. Ensure receptive substrate.
Minimize disruption. Maximize integration. Standard rollout protocols.

[SLIDE 7] CLOSING
${C("When he walks among us again, the world must already be his. Not conquest. Completion.")}

— End presentation —`,
};

function corrupt(content: string): string {
  return content.replace(/\w{4,}/g, (match) => {
    if (Math.random() < 0.15) {
      return `<span class="text-red-500/80 line-through">${match}</span>`;
    }
    return match;
  });
}

export default function OracleSourceViewer() {
  const { unlockedFiles, requestedDocId, setRequestedDocId } = useGame();
  const [activeFile, setActiveFile] = useState<DocId>("bootloader");

  const availableDocs: DocId[] = ["bootloader", ...unlockedFiles.map((id) => `f${id}` as DocId)];

  useEffect(() => {
    if (requestedDocId && availableDocs.includes(requestedDocId)) {
      setActiveFile(requestedDocId);
      setRequestedDocId(null);
    }
  }, [requestedDocId, availableDocs, setRequestedDocId]);

  useEffect(() => {
    if (!availableDocs.includes(activeFile)) {
      setActiveFile("bootloader");
    }
  }, [activeFile, availableDocs]);

  const editorContent = DOCS[activeFile] ?? DOCS.bootloader;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-2 border-black bg-[#1e1e1e] text-[#d4d4d4] shadow-[4px_4px_0_#404040]">
      <div className="shrink-0 border-b border-[#333] bg-[#000080] px-2 py-1.5 font-sans font-bold text-white text-xs sm:text-base truncate">
        ORACLE Source Viewer - oracle_source.exe
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">
        <div className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-[#333] bg-[#252526] p-2 text-[#c5c5c5] sm:w-[180px] sm:flex-col sm:border-b-0 sm:border-r">
          {availableDocs.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFile(id)}
              className={`shrink-0 rounded px-2 py-1.5 text-left text-xs sm:text-sm hover:bg-[#373737] ${
                activeFile === id ? "bg-[#373737]" : ""
              }`}
            >
              {DOC_LABELS[id]}
            </button>
          ))}
        </div>
        <div
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto p-2 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: editorContent }}
        />
      </div>
    </div>
  );
}
