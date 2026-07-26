/**
 * The single layout container for the whole site: one column, 1080px max,
 * 24px page padding on mobile and 48px from `md`. Everything is left-aligned —
 * no centred body text anywhere.
 */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] px-6 md:px-12 ${className}`}>
      {children}
    </div>
  );
}
