import { PageHeader } from '@/components/ui/headings';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** Vendors page. */
export default function VendorsPage() {
  useDocumentTitle('Vendors');
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Directory"
        title="Vendors"
        description="Venues, photographers, caterers, decorators and entertainers."
      />
    </div>
  );
}
