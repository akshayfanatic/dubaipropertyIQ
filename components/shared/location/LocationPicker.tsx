'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { LocationValue } from './schema';

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('@/components/shared/location/leaflet-map').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

export interface LocationPickerProps {
  // Required - controlled state
  value: LocationValue;
  onPositionChange: (location: LocationValue) => void;

  // Optional - map display customization
  className?: string;
  mapHeight?: string;

  // Optional - UI element visibility
  showCoordinates?: boolean;
  showUseMyLocation?: boolean;
  showSaveButton?: boolean;

  // Optional - save action callback
  onSave?: (location: LocationValue) => void;

  // Optional - label customization
  coordinatesLabel?: string;
  useLocationLabel?: string;
  saveLabel?: string;
}

export function LocationPicker({
  value,
  onPositionChange,
  className,
  mapHeight = '400px',
  showCoordinates = true,
  showUseMyLocation = true,
  showSaveButton = false,
  onSave,
  coordinatesLabel = 'Coordinates:',
  useLocationLabel = 'Use My Location',
  saveLabel = 'Save Location',
}: LocationPickerProps) {
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onPositionChange({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Parent handles UI feedback
      },
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(value);
    }
  };

  return (
    <div className={className}>
      {/* Map */}
      <div style={{ height: mapHeight }}>
        <LeafletMap center={value} position={value} draggable onPositionChange={onPositionChange} />
      </div>

      {/* Coordinates Display */}
      {showCoordinates && (
        <div className="flex items-center gap-2 mt-4">
          <Label className="text-muted-foreground">{coordinatesLabel}</Label>
          <Badge variant="secondary" className="font-mono">
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </Badge>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {showUseMyLocation && (
          <Button type="button" variant="outline" onClick={handleCurrentLocation}>
            {useLocationLabel}
          </Button>
        )}
        {showSaveButton && (
          <Button type="button" onClick={handleSave}>
            {saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
