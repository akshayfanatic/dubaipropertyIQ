import type { BuildingWithRelations } from '@/types/building';

type BuildingLocationInfoProps = {
  building: BuildingWithRelations;
};

// Side panel for building map context, address, area, and coordinates.
export function BuildingLocationInfo({ building }: BuildingLocationInfoProps) {
  if (!building.location) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Map context</p>
        <h3 className="mt-3 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">{building.name}</h3>
        <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
          {building.address || `Located in ${building.area?.name ?? 'this area'}, with map coordinates available for quick orientation.`}
        </p>
      </div>
      <div className="grid gap-3 text-sm">
        <div className="rounded-xl bg-muted/45 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Area</p>
          <p className="mt-2 font-extrabold text-foreground">{building.area?.name ?? 'Not available'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/45 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Latitude</p>
            <p className="mt-2 font-extrabold text-foreground">{building.location.lat.toFixed(5)}</p>
          </div>
          <div className="rounded-xl bg-muted/45 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Longitude</p>
            <p className="mt-2 font-extrabold text-foreground">{building.location.lng.toFixed(5)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
