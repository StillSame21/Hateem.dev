"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

type Status = "idle" | "copied" | "failed";

/**
 * Email affordance that copies the address instead of linking `mailto:`.
 *
 * `mailto:` only works for visitors with an OS-level mail client registered —
 * everyone on webmail (Gmail in a browser, no desktop client) gets bounced to
 * whatever the browser treats as its fallback handler. Copying to the
 * clipboard works regardless of what mail setup the visitor has.
 *
 * Mirrors the status-as-visible-text idiom from `ContactForm.tsx`: state is
 * never colour-alone, and the live region announces it for screen readers.
 */
export function CopyEmail({
  label = SITE.email,
  className = "",
  innerClassName,
}: {
  label?: React.ReactNode;
  className?: string;
  /** Optional wrapper span for callers that underline an inner span rather
   *  than the button itself (see `MonoLink.tsx`'s hit-area comment). Left
   *  unset, the label renders directly in the button. */
  innerClassName?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function onClick() {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(SITE.email);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  }

  const content = status === "copied" ? "Copied" : label;

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={onClick}
        aria-label="Copy email address"
        className={`cursor-pointer appearance-none border-0 bg-transparent p-0 text-left ${className}`}
      >
        {innerClassName ? <span className={innerClassName}>{content}</span> : content}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Email address copied" : ""}
        {status === "failed" ? `Could not copy. Address is ${SITE.email}` : ""}
      </span>

      {status === "failed" ? (
        <span className="mono mt-1 text-[12px] text-ink-muted select-all">
          Copy failed — {SITE.email}
        </span>
      ) : null}
    </span>
  );
}
