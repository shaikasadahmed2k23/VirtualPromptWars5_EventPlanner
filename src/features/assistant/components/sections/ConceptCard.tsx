import type { AIPlan } from '@shared/ai';
import { FloralSprig } from '@/components/decor/FloralSprig';
import { RibbonDivider } from '@/components/decor/RibbonDivider';
import { Card } from '@/components/ui/card';

/** Hero card presenting the plan's concept, tagline and highlights. */
export function ConceptCard({ concept }: { concept: AIPlan['concept'] }) {
  return (
    <Card className="relative overflow-hidden bg-linear-to-br from-surface via-surface to-blush-soft p-6 sm:p-10">
      <FloralSprig className="absolute -right-6 -top-6 size-44 opacity-50" />
      <section aria-labelledby="concept-title" className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-ink">The concept</p>
        <h2 id="concept-title" className="mt-3 text-4xl leading-tight sm:text-5xl">
          {concept.title}
        </h2>
        <p className="mt-3 font-serif text-xl italic text-rose-deep">{concept.tagline}</p>
        <RibbonDivider className="my-6 justify-start" />
        <p className="leading-relaxed text-charcoal">{concept.summary}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {concept.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2 text-sm">
              <span className="text-gold-ink" aria-hidden="true">
                ✦
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}
