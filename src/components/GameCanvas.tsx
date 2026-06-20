"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Crosshair, RotateCcw, Trophy } from "lucide-react";
import { Overdrive, type GameState } from "@/game/Overdrive";

/**
 * Thin React wrapper + HUD for the OVERDRIVE engine (GAME_SPEC §D).
 * Lazy-loaded (ssr:false) so it never blocks first paint / LCP. Pauses when
 * off-screen (IntersectionObserver) and when the tab is hidden. Input only
 * fires from the canvas itself (pointer / Space-when-focused) — never traps
 * page scroll or keyboard.
 */
export default function GameCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Overdrive | null>(null);

  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // SFX — off by default, enabled via the Nav sound toggle (a user gesture).
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
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    const game = new Overdrive(canvas, {
      onState: setState,
      onScore: (s, c) => { setScore(s); setCombo(c); },
      onBest: setBest,
      onMilestone: (label) => {
        setToast(label);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => setToast(null), 1400);
      },
      onSfx: (t) => {
        if (t === "jump") beep(420, 0.08, "square", 0.03);
        else if (t === "shard") beep(880, 0.09, "triangle", 0.04);
        else beep(120, 0.28, "sawtooth", 0.05);
      },
    });
    game.setReducedMotion(reduced);
    game.init();
    gameRef.current = game;

    const ro = new ResizeObserver(() => game.resize());
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => game.setVisible(e.isIntersecting && !document.hidden),
      { threshold: 0.15 },
    );
    io.observe(wrap);

    const onVis = () => game.setVisible(!document.hidden && isOnScreen(wrap));
    document.addEventListener("visibilitychange", onVis);

    const onPlay = () => {
      wrap.querySelector("canvas")?.focus();
      game.action();
    };
    window.addEventListener("overdrive:play", onPlay);

    // Sound toggle (from Nav). Lazily create + resume the AudioContext while
    // inside the toggle's user gesture so playback is allowed.
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
      clearTimeout(toastTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("overdrive:play", onPlay);
      window.removeEventListener("overdrive:sound", onSound);
      game.destroy();
      gameRef.current = null;
    };
  }, [beep]);

  const act = useCallback(() => gameRef.current?.action(), []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp") {
      e.preventDefault(); // only fires when the canvas is focused → no page-scroll trap
      gameRef.current?.action();
    } else if (e.key === "Escape") {
      gameRef.current?.pause();
    }
  }, []);

  const playing = state === "playing";

  return (
    <div ref={wrapRef} className="relative h-full w-full select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={act}
        onKeyDown={onKey}
        tabIndex={0}
        role="img"
        aria-label="OVERDRIVE — optional mini-game. Press Space or tap to dash."
        className="block h-full w-full cursor-pointer outline-none"
      />

      {/* HUD */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-widest">
        <span className="text-bone">
          <span className="text-mist">SCORE </span>
          {score.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 text-mist">
          <Trophy className="h-3 w-3 text-surge" />
          {best.toLocaleString()}
        </span>
        {combo > 1 && <span className="text-volt">x{combo}</span>}
      </div>

      {/* milestone toast (non-gating) */}
      {toast && (
        <div className="pointer-events-none absolute right-3 top-3 bg-surge/15 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-surge bevel-sm">
          {toast}
        </div>
      )}

      {/* exit hint while playing */}
      {playing && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-widest text-mist/60">
          Space / tap to dash · Esc to pause
        </div>
      )}

      {/* overlays */}
      {state !== "playing" && (
        <Overlay state={state} score={score} best={best} onAction={act} />
      )}
    </div>
  );
}

function Overlay({ state, score, best, onAction }: { state: GameState; score: number; best: number; onAction: () => void }) {
  return (
    <button
      onClick={onAction}
      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-void/45 text-center backdrop-blur-[1px]"
      aria-label={state === "dead" ? "Retry" : "Start OVERDRIVE"}
    >
      {state === "dead" ? (
        <>
          <span className="font-hud text-xs uppercase tracking-[0.3em] text-surge">Run ended</span>
          <span className="font-display text-3xl font-black uppercase text-bone">{score.toLocaleString()}</span>
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-mist">Best {best.toLocaleString()}</span>
          <span className="mt-1 inline-flex items-center gap-2 border border-bone/25 px-4 py-2 font-hud text-xs uppercase tracking-[0.16em] text-bone bevel-sm">
            <RotateCcw className="h-3.5 w-3.5" /> Retry
          </span>
        </>
      ) : state === "paused" ? (
        <>
          <span className="font-hud text-xs uppercase tracking-[0.3em] text-mist">Paused</span>
          <span className="font-display text-xl font-black uppercase text-bone">Resume</span>
        </>
      ) : (
        <>
          <span className="font-hud text-xs uppercase tracking-[0.3em] text-surge">Press start</span>
          <span className="font-display text-2xl font-black uppercase text-bone">OVERDRIVE</span>
          <span className="mt-1 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-mist">
            <Crosshair className="h-3.5 w-3.5 text-surge" /> click / space to dash
          </span>
        </>
      )}
    </button>
  );
}

function isOnScreen(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}
