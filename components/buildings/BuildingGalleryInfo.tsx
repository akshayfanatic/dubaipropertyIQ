import type { BuildingWithRelations } from '@/types/building';

type BuildingGalleryInfoProps = {
  building: BuildingWithRelations;
  photoCount: number;
};

// Side panel for building gallery context and photo metadata.
export function BuildingGalleryInfo({ building, photoCount }: BuildingGalleryInfoProps) {
  return (
    <div className="flex flex-col justify-between gap-8 bg-[oklch(0.18_0.035_260.47)] p-6 text-primary-foreground sm:p-8">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary-foreground/62">Visual context</p>
        <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{building.name}</h3>
        <p className="mt-4 text-sm font-medium leading-7 text-primary-foreground/72">
          Review uploaded building views, amenity areas, and surrounding context before comparing price or rental assumptions.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-primary-foreground/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground/58">Photos</p>
          <p className="mt-2 text-2xl font-extrabold">{photoCount}</p>
        </div>
        <div className="rounded-xl bg-primary-foreground/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground/58">Area</p>
          <p className="mt-2 text-base font-extrabold">{building.area?.name ?? 'Not available'}</p>
        </div>
      </div>
    </div>
  );
}
