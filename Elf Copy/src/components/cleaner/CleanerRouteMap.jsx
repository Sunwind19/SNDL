import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Mountain, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MAPS_KEY = 'AIzaSyDV1pEVuFHkV_uZ1SLG6mZhB-IyOACXq8A';
const POLYLINE_COLORS = ['#27AE60', '#2980B9', '#8E44AD'];
const CONNECT_DIST_KM = 2.0;
const MIN_CLUSTER_SIZE = 2;
const MAX_ROUTES = 3;
const DEFAULT_CENTER = { lat: 33.25, lng: 126.56 };
const LABEL = { mountain: 'Mountain', forest: 'Forest', flat: 'Flat' };

function hazardColor(score) {
  if (score >= 7) return '#FF3B30';
  if (score >= 3) return '#FFCC00';
  return '#34C759';
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(aa));
}

function recToPoint(r) { return { lat: r.latitude, lng: r.longitude }; }

export default function CleanerRouteMap({ selectedArea, selectedTime = 60, onStart }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const userMarkerRef = useRef(null);
  const routePolylinesRef = useRef([]);
  const nearbyRecordsRef = useRef([]);

  // --- [수리 완료] 모든 상태 변수 통일 ---
  const [currentRecords, setCurrentRecords] = useState([]); 
  const [userPos, setUserPos] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [noNearby, setNoNearby] = useState(false);
  const [expanded, setExpanded] = useState(false); 
  const [mapReady, setMapReady] = useState(false);

  const courseLabel = LABEL[selectedArea] ?? selectedArea ?? '—';

  const highlightRoute = (idx) => {
    routePolylinesRef.current.forEach((lines, ri) => {
      lines.forEach(line => {
        line.setOptions({ strokeWeight: ri === idx ? 8 : 3, strokeOpacity: ri === idx ? 1 : 0.4 });
      });
    });
    setSelectedRoute(idx);
  };

  // [수리] drawRecords 로직 최적화
  const drawRecords = (map, recordsForDrawing, userCenter) => {
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];
    routePolylinesRef.current = [];

    nearbyRecordsRef.current = recordsForDrawing;

    if (recordsForDrawing.length === 0) return;

    const parent = recordsForDrawing.map((_, i) => i);
    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    const union = (a, b) => { parent[find(a)] = find(b); };

    for (let i = 0; i < recordsForDrawing.length; i++)
      for (let j = i + 1; j < recordsForDrawing.length; j++)
        if (haversineKm(recToPoint(recordsForDrawing[i]), recToPoint(recordsForDrawing[j])) <= CONNECT_DIST_KM)
          union(i, j);

    const clusterMap = {};
    recordsForDrawing.forEach((_, i) => {
      const root = find(i);
      if (!clusterMap[root]) clusterMap[root] = [];
      clusterMap[root].push(i);
    });

    const createPath = (idxs, startPointIdx) => {
      let currentPath = [idxs[startPointIdx]];
      let remaining = idxs.filter((_, i) => i !== startPointIdx);
      let totalDist = 0;
      let totalTime = 2;

      while (remaining.length > 0) {
        const last = currentPath[currentPath.length - 1];
        let nearestIdx = 0;
        let minDist = haversineKm(recToPoint(recordsForDrawing[last]), recToPoint(recordsForDrawing[remaining[0]]));

        for(let k=1; k < remaining.length; k++) {
            const d = haversineKm(recToPoint(recordsForDrawing[last]), recToPoint(recordsForDrawing[remaining[k]]));
            if (d < minDist) { minDist = d; nearestIdx = k; }
        }

        const travelTime = minDist * 20; 
        const pickupTime = 2;
        if (totalTime + travelTime + pickupTime > selectedTime) break;

        totalTime += (travelTime + pickupTime);
        totalDist += minDist;
        currentPath.push(remaining[nearestIdx]);
        remaining.splice(nearestIdx, 1);
      }
      const totalWeight = currentPath.reduce((sum, i) => sum + (recordsForDrawing[i].estimated_weight_kg ?? 0), 0);
      return { idxs: currentPath, distKm: totalDist, estMins: Math.ceil(totalTime), totalWeight };
    };

    let rawRoutes = [];
    Object.values(clusterMap).forEach(idxs => {
      const sortedByMe = [...idxs].sort((a, b) => 
        haversineKm(userCenter || userPos || DEFAULT_CENTER, recToPoint(recordsForDrawing[a])) - 
        haversineKm(userCenter || userPos || DEFAULT_CENTER, recToPoint(recordsForDrawing[b]))
      );
      rawRoutes.push(createPath(idxs, idxs.indexOf(sortedByMe[0])));
      if (idxs.length >= 4) {
        rawRoutes.push(createPath(idxs, idxs.indexOf(sortedByMe[Math.floor(idxs.length / 2)])));
      }
    });

    const topRoutes = rawRoutes
      .filter(r => r.idxs.length >= MIN_CLUSTER_SIZE)
      .filter((v, i, a) => a.findIndex(t => (JSON.stringify(t.idxs) === JSON.stringify(v.idxs))) === i)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, MAX_ROUTES);

    const bounds = new window.google.maps.LatLngBounds();
    const routeData = topRoutes.map((route, routeIdx) => {
      const color = POLYLINE_COLORS[routeIdx % POLYLINE_COLORS.length];
      const lines = [];

      route.idxs.forEach((idx, i) => {
        bounds.extend(recToPoint(recordsForDrawing[idx]));
        markersRef.current.push(new window.google.maps.Marker({
          position: recToPoint(recordsForDrawing[idx]),
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: hazardColor(recordsForDrawing[idx].hazard_score ?? 0),
            fillOpacity: 1,
            strokeColor: color,
            strokeWeight: 3,
          },
        }));

        if (i < route.idxs.length - 1) {
          const line = new window.google.maps.Polyline({
            path: [recToPoint(recordsForDrawing[idx]), recToPoint(recordsForDrawing[route.idxs[i+1]])],
            strokeColor: color,
            strokeOpacity: routeIdx === 0 ? 1 : 0.4,
            strokeWeight: routeIdx === 0 ? 8 : 3,
            map,
          });
          lines.push(line);
          polylinesRef.current.push(line);
        }
      });
      routePolylinesRef.current.push(lines);
      return { ...route, color, markerCount: route.idxs.length };
    });

    if (userCenter) bounds.extend(userCenter);
    else if (userPos) bounds.extend(userPos);
    map.fitBounds(bounds);
    setRoutes(routeData);
  };

  const loadRecords = async (map, center, radiusKm) => {
    const allRecords = await base44.entities.DetectionLog.filter();
    const valid = allRecords.filter(r => {
      if (!r.latitude || !r.longitude) return false;
      return String(r.course_type).toLowerCase() === String(selectedArea).toLowerCase();
    });

    // [중요] 상태 저장!
    setCurrentRecords(valid);

    const nearby = valid
      .map(r => ({ ...r, _dist: haversineKm(center, recToPoint(r)) }))
      .filter(r => r._dist <= radiusKm)
      .sort((a, b) => a._dist - b._dist);

    if (nearby.length === 0) {
      setNoNearby(true);
      setRoutes([]);
    } else {
      setNoNearby(false);
      drawRecords(map, nearby, center);
    }
  };

  const buildMap = (center) => {
    if (!mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Always show user's location marker
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    userMarkerRef.current = new window.google.maps.Marker({
      position: center,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#007AFF',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 999,
      title: 'You are here',
    });

    setMapReady(true);
    loadRecords(map, center, 3);
  };

  const handleStartMission = () => {
    if (routes.length > 0 && nearbyRecordsRef.current.length > 0) {
      const finalCourse = routes[selectedRoute];
      // idxs are indices into the nearby array that was passed to drawRecords
      const points = finalCourse.idxs.map(idx => recToPoint(nearbyRecordsRef.current[idx]));
      onStart({
        points,
        totalWeight: finalCourse.totalWeight,
        estMins: finalCourse.estMins,
        color: finalCourse.color,
      });
    }
  };

  const initWithCenter = (center) => {
    setUserPos(center);
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing && window.google?.maps) {
      buildMap(center);
    } else if (existing) {
      existing.addEventListener('load', () => buildMap(center));
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => buildMap(center);
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    if (!selectedArea) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => initWithCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => initWithCenter(DEFAULT_CENTER),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [selectedArea, selectedTime]);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-0">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white bg-opacity-90 px-4 py-1.5 rounded-full shadow text-sm font-semibold text-gray-700 whitespace-nowrap">
          Showing {courseLabel} Course
        </div>
      </div>

      <div className="bg-white rounded-t-3xl px-5 pt-4 pb-3 shadow-inner flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {routes.map((r, idx) => (
            <button
              key={idx}
              onClick={() => highlightRoute(idx)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                selectedRoute === idx ? 'border-transparent shadow-md' : 'border-gray-100 bg-gray-50'
              }`}
              style={selectedRoute === idx ? { backgroundColor: r.color + '18', borderColor: r.color } : {}}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="font-semibold text-sm">Course {idx + 1}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold">{r.totalWeight.toFixed(1)} kg</span>
                <span className="text-[10px] text-gray-500">{r.estMins} mins</span>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handleStartMission}
          className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl text-xl shadow mt-1">
          Start
        </button>
      </div>
    </div>
  );
}