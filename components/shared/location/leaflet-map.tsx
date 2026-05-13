'use client';

import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useMemo } from 'react';
import { useClient } from '@/hooks/use-client';
import type { LocationValue } from './schema';

// Component to update map center when it changes
function MapController({ center }: { center: LocationValue }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);

  return null;
}

interface LeafletMarkerProps {
  position: [number, number];
  draggable: boolean;
  onDragEnd: (pos: LocationValue) => void;
}

// Custom inline SVG icon for map marker (no CDN)
const createMarkerIcon = () =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="position: relative; width: 36px; height: 36px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); position: absolute; top: 0; left: 0;">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

export function DraggableMarker({ position, draggable, onDragEnd }: LeafletMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const customIcon = useMemo(() => createMarkerIcon(), []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const latLng = marker.getLatLng();
          onDragEnd({ lat: latLng.lat, lng: latLng.lng });
        }
      },
    }),
    [onDragEnd],
  );

  return <Marker position={position} draggable={draggable} ref={markerRef} eventHandlers={eventHandlers} icon={customIcon} />;
}

interface LeafletMapProps {
  center: LocationValue;
  position: LocationValue;
  zoom?: number;
  draggable?: boolean;
  onPositionChange: (pos: LocationValue) => void;
}

export default function LeafletMap({ center, position, zoom = 12, draggable = true, onPositionChange }: LeafletMapProps) {
  const isClient = useClient();

  if (!isClient) return;
  return (
    <div className="w-full h-100 rounded-lg overflow-hidden border border-border relative z-0">
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={false} className="h-full w-full z-0">
        <MapController center={center} />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DraggableMarker position={[position.lat, position.lng]} draggable={draggable} onDragEnd={onPositionChange} />
      </MapContainer>
    </div>
  );
}

type ReadOnlyMapProps = {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
};

export const propertyMarkerIcon = L.divIcon({
  className: '',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute h-6 w-6 rounded-full bg-primary/20 animate-ping"></div>
      <div class="relative h-5 w-5 rounded-full border-2 border-white bg-primary shadow-lg"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export function ReadOnlyMapClient({ center, zoom = 13 }: ReadOnlyMapProps) {
  const isClient = useClient();

  if (!isClient) return null;

  return (
    <div className="w-full h-100 rounded-2xl overflow-hidden border border-border shadow-lg relative z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        zoomControl={true}
        boxZoom={false}
        keyboard={false}
        className="h-full w-full z-0"
      >
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[center.lat, center.lng]} icon={propertyMarkerIcon} />
      </MapContainer>
    </div>
  );
}
