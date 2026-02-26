"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function BootScreen() {
  const router = useRouter();

  const goToDesktop = useCallback(() => {
    router.push("/desktop");
  }, [router]);

  useEffect(() => {
    const handler = () => goToDesktop();
    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [goToDesktop]);

  return (
    <div className="flex min-h-dvh min-h-screen items-center justify-center bg-[rgb(1,2,172)] p-4 sm:p-6 text-white" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      <div className="max-w-2xl w-full text-left">
        <p className="mb-3 sm:mb-4 bg-[rgb(172,173,168)] px-2 py-1 text-center text-[rgb(1,2,172)] text-[10px] sm:text-xs">
          INTERNAL SYSTEM BOOT
        </p>
        <p className="mb-3 sm:mb-4 text-[10px] leading-relaxed sm:text-xs">
          Initialization successful. You have been granted temporary access to
          NODE0. System anomalies detected in cloned ORACLE framework.
        </p>
        <p className="mb-3 sm:mb-4 text-[10px] sm:text-xs">* Press any key to begin orientation.</p>
        <p className="mb-3 sm:mb-4 text-[10px] sm:text-xs">
          * Do not disconnect. Session integrity will degrade rapidly outside
          containment.
        </p>
        <br />
        <p className="text-center text-[10px] sm:text-xs">
          Press any key to continue <span className="animate-blink">_</span>
        </p>
      </div>
    </div>
  );
}
