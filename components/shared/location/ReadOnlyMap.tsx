'use client';

import dynamic from 'next/dynamic';

type ReadOnlyMapProps = {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
};

const LeafletMapClient = dynamic<ReadOnlyMapProps>(() => import('./leaflet-map').then((mod) => mod.ReadOnlyMapClient), { ssr: false });

export function ReadOnlyMap(props: ReadOnlyMapProps) {
  return <LeafletMapClient {...props} />;
}
