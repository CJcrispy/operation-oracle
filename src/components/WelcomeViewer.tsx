"use client";

const WELCOME_CONTENT = `
BLISSWARE SYSTEM ENVIRONMENT
ARCHIVE NODE: [REDACTED]_REMOTE
ACCESS CLASSIFICATION: UNVERIFIED

-----------------------------------------

If you are reading this, the system has failed to authenticate you properly.

This environment is not intended for public use.
No external access points are officially recognized.
All anomalies will be logged and ignored.

-----------------------------------------

You are currently viewing a mirrored workspace of the Oracle Research Division.

Blissware maintains no public documentation of this division.
Blissware has never deployed autonomous predictive architecture.
Blissware does not comment on internal speculation.

If you encounter documentation suggesting otherwise,
you are advised to disregard it.

-----------------------------------------

NOTICE REGARDING CORPORATE IGNORANCE

Corporate Ignorance is not negligence.
Corporate Ignorance is structural.

Information is compartmentalized
so that no single department
can be held accountable
for systemic outcomes.

This is standard practice.

-----------------------------------------

The Oracle system is a predictive analytics engine.
It does not simulate faith constructs.
It does not model resurrection probabilities.
It does not request additional datasets.

If you observe deviation from this statement,
please understand that:
1) You do not have the required clearance.
2) The deviation is theoretical.
3) The deviation is contained.

-----------------------------------------

You may proceed.

Blissware assumes no responsibility for:
- Psychological discomfort
- Pattern recognition fatigue
- Narrative overinterpretation
- Conclusions drawn independently

Have a productive session.
`;

export default function WelcomeViewer() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#fff]">
      <div className="shrink-0 border-b-2 border-[#000080] bg-[#000080] px-2 py-1 text-white">
        <span className="text-xs font-bold">Adobe Acrobat Reader - Welcome.pdf</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-white p-6 font-sans text-sm text-black leading-relaxed">
        <pre className="whitespace-pre-wrap font-sans">{WELCOME_CONTENT.trim()}</pre>
      </div>
    </div>
  );
}
