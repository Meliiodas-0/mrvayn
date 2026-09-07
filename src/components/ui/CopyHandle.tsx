"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A contact handle with no URL (Discord): tap copies it. The handle text is always
 *  rendered (never swapped for "Copied"), so it stays readable and long-press
 *  selectable if JS never runs; only the icon changes. */
export function CopyHandle({ label, handle }: { label: string; handle: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the text stays selectable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label} handle ${handle}`}
      className="group flex w-full min-w-0 items-center justify-between gap-3 rounded border border-steel bg-white/40 px-3 py-2.5 text-left transition-colors hover:border-surge/50"
    >
      <span className="shrink-0 font-mono text-xs uppercase text-bone">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="select-all truncate font-mono text-xs text-surge">{handle}</span>
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-surge" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0 text-mist transition-colors group-hover:text-surge" />
        )}
      </span>
      <span role="status" aria-live="polite" className="sr-only">{copied ? "Copied" : ""}</span>
    </button>
  );
}
