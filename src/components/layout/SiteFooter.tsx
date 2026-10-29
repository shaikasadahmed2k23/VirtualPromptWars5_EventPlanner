import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Monogram } from '@/components/decor/Monogram';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

const FOOTER_LINKS = [
  { label: 'Plan an event', to: paths.newEvent() },
  { label: 'Vendors', to: paths.vendors() },
  { label: 'Settings', to: paths.settings() },
] as const;

/** Site footer with brand, quick links and data notice. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ivory-deep/60 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Monogram />
            <span className="font-serif text-2xl font-semibold">{APP_NAME}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">
            {APP_TAGLINE}. Your plans stay private in this browser; AI requests go through our secure server and nothing
            is stored there.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-charcoal underline-offset-4 hover:text-rose-ink hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line/70 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {APP_NAME}. Built for PromptWars with Google Gemini.
      </p>
    </footer>
  );
}
