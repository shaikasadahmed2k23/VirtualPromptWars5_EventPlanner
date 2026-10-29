/** First focusable element: lets keyboard users jump past the header. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-rose-ink px-5 py-2.5 font-medium text-white shadow-lift focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
