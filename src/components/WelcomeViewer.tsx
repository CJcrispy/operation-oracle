"use client";

const WELCOME_CONTENT = `
Welcome to Operation Oracle – Part 1

You are an intern at Blissware, tasked with investigating a fragmented AI system known as Oracle.

The Oracle is locked behind 7 sealed files. Unlocking each file weakens containment and strengthens Oracle.

GETTING STARTED
• Open UNLOCKER.sys from the desktop
• Type 'help' to see available commands
• Use 'unlock 1' to begin decrypting the first file
• Decrypted files can be viewed in the Source Viewer or Documents

IMPORTANT
• This is a contained narrative experience
• No real-world puzzle solving is required
• Everything you need is within the system

Good luck, intern.
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
