"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

/** Magnetic pull (Skiper/Vengeance mouse-effect pattern): the button drifts up to
 *  6px toward the cursor and snaps back on leave. Pure transforms, reduced-motion safe. */
function useMagnet() {
  const ref = useRef<HTMLElement | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate(${(dx * 6).toFixed(1)}px, ${(dy * 5).toFixed(1)}px)`;
  };
  const onLeave = () => { const el = ref.current; if (el) el.style.transform = ""; };
  return { ref, onMove, onLeave };
}

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };
type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };

type BevelButtonProps = ButtonProps | AnchorProps;

// v3 buttons: mono 13px uppercase, radius 0 with ONE 45-degree notch (bevel-sm).
// Primary: solid --red, white, hover #FF2140 + 1px lift. Secondary: line-2 hairline.
const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden bevel-sm px-6 py-3 font-hud text-[13px] uppercase transition-[background-color,border-color,color,transform] duration-200 ease-snap focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary: "bg-ion text-white hover:bg-[#FF2140] hover:-translate-y-px",
  ghost: "border border-line2 bg-white/45 text-bone hover:border-surge",
};

/** Hover decoration: corner brackets snap in + an accent fill sweep (CSS only). */
function Decoration({ variant }: { variant: Variant }) {
  return (
    <>
      {variant === "ghost" && <span aria-hidden className="hidden" />}
    </>
  );
}

export function BevelButton(props: BevelButtonProps) {
  const { variant = "primary", className, children } = props;

  const magnet = useMagnet();
  const magnetProps = {
    onPointerMove: magnet.onMove,
    onPointerLeave: magnet.onLeave,
    style: { transition: "transform 0.25s var(--ease-snap)" } as React.CSSProperties,
  };

  if ("href" in props && props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    return (
      <a
        href={href}
        ref={(el) => { magnet.ref.current = el; }}
        className={cn(base, variants[variant], className)}
        {...magnetProps}
        {...rest}
      >
        <Decoration variant={variant} />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </a>
    );
  }

  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props as ButtonProps;
  return (
    <button
      ref={(el) => { magnet.ref.current = el; }}
      className={cn(base, variants[variant], className)}
      {...magnetProps}
      {...rest}
    >
      <Decoration variant={variant} />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
