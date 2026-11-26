"use client";

import { useEffect, useRef } from "react";

// The name is made of particles. Your cursor scatters them; they gather back.

type P = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };

export default function GatherName({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // draw the text off-screen and sample its pixels
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const family =
        getComputedStyle(document.documentElement).getPropertyValue("--font-serif").trim() || "Georgia, serif";
      let size = Math.min(h * 0.8, (w / Math.max(text.length, 1)) * 1.7);
      o.font = `400 ${size}px ${family}`;
      while (o.measureText(text).width > w * 0.94 && size > 10) {
        size -= 2;
        o.font = `400 ${size}px ${family}`;
      }
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(text, w / 2, h / 2);
      const data = o.getImageData(0, 0, w, h).data;
      const gap = w < 600 ? 3 : 4;
      const next: P[] = [];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            const old = particles[next.length];
            next.push({
              x: old ? old.x : Math.random() * w,
              y: old ? old.y : Math.random() * h,
              hx: x,
              hy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      particles = next;
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const hue = getComputedStyle(document.documentElement).getPropertyValue("--mood-hue") || "150";
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 6400) {
          const f = (6400 - d2) / 6400;
          p.vx += (dx / Math.sqrt(d2 + 0.01)) * f * 4;
          p.vy += (dy / Math.sqrt(d2 + 0.01)) * f * 4;
        }
        p.vx += (p.hx - p.x) * 0.04;
        p.vy += (p.hy - p.y) * 0.04;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
        const off = Math.min(Math.hypot(p.x - p.hx, p.y - p.hy) / 40, 1);
        ctx.fillStyle = off > 0.05 ? `hsl(${hue} 80% ${70 - off * 15}%)` : "#f4f1ea";
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    document.fonts.ready.then(build);
    build();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <canvas ref={ref} role="img" aria-label={text} className="h-[34vh] min-h-[180px] w-full touch-none" />
  );
}
