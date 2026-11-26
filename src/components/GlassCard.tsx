"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

// Liquid-glass panel: frosted, gently refracting, with a highlight and tilt
// that follow the pointer.

export default function GlassCard({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const inner = (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`glass glass-liquid group relative overflow-hidden rounded-3xl p-6 transition-transform duration-300 ease-out ${className}`}
    >
      <div className="glass-shine pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} className="block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      {inner}
    </a>
  ) : (
    inner
  );
}
