import { Photo } from '@/components/ui/photo';
import { ASPECT } from '@/lib/constants';
import { PHOTOS } from '@/data/photos';
import { FEATURES } from '../content';
import { EditorialHeading } from './EditorialHeading';

/** Asymmetric photo collage beside the six product capabilities. */
export function FeatureHighlights() {
  return (
    <section aria-labelledby="features-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.25fr]">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
            <Photo
              photo={PHOTOS.floralTable}
              aspect={ASPECT.portrait}
              width={800}
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 w-2/5 overflow-hidden rounded-2xl border-4 border-ivory shadow-lift sm:-right-8">
            <div className="aspect-square">
              <Photo photo={PHOTOS.lushBouquet} aspect={ASPECT.square} width={480} sizes="18vw" />
            </div>
          </div>
        </div>

        <div>
          <EditorialHeading
            id="features-title"
            eyebrow="Everything in one place"
            title="Thoughtful tools for every detail"
            align="left"
          />
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/60 bg-gold-soft text-gold-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
