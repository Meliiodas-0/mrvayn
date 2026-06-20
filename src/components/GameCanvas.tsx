"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Swords, Trophy } from "lucide-react";
import { StickArena } from "@/game/StickArena";

/**
 * Thin React wrapper + HUD for the STICK ARENA game (stickman swordsman).
 * Lazy-loaded (ssr:false). The stickman runs toward the cursor; click/Space
 * swings the sword and cuts down scattered enemies. Pure power-fantasy loop —
 * no death, no abrupt end. Pauses off-screen + on tab hide; input only from the
 * focused canvas, so it never traps page scroll or the keyboard.
 */
export default function GameCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<StickArena | null>(null);

  const [kills, setKills] = useState(0);
  const [best, setBest] = useState(0);
  const [hint, setHint] = useState(true);

  const soundOn = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);

  const beep = useCallback((freq: number, dur: number, type: OscillatorType, gain: number) => {
    if (!soundOn.current || !audioRef.current) return;
    const ac = audioRef.current;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ac.destination);
    const t = ac.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const game = new StickArena(canvas, {
      onScore: (k, b) => { setKills(k); setBest(b); },
      onSfx: (t) => (t === "slash" ? beep(300, 0.07, "square", 0.025) : beep(660, 0.1, "triangle", 0.04)),
    });
    game.setReducedMotion(reduced);
    game.init();
    gameRef.current = game;

    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      lastX = e.clientX - r.left;
      lastY = e.clientY - r.top;
      game.setPointer(lastX, lastY, true);
    };
    const onLeave = () => game.setPointer(lastX, lastY, false);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => game.resize());
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => game.setVisible(e.isIntersecting && !document.hidden),
      { threshold: 0.15 },
    );
    io.observe(wrap);

    const onVis = () => game.setVisible(!document.hidden && isOnScreen(wrap));
    document.addEventListener("visibilitychange", onVis);

    const onPlay = () => canvas.focus();
    window.addEventListener("overdrive:play", onPlay);

    const onSound = (e: Event) => {
      const muted = (e as CustomEvent<{ muted: boolean }>).detail?.muted;
      soundOn.current = muted === false;
      if (soundOn.current) {
        try {
          audioRef.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          audioRef.current.resume?.();
        } catch {
          soundOn.current = false;
        }
      }
    };
    window.addEventListener("overdrive:sound", onSound);

    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("overdrive:play", onPlay);
      window.removeEventListener("overdrive:sound", onSound);
      game.destroy();
      gameRef.current = null;
    };
  }, [beep]);

  const slash = useCallback(() => {
    setHint(false);
    gameRef.current?.attack();
  }, []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // only when canvas focused → no page-scroll trap
      slash();
    }
  }, [slash]);

  return (
    <div ref={wrapRef} className="relative h-full w-full select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={slash}
        onKeyDown={onKey}
        tabIndex={0}
        role="img"
        aria-label="Stick Arena — optional mini-game. Move the cursor to run; click or press Space to swing your sword."
        className="block h-full w-full cursor-crosshair outline-none"
      />

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-widest">
        <span className="flex items-center gap-1.5 text-bone">
          <Swords className="h-3 w-3 text-surge" />
          {kills}
        </span>
        <span className="flex items-center gap-1 text-mist">
          <Trophy className="h-3 w-3 text-surge" />
          {best}
        </span>
      </div>

      {hint && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
          <span className="font-hud text-[0.7rem] uppercase tracking-[0.25em] text-bone/80">Move to run</span>
          <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-widest text-mist/70">click / space to slash</span>
        </div>
      )}
    </div>
  );
}

function isOnScreen(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}
