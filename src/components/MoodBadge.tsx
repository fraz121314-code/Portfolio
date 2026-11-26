"use client";

import { useEffect, useState } from "react";
import type { Mood } from "./MoodField";

const LINES: Record<Mood, string> = {
  calm: "You seem calm. The page grows slowly with you.",
  curious: "Curious? Keep exploring.",
  playful: "Feeling playful. The colours follow you.",
  restless: "Restless energy! Try slowing down.",
};

export default function MoodBadge() {
  const [mood, setMood] = useState<Mood>("calm");

  useEffect(() => {
    const on = (e: Event) => setMood((e as CustomEvent<Mood>).detail);
    window.addEventListener("mood", on);
    return () => window.removeEventListener("mood", on);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="glass fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 text-xs text-white/80 sm:bottom-6 sm:left-6 sm:translate-x-0"
    >
      <span
        className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
        style={{ background: "hsl(var(--mood-hue) 80% 60%)" }}
      />
      <span className="font-medium uppercase tracking-widest text-white">{mood}</span>
      <span className="ml-2 hidden sm:inline">{LINES[mood]}</span>
    </div>
  );
}
