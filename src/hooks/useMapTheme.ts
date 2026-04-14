'use client';

import { useMemo } from 'react';

/**
 * @fileoverview Hook to manage Google Maps JSON themes for each phase.
 * The Google Maps types are provided by the @react-google-maps/api package.
 * We have removed the manual declare global block to avoid type conflicts with the library.
 */

export const MAP_THEMES = {
  dawn: {
    geometry: '#0d1628',
    labels: '#7eb8c9',
    roads: '#1a2a3a',
    roadLabels: '#5a8fa8',
    water: '#0a1220',
    parks: '#0d1f1a',
    transit: '#162236',
  },
  day: {
    geometry: '#e8e0d0',
    labels: '#8a6018',
    roads: '#d4c9a8',
    roadLabels: '#6b4f1a',
    water: '#7eb8c9',
    parks: '#c8d9b0',
    transit: '#ddd5c0',
  },
  golden: {
    geometry: '#2a1a08',
    labels: '#e8a050',
    roads: '#3d2510',
    roadLabels: '#c47828',
    water: '#1a2a3a',
    parks: '#1a1205',
    transit: '#2d1a08',
  },
  dusk: {
    geometry: '#0d1a2a',
    labels: '#c4762a',
    roads: '#1a2a3a',
    roadLabels: '#8a5a20',
    water: '#071018',
    parks: '#0a1518',
    transit: '#0f1e2a',
  },
};

export type MapPhase = keyof typeof MAP_THEMES;

/**
 * Builds the styles array for Google Maps.
 * Uses the native google.maps.MapTypeStyle type from the library.
 */
function buildMapStyles(phase: MapPhase): google.maps.MapTypeStyle[] {
  const t = MAP_THEMES[phase];
  return [
    {
      elementType: 'geometry',
      stylers: [{ color: t.geometry }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: t.labels }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: t.geometry }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: t.roads }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: t.roadLabels }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: t.water }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: t.labels }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: t.parks }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: t.transit }],
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: t.labels }],
    },
  ];
}

export function useMapTheme(phase: MapPhase) {
  return useMemo(() => buildMapStyles(phase), [phase]);
}
