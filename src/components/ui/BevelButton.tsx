import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

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

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden bevel-sm px-6 py-3 font-hud text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary: "bg-surge text-void hover:bg-surge",
  ghost: "border border-bone/25 bg-transparent text-bone hover:text-surge hover:border-surge/60",
};

/** Hover decoration: corner brackets snap in + an accent fill sweep (CSS only). */
function Decoration({ variant }: { variant: Variant }) {
  return (
    <>
      {variant === "ghost" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-surge/10 transition-transform duration-300 ease-out group-hover:translate-x-0 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      )}
      <span aria-hidden className="pointer-events-none absolute left-1 top-1 h-2 w-2 border-l border-t border-current opacity-0 transition-opacity duration-200 group-hover:opacity-70" />
      <span aria-hidden className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r border-current opacity-0 transition-opacity duration-200 group-hover:opacity-70" />
    </>
  );
}

export function BevelButton(props: BevelButtonProps) {
  const { variant = "primary", className, children } = props;

  if ("href" in props && props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    return (
      <a href={href} className={cn(base, variants[variant], className)} {...rest}>
        <Decoration variant={variant} />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </a>
    );
  }

  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props as ButtonProps;
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Decoration variant={variant} />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
