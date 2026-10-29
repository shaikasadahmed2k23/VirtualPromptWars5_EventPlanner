import { FloralSprig } from '@/components/decor/FloralSprig';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_TESTIMONIAL } from '../content';

/** Editorial pull-quote, clearly labelled as an illustrative sample. */
export function SampleTestimonial() {
  return (
    <section aria-label="Sample testimonial" className="relative overflow-hidden bg-lavender-soft/60 py-24">
      <FloralSprig className="absolute -right-10 bottom-0 size-60 rotate-180 opacity-50" />
      <figure className="relative mx-auto max-w-3xl px-6 text-center">
        <Badge tone="lavender">Sample testimonial: illustrative only</Badge>
        <blockquote className="mt-8">
          <p className="font-serif text-3xl font-medium italic leading-snug text-charcoal sm:text-4xl">
            <span aria-hidden="true" className="text-rose">
              “
            </span>
            {SAMPLE_TESTIMONIAL.quote}
            <span aria-hidden="true" className="text-rose">
              ”
            </span>
          </p>
        </blockquote>
        <figcaption className="mt-6 text-sm uppercase tracking-[0.2em] text-lavender-ink">
          {SAMPLE_TESTIMONIAL.attribution}
        </figcaption>
      </figure>
    </section>
  );
}
