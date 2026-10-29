import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { ConfettiScatter } from '@/components/decor/ConfettiScatter';
import { Button } from '@/components/ui/button';
import { CLOSING_CTA } from '../content';

/** Final call-to-action band before the footer. */
export function ClosingCta() {
  const Icon = CLOSING_CTA.icon;
  return (
    <section aria-labelledby="cta-title" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-rose-deep px-6 py-16 text-center text-white sm:px-12">
        <ConfettiScatter className="absolute inset-x-0 top-4 mx-auto h-20 w-full max-w-xl opacity-60" />
        <Icon className="mx-auto size-10 text-gold-soft" aria-hidden="true" />
        <h2 id="cta-title" className="mt-4 text-4xl text-white sm:text-5xl">
          {CLOSING_CTA.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white">{CLOSING_CTA.body}</p>
        <Button asChild size="lg" variant="secondary" className="mt-9">
          <Link to={paths.newEvent()}>
            Plan My Event
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
