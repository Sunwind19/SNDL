import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

/* ─── Helpers ─────────────────────────────────────────────── */
function hazardColor(score) {
  if (score >= 7) return '#FF3B30';
  if (score >= 3) return '#FFCC00';
  return '#34C759';
}

function dotIcon(color) {
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 6,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 1.5,
  };
}

function photoSize(zoom) {
  if (zoom > 16) return 60;
  if (zoom > 12) return 30;
  return 0; // hidden — show dot only
}

/* ─── OverlayView factory ─────────────────────────────────── */
function createPhotoOverlay(google, map, rec) {
  class PhotoOverlay extends google.maps.OverlayView {
    constructor() {
      super();
      this.latlng = new google.maps.LatLng(rec.latitude, rec.longitude);
      this.div = null;
    }

    onAdd() {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        will-change: transform, width, height;
        transition: width 0.3s ease-out, height 0.3s ease-out, transform 0.3s ease-out, opacity 0.3s ease-out;
        pointer-events: none;
        transform: translate(-50%, -100%);
      `;

      const img = document.createElement('img');
      img.src = rec.image_url;
      img.crossOrigin = 'anonymous';
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        aspect-ratio: 1/1;
        display: block;
        border-radius: 50%;
      `;
      div.appendChild(img);
      this.div = div;

      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    }

    draw() {
      const projection = this.getProjection();
      if (!projection || !this.div) return;
      const point = projection.fromLatLngToDivPixel(this.latlng);
      if (!point) return;
      this.div.style.left = point.x + 'px';
      this.div.style.top = point.y + 'px';
    }

    setZoom(zoom) {
      if (!this.div) return;
      const size = photoSize(zoom);
      const color = hazardColor(rec.hazard_score ?? 0);
      if (size === 0) {
        this.div.style.opacity = '0';
        this.div.style.width = '10px';
        this.div.style.height = '10px';
      } else {
        this.div.style.opacity = '1';
        this.div.style.width = size + 'px';
        this.div.style.height = size + 'px';
        this.div.style.border = `${size > 30 ? 4 : 3}px solid ${color}`;
      }
    }

    onRemove() {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }
  }

  const overlay = new PhotoOverlay();
  overlay.setMap(map);
  return overlay;
}

/* ─── Component ───────────────────────────────────────────── */
const DEFAULT_REPORT_DATA = { estimatedWeightKg: null, ecosystemUnits: null, photoUrl: null, location: null };

