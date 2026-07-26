/**
 * Mono text link with a 44x44 minimum hit area.
 *
 * The underline sits on an inner span so the rule hugs the word while the
 * link's box stays thumb-sized — short labels like "Email" are only ~39px of
 * text, which is under the tap-target floor on their own.
 */
export function MonoLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`mono inline-flex h-11 min-w-11 items-center text-[13px] text-ink ${className}`}
    >
      <span className="underline decoration-rule decoration-1 underline-offset-4 transition-colors group-hover:decoration-ink hover:decoration-ink">
        {children}
      </span>
    </a>
  );
}
