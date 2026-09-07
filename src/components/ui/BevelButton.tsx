"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

/** Magnetic pull: the button drifts up to 6px toward the cursor and snaps back on
 *  leave. Pure transforms, reduced-motion safe. */
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

// The one button: mono 13px uppercase, 4px radius. Primary = solid --ion, white text,
// ion-hover fill + 1px lift; ghost = line-2 hairline on a light pane (near-solid on
// phones so ROG never reads through it). Keyboard focus keeps the global ring; the
// solid fill switches it to ink.
const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded px-6 py-3 font-mono text-meta uppercase transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-snap";

const variants: Record<Variant, string> = {
  primary: "bg-ion text-white shadow-[0_10px_30px_rgb(var(--ion)/0.16)] hover:bg-ionHover hover:-translate-y-px hover:shadow-[0_14px_38px_rgb(var(--ion)/0.25)] focus-visible:outline-bone",
  ghost: "border border-line2 bg-carbon/80 text-bone hover:border-surge hover:bg-bg3",
};

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
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
