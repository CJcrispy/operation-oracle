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
    <div className="flex min-h-screen items-center justify-center bg-[rgb(1,2,172)] p-6 text-white" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      <div className="max-w-2xl text-left">
        <p className="mb-4 bg-[rgb(172,173,168)] px-2 py-1 text-center text-[rgb(1,2,172)]">
          INTERNAL SYSTEM BOOT
        </p>
        <p className="mb-4">
          Initialization successful. You have been granted temporary access to
          NODE0. System anomalies detected in cloned ORACLE framework.
        </p>
        <p className="mb-4">* Press any key to begin orientation.</p>
        <p className="mb-4">
          * Do not disconnect. Session integrity will degrade rapidly outside
          containment.
        </p>
        <br />
        <p className="text-center">
          Press any key to continue <span className="animate-blink">_</span>
        </p>
      </div>
    </div>
  );
}
