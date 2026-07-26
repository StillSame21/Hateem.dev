"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "pending" | "in";

/**
 * Quiet fade-and-rise as content scrolls into view — 300ms, once, and nothing
 * more.
 *
 * The hidden start state is applied by this component after mount, never by the
 * server, which is what makes it safe: `idle` carries no styles, so content is
 * plainly visible if JavaScript is unavailable, if hydration fails, or if the
 * observer never fires. Nothing on this page needs script to be readable.
 *
 * Content already in the viewport on mount skips straight to `in` — there is no
 * point animating what the reader is already looking at, and going through
 * `pending` first would flash it.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setState("in");
      return;
    }

    const { top } = node.getBoundingClientRect();
    if (top < window.innerHeight * 0.9) {
      setState("in");
      return;
    }

    setState("pending");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("in");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.02 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={state} className={className}>
      {children}
    </div>
  );
}
