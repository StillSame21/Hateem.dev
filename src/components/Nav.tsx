"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#background", label: "Background" },
  { href: "#contact", label: "Contact" },
];

/**
 * Sticky 56px nav. On mobile only the Résumé button survives — the page is
 * six sections and scrolling beats a drawer, so there is deliberately no
 * hamburger menu.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 h-14 border-b border-rule ${
        scrolled ? "bg-paper/80 backdrop-blur-md" : "bg-paper"
      }`}
    >
      <Container className="flex h-14 items-center justify-between gap-4">
        <a
          href="#main"
          className="mono inline-flex h-11 items-center text-[13px] text-ink"
        >
          hateem.dev
        </a>

        <nav aria-label="Sections" className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="mono inline-flex h-11 items-center px-3 text-[13px] text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={SITE.resume}
            className="mono inline-flex h-11 items-center border border-ink px-4 text-[12px] text-ink transition-colors hover:bg-ink hover:text-paper md:text-[13px]"
          >
            Résumé
          </a>
        </nav>
      </Container>
    </header>
  );
}
