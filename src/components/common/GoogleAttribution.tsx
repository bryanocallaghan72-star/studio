'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GoogleAttributionProps {
  className?: string;
}

/**
 * Renders the required "Powered by Google" attribution logo.
 * This component is necessary to comply with Google Maps Platform Terms of Service
 * when displaying Google Places data (like addresses, phone numbers, or websites)
 * outside of an interactive Google Map.
 */
export default function GoogleAttribution({ className }: GoogleAttributionProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white.png"
        alt="Powered by Google"
        className="h-4 w-auto object-contain opacity-70"
        loading="lazy"
      />
    </div>
  );
}
