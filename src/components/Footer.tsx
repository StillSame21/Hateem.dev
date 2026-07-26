import { Container } from "@/components/Container";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-[72px] border-t border-rule py-8 md:mt-[140px]">
      {/* One mono line. The repo link is its own flex item rather than an inline
          anchor so it can carry a 44px hit area without stretching the text. */}
      <Container className="flex flex-wrap items-center gap-x-2">
        <p className="mono text-[12px] text-ink-muted md:text-[13px]">
          {SITE.fullName} · {new Date().getFullYear()} ·
        </p>
        <a
          href={SITE.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex h-11 min-w-11 items-center text-[12px] text-ink-muted md:text-[13px]"
        >
          <span className="underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:decoration-ink-muted">
            source on GitHub
          </span>
        </a>
      </Container>
    </footer>
  );
}
