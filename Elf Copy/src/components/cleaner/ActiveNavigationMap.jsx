import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/components/utils/GoogleMapsLoader';

const API_KEY = 'AIzaSyDV1pEVuFHkV_uZ1SLG6mZhB-IyOACXq8A';

function blueDotIcon() {
  return {
    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 6,
    fillColor: '#4285F4',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    rotation: 0,
  };
}

export default function ActiveNavigationMap({ coursePoints = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(API_KEY).then((maps) => {
      if (cancelled || !mapRef.current) return;

      const defaultCenter = coursePoints[0] ?? { lat: 33.3617, lng: 126.5292 };
      const map = new maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 18,
        mapTypeId: maps.MapTypeId.HYBRID,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: 'greedy',
      });
      mapInstanceRef.current = map;

      // Draw course polyline
      if (coursePoints.length > 1) {
        polylineRef.current = new maps.Polyline({
          path: coursePoints,
          geodesic: true,
          strokeColor: '#22c55e',
          strokeOpacity: 0.7,
          strokeWeight: 6,
          map,
        });
      }

      // Place trash spot markers
      coursePoints.forEach((pt) => {
        new maps.Marker({
          position: pt,
          map,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#FFCC00',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
          },
        });
      });

      // User marker (initially hidden)
      userMarkerRef.current = new maps.Marker({
        position: defaultCenter,
        map,
        icon: blueDotIcon(),
        zIndex: 99,
        optimized: false,
      });

      setMapReady(true);
    });

    return () => { cancelled = true; };
  }, []);

  // Watch GPS and auto-center
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (userMarkerRef.current) {
          const icon = { ...blueDotIcon(), rotation: pos.coords.heading ?? 0 };
          userMarkerRef.current.setIcon(icon);
          userMarkerRef.current.setPosition(loc);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(loc);
        }
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [mapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}