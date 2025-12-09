'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type LogoProps = {
  variant?: 'mark' | 'lockup';
  size?: number;
  className?: string;
};

// Fallback SVG data from the previous version
const FallbackLogoSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4A90E2', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#00438A', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="url(#logoGradient)" stroke="none" />
    <path d="M7 10.5c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke="white" strokeWidth="1.5" />
    <path d="M7 12.5c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
  </svg>
);


export function Logo({ variant = 'lockup', size = 32, className }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  const src = variant === 'mark'
    ? '/iykyk-logo/mark@2x.png'
    : '/iykyk-logo/lockup-horizontal@2x.png';
    
  // Assume aspect ratios to provide width/height to Next.js Image
  // Mark: 1:1, Lockup: ~3.5:1
  const aspectRatio = variant === 'mark' ? 1 : 3.5;
  const width = Math.round(size * aspectRatio);
  const height = size;

  const applyPriority = variant === 'lockup' && size >= 28;

  if (hasError) {
    return (
      <div className={cn(className)} style={{ height: size, width: width }}>
        <FallbackLogoSVG />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt="iykyk logo"
      width={width}
      height={height}
      priority={applyPriority}
      className={cn(className)}
      style={{ height: size, width: 'auto' }}
      onError={() => setHasError(true)}
    />
  );
}
