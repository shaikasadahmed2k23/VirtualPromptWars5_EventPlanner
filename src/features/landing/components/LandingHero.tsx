import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { FloralSprig } from '@/components/decor/FloralSprig';
import { Button } from '@/components/ui/button';
import { Photo } from '@/components/ui/photo';
import { PHOTOS } from '@/data/photos';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { HERO_COPY } from '../content';
import { DemoPreviewCard } from './DemoPreviewCard';

const HERO_ASPECT = 16 / 10;
const HERO_WIDTH = 1600;

/** Editorial hero: full-bleed photograph fading into ivory behind the headline. */
export function LandingHero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="relative h-72 sm:h-[26rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[64%]">
        <Photo
          photo={PHOTOS.ceremonyAisle}
          aspect={HERO_ASPECT}
          width={HERO_WIDTH}
          sizes="(min-width: 1024px) 64vw, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/10 to-transparent lg:bg-linear-to-r lg:from-ivory lg:from-10% lg:via-ivory/70 lg:via-30% lg:to-transparent lg:to-70%" />
      </div>
      <FloralSprig className="absolute -left-12 top-6 -z-10 size-64 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:py-36">
        <div className="-mt-20 max-w-xl animate-fade-up lg:mt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-ink">{HERO_COPY.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-5xl leading-[0.98] sm:text-7xl">
            Your Celebration, <em className="text-gradient-rose font-medium">Beautifully</em> Planned
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{HERO_COPY.subhead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to={paths.newEvent()}>
                Plan My Event
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to={paths.event(DEMO_EVENT_ID)}>
                <Heart aria-hidden="true" />
                View Demo Wedding
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DemoPreviewCard className="absolute bottom-12 right-10 hidden w-72 xl:block" />
    </section>
  );
}
