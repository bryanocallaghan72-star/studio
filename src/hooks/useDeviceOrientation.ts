'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to track device orientation (specifically alpha/compass heading).
 * Handles iOS permission requirements for motion sensors.
 */
export function useDeviceOrientation() {
  const [alpha, setAlpha] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setAlpha(event.alpha);
    }
  }, []);

  const requestPermission = async () => {
    // Check for iOS 13+ permission API
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setHasPermission(true);
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (error) {
        console.error('DeviceOrientation permission error:', error);
      }
    } else {
      // Android or older iOS - permission usually not required or already handled by browser
      setHasPermission(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  useEffect(() => {
    // On non-iOS devices, we can just try to add the listener immediately
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission !== 'function'
    ) {
      setHasPermission(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [handleOrientation]);

  return { alpha, hasPermission, requestPermission };
}
