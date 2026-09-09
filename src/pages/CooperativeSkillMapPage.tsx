import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Filter, ShieldCheck, Activity } from 'lucide-react';
import { workers } from '../services/mockData';

// Custom Map Pins for Leaflet
const createPinIcon = (status: string, isEmergency: boolean) => {
  let bgColor = '#10b981'; // Green: Available
  let label = 'A';
  if (isEmergency) {
    bgColor = '#ef4444'; // Red: Emergency Available
    label = '⚡';
  } else if (status === 'busy') {
    bgColor = '#f59e0b'; // Yellow: Busy
    label = 'B';
  } else if (status === 'offline') {
    bgColor = '#94a3b8'; // Gray: Offline
    label = 'O';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgColor};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
      ">${label}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const DEMAND_ZONES = [
  { id: 'zone-b', name: 'Zone B (Tirupati East) - High Demand', lat: 13.6300, lng: 79.4200, color: '#ef4444', radius: 4500, label: 'High Demand (+41% Surge)' },
  { id: 'zone-a', name: 'Zone A (Chittoor Central) - Normal', lat: 13.2172, lng: 79.1003, color: '#10b981', radius: 4000, label: 'Normal Supply' },
  { id: 'zone-c', name: 'Zone C (Madanapalle West) - Low Availability', lat: 13.5560, lng: 78.5010, color: '#f59e0b', radius: 3500, label: 'Low Worker Availability' }
];

// Coordinate map for realistic cluster
const CITY_COORDS: Record<string, [number, number]> = {
  'Chittoor': [13.2172, 79.1003],
  'Tirupati': [13.6288, 79.4192],
  'Bengaluru': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Chennai': [13.0827, 80.2707],
  'Visakhapatnam': [17.6868, 83.2185]
};

export default function CooperativeSkillMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [tradeFilter, setTradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showZones, setShowZones] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);

  const TRADES = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Housekeeper', 'Caregiver', 'Technician'];

  const filteredWorkers = workers.filter(w => {
    if (tradeFilter !== 'All') {
      const title = (w.professional_title || '').toLowerCase();
      if (!title.includes(tradeFilter.toLowerCase().replace('housekeeper', 'cleaning'))) return false;
    }
    if (statusFilter !== 'All') {
      if (statusFilter === 'Emergency' && !w.is_emergency_available) return false;
      if (statusFilter !== 'Emergency' && w.availability_status !== statusFilter.toLowerCase()) return false;
    }
    return true;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Southern India center (Chittoor / Tirupati region)
      const map = L.map(mapContainerRef.current).setView([13.4500, 79.2500], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors • DailSmart Cooperative Skill Map'
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing marker layers
    map.eachLayer((layer) => {
      if ((layer as any)._customLayer) {
        map.removeLayer(layer);
      }
    });

    // Draw Demand Zones
    if (showZones) {
      DEMAND_ZONES.forEach(z => {
        const circle = L.circle([z.lat, z.lng], {
          color: z.color,
          fillColor: z.color,
          fillOpacity: 0.15,
          radius: z.radius
        }).addTo(map);
        (circle as any)._customLayer = true;

        circle.bindTooltip(`<b>${z.name}</b><br/>${z.label}`, {
          permanent: false,
          direction: 'top'
        });
      });
    }

    // Draw Workers Pins
    filteredWorkers.forEach((w, idx) => {
      const baseCoord = CITY_COORDS[w.city || 'Chittoor'] || [13.2172, 79.1003];
      // Jitter for realistic dispersal
      const offsetLat = ((idx % 5) - 2) * 0.022;
      const offsetLng = ((idx % 4) - 1.5) * 0.024;
      const pos: [number, number] = [baseCoord[0] + offsetLat, baseCoord[1] + offsetLng];

      const icon = createPinIcon(w.availability_status, w.is_emergency_available);
      const marker = L.marker(pos, { icon }).addTo(map);
      (marker as any)._customLayer = true;

      marker.on('click', () => {
        setSelectedWorker(w);
      });

      marker.bindTooltip(`<b>${w.full_name || w.professional_title}</b><br/>${w.professional_title} (${w.availability_status})`, {
        direction: 'top'
      });
    });

  }, [filteredWorkers, showZones]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Operations Command Center
            </span>
            <span className="text-xs text-slate-500 font-mono">OpenStreetMap + Leaflet GIS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Cooperative Skill Map
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time geospatial distribution of verified cooperative workers across active demand zones.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Busy</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Emergency Ready</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400" /> Offline</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Trade:
          </span>
          {TRADES.map(t => (
            <button
              key={t}
              onClick={() => setTradeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                tradeFilter === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          {['All', 'Available', 'Busy', 'Emergency', 'Offline'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showZones}
              onChange={e => setShowZones(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Show Demand Zones
          </label>
        </div>
      </div>

      {/* Map + Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Container */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl h-[520px] relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Overlay Status Pill */}
          <div className="absolute top-4 right-4 z-20 bg-slate-900/90 text-white px-3.5 py-2 rounded-xl backdrop-blur-sm border border-slate-700 text-xs font-black shadow-lg">
            {filteredWorkers.length} Workers Active on GIS Map
          </div>
        </div>

        {/* Selected Worker / Zone Operations Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Live Inspector
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Click any marker</span>
            </div>

            {selectedWorker ? (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedWorker.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                    alt={selectedWorker.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                      {selectedWorker.full_name}
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedWorker.professional_title}</p>
                    <p className="text-[11px] text-slate-400">{selectedWorker.cooperative_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Availability</span>
                    <span className="font-black text-slate-900 dark:text-white capitalize">{selectedWorker.availability_status}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Rating</span>
                    <span className="font-black text-amber-500">★ {selectedWorker.rating} ({selectedWorker.completed_jobs} jobs)</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Emergency Dispatch</span>
                    <span className="font-black text-slate-900 dark:text-white">{selectedWorker.is_emergency_available ? 'Yes (< 15 min)' : 'Standard'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Today's Jobs</span>
                    <span className="font-black text-emerald-600">{selectedWorker.today_jobs_count} allocated</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedWorker.skills?.map((sk: string) => (
                      <span key={sk} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold text-slate-700 dark:text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
                Select any worker marker or demand zone circle on the GIS map to inspect live metrics.
              </div>
            )}
          </div>

          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 text-xs">
            <span className="font-black text-indigo-800 dark:text-indigo-300 block mb-0.5">
              Command Dispatch Alert:
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Zone B circle indicates predicted +41% surge. 7 standby plumbers can be triggered directly from the Demand Intelligence portal.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
