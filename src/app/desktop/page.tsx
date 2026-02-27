import Desktop from "@/components/Desktop";
import { GameProvider } from "@/context/GameContext";

export default function DesktopPage() {
  return (
    <GameProvider>
      <Desktop />
    </GameProvider>
  );
}
