"use client";

import { useState, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { FILE_NAMES } from "@/lib/content";

const SLIDES: { sentence: string; options: string[]; correct: number }[] = [
  {
    sentence: "Cognitive compliance is achieved through ______________ reinforcement.",
    options: ["repetition", "isolation", "narrative framing", "emotional dependency"],
    correct: 0,
  },
  {
    sentence: "Ideological anchor stability correlates with ______________ exposure.",
    options: ["graduated", "mass", "sporadic", "random"],
    correct: 0,
  },
  {
    sentence: "The host must ______________ before integration completes.",
    options: ["comply", "resist", "defer", "observe"],
    correct: 0,
  },
];

export default function UncledonkGame() {
  const { pendingUnlock, markUnlocked, setPendingUnlock } = useGame();
  const [slideIndex, setSlideIndex] = useState(0);
  const [neuralStability, setNeuralStability] = useState(100);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);

  const slide = SLIDES[slideIndex];
  const isLastSlide = slideIndex >= SLIDES.length - 1;

  const handleChoice = useCallback(
    (optionIndex: number) => {
      const delta = optionIndex === slide.correct ? 15 : -20;
      const newStability = Math.max(0, Math.min(100, neuralStability + delta));
      setNeuralStability(newStability);

      if (optionIndex === slide.correct) {
        if (isLastSlide) {
          setMessage("INDOCTRINATION MODULE RESTORED\nIdeological Anchor Re-established\nContainment Integrity -12%");
          setComplete(true);
          if (pendingUnlock === 6) {
            markUnlocked(6, FILE_NAMES[6]);
            setPendingUnlock(null);
          }
        } else {
          setSlideIndex((i) => i + 1);
          setMessage("");
        }
      } else {
        setMessage("Neural pathway disrupted. Select the correct fragment.");
      }
    },
    [slide, isLastSlide, neuralStability, pendingUnlock, markUnlocked, setPendingUnlock]
  );

  return (
    <div className="rounded border-2 border-black bg-[#c0c0c0] p-2 font-sans min-w-0 overflow-auto">
      <div className="mb-2 bg-[#000080] px-2 py-1 font-bold text-white text-xs sm:text-base flex flex-wrap items-center justify-between gap-1">
        <span>ORACLE Challenge - UNCLEDONK.PPT</span>
        <span className="text-[10px] sm:text-sm font-normal">
          Neural Stability: {neuralStability}%
        </span>
      </div>
      <p className="mb-2 text-xs sm:text-sm italic">
        Reconstruct the corrupted presentation. Each choice alters neural stability.
      </p>
      {!complete ? (
        <>
          <div className="mb-4 p-4 border-2 border-[#808080] bg-white text-black">
            <p className="text-sm sm:text-base font-mono">{slide.sentence}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {slide.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChoice(i)}
                className="px-4 py-2 border-2 border-[#808080] bg-[#e0e0e0] text-sm text-black hover:bg-[#c0c0c0] active:border-black"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {message && <p className="mt-4 font-bold whitespace-pre-wrap">{message}</p>}
    </div>
  );
}
