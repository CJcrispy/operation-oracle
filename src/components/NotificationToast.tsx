"use client";

import { useGame } from "@/context/GameContext";

export default function NotificationToast() {
  const { notifications, dismissNotification } = useGame();
  if (notifications.length === 0) return null;
  return (
    <div className="fixed bottom-14 right-4 z-[90] flex flex-col gap-2">
      {notifications.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => dismissNotification(n.id)}
          className="rounded border-2 border-[#808080] bg-[#c0c0c0] px-3 py-2 text-left text-sm font-sans text-black shadow-lg hover:bg-[#d0d0d0]"
        >
          {n.message}
        </button>
      ))}
    </div>
  );
}
