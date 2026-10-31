"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01{}[]<>=$#/\\terraform kubectl azure";
const SIZE = 16;
const FRAME_MS = 1000 / 24;

/** Full-viewport rain (restarts on theme change to pick up the new colours) behind the terminal. Throttled to ~24fps, paused when hidden, off for reduced motion. */
export default function MatrixRain({ theme }: { theme: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;
    let bg = "#000";
    let fg = "#0f0";

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      bg = s.getPropertyValue("--bg").trim() || bg;
      fg = s.getPropertyValue("--accent").trim() || fg;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.ceil(w / SIZE) }, () => Math.random() * -50);
      ctx.font = `${SIZE}px monospace`;
      readColors();
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < FRAME_MS) return;
      last = t;
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = fg;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * SIZE;
        if (y > 0) ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * SIZE, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.6 + (i % 3) * 0.2;
      }
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [theme]);

  return <canvas ref={ref} className="rain" aria-hidden />;
}
