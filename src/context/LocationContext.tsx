import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { DURGA_PUJA_2026, type PandalPlace } from '../config/festivalConfig';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'requesting';

export interface PandalDistanceInfo extends PandalPlace {
  dayName: string;
  dayBengaliName?: string;
  distanceKm: number | null;
  formattedDistance: string;
  directionsUrl: string;
}

interface LocationContextType {
  coordinates: UserCoordinates | null;
  permissionState: LocationPermissionState;
  errorMessage: string | null;
  locality: string | null;
  isKolkataRegion: boolean;
  requestLocation: () => void;
  calculateDistance: (lat: number, lng: number) => number | null;
  nearestPandals: PandalDistanceInfo[];
  closestPandal: PandalDistanceInfo | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Haversine formula to compute great-circle distance between two points in km
export function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(null);
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('requesting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locality, setLocality] = useState<string | null>(null);

  // Determine locality from coordinates
  const determineLocality = useCallback(async (lat: number, lng: number) => {
    const inKolkata = lat >= 22.3 && lat <= 22.8 && lng >= 88.1 && lng <= 88.6;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const neighborhood = address.suburb || address.neighbourhood || address.residential || address.city_district;
        const city = address.city || address.town || address.state_district || 'Kolkata';
        
        if (neighborhood) {
          setLocality(`${neighborhood}, ${city}`);
          return;
        } else if (city) {
          setLocality(`${city}, ${address.state || 'India'}`);
          return;
        }
      }
    } catch {
      // Fallback
    }

    if (inKolkata) {
      setLocality('Kolkata, WB');
    } else {
      setLocality(`${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);
    }
  }, []);

  // Request location from browser
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPermissionState('unavailable');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setPermissionState('requesting');
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: UserCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setCoordinates(coords);
        setPermissionState('granted');
        setErrorMessage(null);

        determineLocality(coords.latitude, coords.longitude);
      },
      (error) => {
        console.warn('Geolocation prompt response:', error.message);
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState('denied');
          setErrorMessage('Location permission was denied. Please allow location in your browser settings to see nearby pandals.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setPermissionState('unavailable');
          setErrorMessage('Location information is currently unavailable.');
        } else {
          setPermissionState('prompt');
          setErrorMessage('Location request timed out. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      }
    );
  }, [determineLocality]);

  // Always invoke location request on mount
  useEffect(() => {
    requestLocation();

    // Check if Permissions API is available to watch status changes
    if ('permissions' in navigator && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') {
          setPermissionState('granted');
        } else if (status.state === 'denied') {
          setPermissionState('denied');
        }

        status.onchange = () => {
          if (status.state === 'granted') {
            requestLocation();
          } else if (status.state === 'denied') {
            setPermissionState('denied');
            setCoordinates(null);
          }
        };
      }).catch(() => {});
    }
  }, [requestLocation]);

  // Is the user near Kolkata?
  const isKolkataRegion = useMemo(() => {
    if (!coordinates) return false;
    const { latitude, longitude } = coordinates;
    return latitude >= 22.2 && latitude <= 22.9 && longitude >= 88.1 && longitude <= 88.7;
  }, [coordinates]);

  // Calculate distance helper
  const calculateDistance = useCallback((lat: number, lng: number): number | null => {
    if (!coordinates) return null;
    return getHaversineDistanceKm(coordinates.latitude, coordinates.longitude, lat, lng);
  }, [coordinates]);

  // Nearest pandals list with distances
  const nearestPandals: PandalDistanceInfo[] = useMemo(() => {
    const list: PandalDistanceInfo[] = [];
    DURGA_PUJA_2026.days.forEach(day => {
      day.places?.forEach(place => {
        const dist = coordinates ? getHaversineDistanceKm(coordinates.latitude, coordinates.longitude, place.lat, place.lng) : null;
        const formattedDistance = dist !== null ? (dist < 1 ? `${Math.round(dist * 1000)} m away` : `${dist} km away`) : 'Distance unavailable';
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

        list.push({
          ...place,
          dayName: day.name,
          dayBengaliName: day.bengaliName,
          distanceKm: dist,
          formattedDistance,
          directionsUrl
        });
      });
    });

    return list.sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [coordinates]);

  const closestPandal = nearestPandals.length > 0 && nearestPandals[0].distanceKm !== null ? nearestPandals[0] : null;

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        permissionState,
        errorMessage,
        locality,
        isKolkataRegion,
        requestLocation,
        calculateDistance,
        nearestPandals,
        closestPandal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
