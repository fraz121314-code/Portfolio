"use client";

import { useEffect, useRef, useState } from "react";

// Draw anything. When you let go, your scribble is redrawn as a single
// continuous plotter-style line, like a pen that never lifts.

type Pt = { x: number; y: number };

export default function LineSketch() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Pt[]>([]);
  const drawing = useRef(false);
  const anim = useRef(0);
  const [hint, setHint] = useState("Draw how you feel today");

  const size = () => {
    const c = ref.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    size();
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("resize", size);
      cancelAnimationFrame(anim.current);
    };
  }, []);

  const pos = (e: React.PointerEvent): Pt => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const ink = () => `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--mood-hue") || 150} 80% 65%)`;

  const down = (e: React.PointerEvent) => {
    cancelAnimationFrame(anim.current);
    ref.current!.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = pos(e);
    if (pts.current.length === 0) {
      const c = ref.current!;
      c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    }
    pts.current.push(p);
    setHint("Keep going…");
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = ref.current!.getContext("2d")!;
    const p = pos(e);
    const prev = pts.current[pts.current.length - 1];
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    pts.current.push(p);
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (pts.current.length < 8) return;
    replot();
  };

  const replot = () => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect();
    // build one continuous wavy line that traces the drawing
    const src = pts.current;
    const line: Pt[] = [];
    for (let i = 0; i < src.length - 1; i++) {
      const a = src[i];
      const b = src[i + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 3));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const k = line.length * 0.35;
        line.push({
          x: a.x + (b.x - a.x) * t + Math.sin(k) * 4,
          y: a.y + (b.y - a.y) * t + Math.cos(k * 1.3) * 4,
        });
      }
    }
    let i = 0;
    const color = ink();
    setHint("Redrawn in one unbroken line. Click to start again.");
    const step = () => {
      if (i === 0) ctx.clearRect(0, 0, r.width, r.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      const from = Math.max(i - 1, 0);
      const to = Math.min(i + 18, line.length - 1);
      ctx.moveTo(line[from].x, line[from].y);
      for (let j = from + 1; j <= to; j++) ctx.lineTo(line[j].x, line[j].y);
      ctx.stroke();
      i = to;
      if (i < line.length - 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
    pts.current = [];
  };

  return (
    <div className="relative">
      <canvas
        ref={ref}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        aria-label="Drawing pad: draw with your mouse or finger"
        className="h-72 w-full cursor-crosshair touch-none rounded-2xl sm:h-96"
      />
      <p className="pointer-events-none absolute bottom-3 left-4 text-sm text-white/60">{hint}</p>
    </div>
  );
}
