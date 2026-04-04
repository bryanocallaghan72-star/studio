'use client';

import { useMemo } from 'react';

/**
 * The Google Maps types are provided by the @react-google-maps/api package.
 * We no longer need the custom declare global workaround as it caused conflicts.
 */

export const MAP_THEMES = {
  dawn: {
    geometry: '#0d1420',
    labels: '#4a6fa5',
    roads: '#1a2744',
    roadLabels: '#3d5a80',
    water: '#0a1628',
    parks: '#0d1f1a',
    transit: '#162236',
  },
  day: {
    geometry: '#e8e0d0',
    labels: '#8a6018',
    roads: '#d4c9a8',
    roadLabels: '#6b4f1a',
    water: '#b8d4e8',
    parks: '#c8d9b0',
    transit: '#ddd5c0',
  },
  golden: {
    geometry: '#1c0e02',
    labels: '#f97316',
    roads: '#2d1804',
    roadLabels: '#c45e0a',
    water: '#0d1a2d',
    parks: '#1a1005',
    transit: '#241206',
  },
  dusk: {
    geometry: '#0e0820',
    labels: '#a78bfa',
    roads: '#1a1035',
    roadLabels: '#7c5cbf',
    water: '#050310',
    parks: '#0a0818',
    transit: '#120a28',
  },
};

export type MapPhase = keyof typeof MAP_THEMES;

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
