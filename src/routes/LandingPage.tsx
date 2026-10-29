import { ClosingCta } from '@/features/landing/components/ClosingCta';
import { EventTypeShowcase } from '@/features/landing/components/EventTypeShowcase';
import { FeatureHighlights } from '@/features/landing/components/FeatureHighlights';
import { HowItWorks } from '@/features/landing/components/HowItWorks';
import { LandingHero } from '@/features/landing/components/LandingHero';
import { SampleTestimonial } from '@/features/landing/components/SampleTestimonial';
import { APP_TAGLINE } from '@/lib/constants';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** `/`: editorial landing page. */
export default function LandingPage() {
  useDocumentTitle(APP_TAGLINE);
  return (
    <>
      <LandingHero />
      <EventTypeShowcase />
      <HowItWorks />
      <FeatureHighlights />
      <SampleTestimonial />
      <ClosingCta />
    </>
  );
}
