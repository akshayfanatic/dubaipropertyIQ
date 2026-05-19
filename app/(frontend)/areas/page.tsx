import PageLayout from '@/components/layout/PageLayout';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SelectField } from '@/components/shared/select-field';

const areaOptions = [
  { label: 'Downtown Dubai', value: 'downtown-dubai' },
  { label: 'Dubai Marina', value: 'dubai-marina' },
  { label: 'Business Bay', value: 'business-bay' },
  { label: 'Palm Jumeirah', value: 'palm-jumeirah' },
];

const AreaProperty = () => {
  return (
    <PageLayout contentFullWidth className="">
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop"
        alt="Dubai area skyline"
        heightClassName="min-h-[560px]"
        overlayClassName="bg-black/45"
        contentClassName="container mx-auto flex min-h-[560px] flex-col px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="[&_a]:text-white/80 [&_a:hover]:text-white [&_button]:text-white/80 [&_button:hover]:text-white **:data-[slot=breadcrumb-page]:text-white">
          <PublicBreadCrumb />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl rounded-lg border border-white/20 bg-background p-4 shadow-sm">
            <SelectField options={areaOptions} placeholder="Select an area" className="h-12 bg-background" />
          </div>
        </div>
      </PageBanner>
    </PageLayout>
  );
};

export default AreaProperty;
