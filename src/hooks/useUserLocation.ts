'use client';

import { useState, useEffect, useRef } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UserLocationState {
  coords: Coordinates | null;
  accuracyMeters: number | null;
  isLoading: boolean;
  error: GeolocationPositionError | null;
}

/**
 * A hook to get the user's current geographical location one time.
 * It uses a ref to ensure the geolocation API is only called once per component mount.
 *
 * @returns {UserLocationState} The user's location state, including coordinates, loading status, and any errors.
 */
export function useUserLocation(): UserLocationState {
  const [location, setLocation] = useState<UserLocationState>({
    coords: null,
    accuracyMeters: null,
    isLoading: true,
    error: null,
  });
  const attemptedRef = useRef(false);

  useEffect(() => {
    // Guard to ensure this effect runs only once.
    if (attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;

    if (!navigator.geolocation) {
      setLocation({
        coords: null,
        accuracyMeters: null,
        isLoading: false,
        error: null, // Set error to null as GeolocationPositionError cannot be manually instantiated
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        accuracyMeters: position.coords.accuracy,
        isLoading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error.message);
      setLocation({
        coords: null,
        accuracyMeters: null,
        isLoading: false,
        error: error,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

  }, []); // Empty dependency array ensures it runs once on mount.

  return location;
}