export default function ReporterMapMark({ reportData = DEFAULT_REPORT_DATA, onClaimSeeds }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const dotMarkersRef = useRef([]);
  const overlaysRef = useRef([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false); // 중복 클릭 방지 상태

  const placeMarkers = (map, records) => {
    dotMarkersRef.current.forEach(m => m.setMap(null));
    overlaysRef.current.forEach(o => o.setMap(null));
    dotMarkersRef.current = [];
    overlaysRef.current = [];

    const zoom = map.getZoom();

    records.forEach((rec) => {
      if (!rec.latitude || !rec.longitude) return;
      const pos = { lat: rec.latitude, lng: rec.longitude };
      const color = hazardColor(rec.hazard_score ?? 0);

      const dot = new window.google.maps.Marker({
        position: pos,
        map,
        icon: dotIcon(color),
        optimized: false,
        zIndex: 1,
      });
      dotMarkersRef.current.push(dot);

      if (rec.image_url) {
        const overlay = createPhotoOverlay(window.google, map, rec);
        overlay.setZoom(zoom);
        overlaysRef.current.push(overlay);
      }
    });

    map.addListener('zoom_changed', () => {
      const z = map.getZoom();
      overlaysRef.current.forEach(o => o.setZoom(z));
    });
  };

  const initializeMap = () => {
    if (!mapRef.current || !reportData?.location) return;
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: reportData.location,
        zoom: 18,
        mapTypeId: window.google.maps.MapTypeId.HYBRID,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      base44.entities.DetectionLog.list().then((records) => {
        const currentRec = reportData?.location && reportData?.photoUrl ? {
          latitude: reportData.location.lat,
          longitude: reportData.location.lng,
          image_url: reportData.photoUrl,
          hazard_score: reportData.hazard_score ?? 0,
        } : null;

        const allRecords = [...records];
        if (currentRec) {
          const alreadyIn = records.some(
            r => r.latitude === currentRec.latitude && r.longitude === currentRec.longitude && r.image_url === currentRec.image_url
          );
          if (!alreadyIn) allRecords.push(currentRec);
        }
        placeMarkers(map, allRecords);
      });

      setMapLoaded(true);
    } catch (err) {
      console.error('Map error:', err);
      setMapError(true);
    }
  };

  useEffect(() => {
    if (!reportData?.location) return;
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing && window.google?.maps) {
      initializeMap();
    } else if (existing) {
      existing.addEventListener('load', initializeMap);
    } else {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDV1pEVuFHkV_uZ1SLG6mZhB-IyOACXq8A&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => window.google?.maps ? initializeMap() : setMapError(true);
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    }
    return () => {
      dotMarkersRef.current.forEach(m => m.setMap(null));
      overlaysRef.current.forEach(o => o.setMap(null));
    };
  }, [reportData?.location]);

  // 씨앗 받기 & 정적 지도 이미지 생성 함수
  const handleClaimSeeds = () => {
    if (isClaimed || !reportData?.location) return;

    setIsClaimed(true); // 버튼 잠금

    const { lat, lng } = reportData.location;
    const apiKey = "AIzaSyDV1pEVuFHkV_uZ1SLG6mZhB-IyOACXq8A";

    // Green Computing: 복잡한 렌더링 대신 최적화된 정적 이미지 URL 생성
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x600&maptype=hybrid&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

    if (onClaimSeeds) {
      onClaimSeeds(reportData?.seedsPotential ?? 0, staticMapUrl);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={mapContainerRef} className="relative flex-1 min-h-0">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {reportData?.location && !mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Loading map...</span>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <span className="text-red-600 text-sm">Map failed to load</span>
          </div>
        )}

        {!reportData?.location && (
          <div className="absolute inset-0 flex items-center justify-center text-teal-400 text-sm select-none"
            style={{ background: 'linear-gradient(135deg, #b2e8e8 0%, #8dd3d3 40%, #a8dfd4 100%)' }}>
            <span className="opacity-60">[ Waiting for GPS & photo data ]</span>
          </div>
        )}
      </div>

      {/* Result panel */}
      <div className="bg-green-400 rounded-t-3xl px-6 pt-5 pb-4 flex flex-col items-center gap-3 shrink-0">
        <div className="opacity-50 mb-1">
          <svg width="60" height="72" viewBox="0 0 60 72" fill="white">
            <ellipse cx="30" cy="14" rx="16" ry="8" />
            <path d="M14 14 Q6 38 8 60 Q8 68 30 68 Q52 68 52 60 Q54 38 46 14 Z" />
          </svg>
        </div>
        <div className="text-white text-5xl font-bold leading-none">
          {reportData?.totalWeightKg != null
            ? <>{reportData.totalWeightKg}<span className="text-2xl ml-1 font-semibold">kg</span></>
            : <span className="text-3xl opacity-50">-- kg</span>
          }
        </div>
        
        <button
          onClick={handleClaimSeeds}
          disabled={isClaimed}
          className={`w-full py-4 rounded-2xl text-xl font-bold shadow-md transition-all active:scale-95 ${
            isClaimed 
              ? 'bg-gray-400 cursor-not-allowed opacity-70' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isClaimed ? 'Processing...' : `Claim ${reportData?.seedsPotential ?? 0} seeds`}
        </button>
      </div>
    </div>
  );
}