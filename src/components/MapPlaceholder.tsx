import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  title?: string;
  height?: string;
  address?: string;
}

// [DEMO] Connect to Google Maps / OpenStreetMap API in production
const MapPlaceholder = ({ title = 'Map View', height = 'h-64', address }: MapPlaceholderProps) => {
  return (
    <div className={`${height} w-full bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Fake map grid lines */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Fake roads */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 rounded" />
        <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-400 rounded" />
        <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-400 rounded" />
        <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400 rounded" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-6">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3 shadow-lg animate-bounce">
          <MapPin className="w-6 h-6 text-white" fill="white" />
        </div>
        <p className="font-bold text-gray-700 text-sm">{title}</p>
        {address && <p className="text-xs text-gray-500 mt-1 max-w-48">{address}</p>}
        <p className="text-xs text-gray-400 mt-2 bg-white/80 px-3 py-1 rounded-full border border-gray-200">
          🗺️ Map integration coming soon
        </p>
      </div>
    </div>
  );
};

export default MapPlaceholder;
