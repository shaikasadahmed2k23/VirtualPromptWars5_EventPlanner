import { CalendarHeartIcon, SparkIcon, StoryIcon } from '@/components/decor/StepIcons';
import { HOW_IT_WORKS } from '../content';
import { EditorialHeading } from './EditorialHeading';

const STEP_ICONS = [StoryIcon, SparkIcon, CalendarHeartIcon] as const;

/** Three numbered steps from first answer to finished plan. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="border-y border-line bg-ivory-deep/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.6fr] lg:px-8">
        <EditorialHeading
          id="how-title"
          eyebrow="How it works"
          title="From first idea to final toast"
          align="left"
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {HOW_IT_WORKS.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? SparkIcon;
            return (
              <li key={step.title} className="relative">
                <span className="font-serif text-6xl font-semibold text-blush" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="-mt-6 ml-10">
                  <Icon />
                </div>
                <h3 className="mt-4 text-2xl">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
