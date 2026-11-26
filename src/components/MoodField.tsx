"use client";

import { useEffect, useRef } from "react";

// Full-page living background. The cursor leaves moss-like strands that grow
// and fade. How fast you move sets the "mood", which tints the whole page.

export type Mood = "calm" | "curious" | "playful" | "restless";

type Strand = {
  x: number;
  y: number;
  angle: number;
  life: number;
  maxLife: number;
  width: number;
  hue: number;
};

const MOODS: { mood: Mood; maxSpeed: number; hue: number }[] = [
  { mood: "calm", maxSpeed: 4, hue: 150 },
  { mood: "curious", maxSpeed: 12, hue: 190 },
  { mood: "playful", maxSpeed: 28, hue: 280 },
  { mood: "restless", maxSpeed: Infinity, hue: 18 },
];

export default function MoodField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const strands: Strand[] = [];
    let last = { x: -1, y: -1, t: 0 };
    let speed = 0;
    let hue = 150;
    let currentMood: Mood = "calm";
    let raf = 0;
    let idle = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        if (strands.length > 420) strands.shift();
        strands.push({
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          life: 0,
          maxLife: 40 + Math.random() * 80,
          width: 0.6 + Math.random() * 1.8,
          hue: hue + (Math.random() * 30 - 15),
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (last.x >= 0) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        const dt = Math.max(now - last.t, 1);
        const v = (Math.hypot(dx, dy) / dt) * 16; // px per frame
        speed = speed * 0.85 + v * 0.15;
      }
      last = { x: e.clientX, y: e.clientY, t: now };
      idle = 0;
      spawn(e.clientX, e.clientY, speed > 14 ? 3 : 1);
    };

    const onDown = (e: PointerEvent) => spawn(e.clientX, e.clientY, 24);

    const setMood = () => {
      const m = MOODS.find((m) => speed < m.maxSpeed)!;
      hue += (m.hue - hue) * 0.03;
      document.documentElement.style.setProperty("--mood-hue", hue.toFixed(1));
      if (m.mood !== currentMood) {
        currentMood = m.mood;
        window.dispatchEvent(new CustomEvent<Mood>("mood", { detail: m.mood }));
      }
    };

    const tick = () => {
      idle++;
      speed *= 0.97;
      setMood();

      // soft fade instead of clear: leaves trails that dissolve over time
      ctx.fillStyle = "rgba(7, 8, 10, 0.06)";
      ctx.fillRect(0, 0, w, h);

      for (let i = strands.length - 1; i >= 0; i--) {
        const s = strands[i];
        const px = s.x;
        const py = s.y;
        s.angle += (Math.random() - 0.5) * 0.6;
        const step = 0.8 + Math.random() * 1.2;
        s.x += Math.cos(s.angle) * step;
        s.y += Math.sin(s.angle) * step;
        s.life++;
        const t = 1 - s.life / s.maxLife;
        ctx.strokeStyle = `hsla(${s.hue}, 70%, ${55 + t * 15}%, ${t * 0.8})`;
        ctx.lineWidth = s.width * t;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        // occasional branching, like moss
        if (Math.random() < 0.015 && strands.length < 420) {
          strands.push({ ...s, angle: s.angle + (Math.random() > 0.5 ? 0.9 : -0.9), life: s.life + 10 });
        }
        if (s.life >= s.maxLife) strands.splice(i, 1);
      }

      // when no one is touching, the page breathes on its own
      if (idle > 180 && Math.random() < 0.08) {
        spawn(Math.random() * w, Math.random() * h, 1);
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}
