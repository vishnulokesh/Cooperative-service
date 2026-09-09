import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';

interface RapidoMapProps {
  center?: [number, number]; // [lat, lng]
  customerLocation?: { lat: number; lng: number; address: string };
  workerLocation?: { lat: number; lng: number; name: string };
  otherWorkers?: Array<{ lat: number; lng: number; id: string; name?: string }>;
  isTracking?: boolean;
  workerProgress?: number; // 0 to 1 along route
  onRecenter?: () => void;
}

// Default to Madanapalle coordinates
const DEFAULT_CENTER: [number, number] = [13.5560, 78.5010];

export default function RapidoMap({
  center = DEFAULT_CENTER,
  customerLocation = { lat: 13.5560, lng: 78.5010, address: '2/419, Madanapalle' },
  workerLocation,
  otherWorkers = [
    { lat: 13.5595, lng: 78.5042, id: 'w1' },
    { lat: 13.5525, lng: 78.4980, id: 'w2' },
    { lat: 13.5580, lng: 78.4950, id: 'w3' },
    { lat: 13.5510, lng: 78.5060, id: 'w4' },
    { lat: 13.5630, lng: 78.5020, id: 'w5' },
  ],
  isTracking = false,
  workerProgress = 0,
}: RapidoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const workerMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const { isDarkMode } = useTheme();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Zoom control on top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer on Dark Mode Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = tileLayer;
  }, [isDarkMode]);

  // Center update
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom(), { animate: true });
    }
  }, [center[0], center[1]]);

  // Customer Marker & Other Workers (Only show other workers when NOT tracking!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Customer Marker (Green Pin with Pulse Ring)
    const customerHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-9 h-9 rounded-full bg-emerald-500/20 animate-ping"></div>
        <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>
    `;
    const customerIcon = L.divIcon({
      html: customerHtml,
      className: 'customer-pin-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const customerMarker = L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon })
      .addTo(map)
      .bindTooltip(customerLocation.address || 'Your Location', {
        permanent: true,
        direction: 'bottom',
        className: isDarkMode
          ? 'bg-gray-900 font-bold text-xs text-white px-2 py-1 rounded-lg shadow-md border border-gray-700 mt-2'
          : 'bg-white font-bold text-xs text-dark px-2 py-1 rounded-lg shadow-md border border-gray-100 mt-2',
      });

    // Nearby other workers (Small bike/worker icons like Rapido screenshot)
    // CRITICAL REQUIREMENT: AFTER BOOKING, ONLY BOOKED EMPLOYEE DETAILS SHOWN!
    // When isTracking === true, otherWorkers are NOT displayed on the map!
    const otherMarkers: L.Marker[] = [];
    if (!isTracking) {
      otherWorkers.forEach((w) => {
        const bikeHtml = `
          <div class="relative flex items-center justify-center group cursor-pointer transition-transform hover:scale-125">
            <div class="w-8 h-8 rounded-full bg-[#182235] border-2 border-[#FFC928] shadow-md flex items-center justify-center text-[#FFC928]">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/>
              </svg>
            </div>
          </div>
        `;
        const bikeIcon = L.divIcon({
          html: bikeHtml,
          className: 'nearby-worker-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const m = L.marker([w.lat, w.lng], { icon: bikeIcon }).addTo(map);
        otherMarkers.push(m);
      });
    }

    return () => {
      customerMarker.remove();
      otherMarkers.forEach((m) => m.remove());
    };
  }, [customerLocation, otherWorkers, isTracking, isDarkMode]);

  // Route Polyline & Worker Position (Only active when isTracking === true)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // If cancelled or not tracking, clean up any tracking line and booked worker marker
    if (!isTracking) {
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }
      if (workerMarkerRef.current) {
        workerMarkerRef.current.remove();
        workerMarkerRef.current = null;
      }
      return;
    }

    // Start coordinate of assigned worker
    const startLat = workerLocation ? workerLocation.lat : customerLocation.lat + 0.007;
    const startLng = workerLocation ? workerLocation.lng : customerLocation.lng + 0.005;

    // End coordinate of customer
    const endLat = customerLocation.lat;
    const endLng = customerLocation.lng;

    // Realistic multi-point road curvature
    const midLat1 = startLat - (startLat - endLat) * 0.35 + 0.0012;
    const midLng1 = startLng - (startLng - endLng) * 0.3 - 0.0015;

    const midLat2 = startLat - (startLat - endLat) * 0.7 - 0.0008;
    const midLng2 = startLng - (startLng - endLng) * 0.75 + 0.001;

    const routeCoords: [number, number][] = [
      [startLat, startLng],
      [midLat1, midLng1],
      [midLat2, midLng2],
      [endLat, endLng],
    ];

    // Remove existing route line if any
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }

    // Glowing road route polyline
    const polyline = L.polyline(routeCoords, {
      color: isDarkMode ? '#60A5FA' : '#1B3A6B',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '8, 8',
    }).addTo(map);
    routeLineRef.current = polyline;

    // Current worker position along route (based on workerProgress: 0 = start, 1 = arrived)
    let currentWorkerLat = startLat;
    let currentWorkerLng = startLng;

    if (workerProgress > 0) {
      if (workerProgress < 0.35) {
        const t = workerProgress / 0.35;
        currentWorkerLat = startLat + (midLat1 - startLat) * t;
        currentWorkerLng = startLng + (midLng1 - startLng) * t;
      } else if (workerProgress < 0.7) {
        const t = (workerProgress - 0.35) / 0.35;
        currentWorkerLat = midLat1 + (midLat2 - midLat1) * t;
        currentWorkerLng = midLng1 + (midLng2 - midLng1) * t;
      } else {
        const t = (workerProgress - 0.7) / 0.3;
        currentWorkerLat = midLat2 + (endLat - midLat2) * t;
        currentWorkerLng = midLng2 + (endLng - midLng2) * t;
      }
    }

    // Booked Worker Active Marker (Yellow Rapido Style with Tool/Bike Icon)
    const workerHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full bg-[#FFC928]/40 animate-ping"></div>
        <div class="w-10 h-10 rounded-full bg-[#FFC928] border-2 border-dark shadow-2xl flex items-center justify-center text-dark font-black">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="15" cy="5" r="1"/>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
          </svg>
        </div>
      </div>
    `;

    const workerIcon = L.divIcon({
      html: workerHtml,
      className: 'active-worker-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const tooltipText = workerProgress >= 1
      ? `${workerLocation?.name || 'Booked Worker'} (Arrived at Doorstep 🚪)`
      : `${workerLocation?.name || 'Booked Worker'} (On The Way 🛵)`;

    if (workerMarkerRef.current) {
      workerMarkerRef.current.setLatLng([currentWorkerLat, currentWorkerLng]);
      workerMarkerRef.current.setTooltipContent(tooltipText);
    } else {
      const workerMarker = L.marker([currentWorkerLat, currentWorkerLng], { icon: workerIcon })
        .addTo(map)
        .bindTooltip(tooltipText, {
          permanent: true,
          direction: 'top',
          className: 'bg-dark text-[#FFC928] font-black text-xs px-2.5 py-1 rounded-full shadow-lg border border-[#FFC928]/40 mb-2',
        });
      workerMarkerRef.current = workerMarker;
    }

    return () => {
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }
      if (workerMarkerRef.current) {
        workerMarkerRef.current.remove();
        workerMarkerRef.current = null;
      }
    };
  }, [customerLocation, workerLocation, isTracking, workerProgress, isDarkMode]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([customerLocation.lat, customerLocation.lng], 15, {
        animate: true,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[480px] bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Recenter Button on bottom-right */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute bottom-6 right-6 z-10 w-11 h-11 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-dark dark:text-gray-100 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:scale-105"
        title="Recenter to your location"
      >
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      </button>
    </div>
  );
}
