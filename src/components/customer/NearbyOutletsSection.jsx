import React, { useState } from 'react';
import { MapPin, Navigation, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useOutlet } from '../../context/OutletContext';
import OutletCard from './OutletCard';

export default function NearbyOutletsSection() {
  const {
    outlets,
    selectedOutlet,
    changeSelectedOutlet,
    detectLocation,
    isLocating,
    userCoords,
    loading,
  } = useOutlet();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOutlets = outlets.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q)
    );
  });

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header with Title and Geolocation Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-bubble-100 text-bubble-800">
              <MapPin className="w-3.5 h-3.5" />
              <span>Multi-Outlet Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Find Your Nearest Dream Bubbles
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              Choose the nearest kitchen to ensure your tapioca pearls are freshly cooked and beverages arrive at optimal temperature.
            </p>
          </div>

          {/* Action button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={detectLocation}
              disabled={isLocating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-bubble-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-bubble hover:opacity-95 transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating Your Area...' : 'Use Current Location (GPS)'}</span>
            </button>

            {userCoords && (
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl font-semibold flex items-center gap-1">
                <span>📍 Distance calculated</span>
              </span>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by neighborhood, city or street..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bubble-500 focus:border-transparent text-xs sm:text-sm placeholder:text-slate-400 shadow-xs"
          />
        </div>

        {/* Outlets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-bubble-500" />
            <span className="text-xs sm:text-sm font-semibold">Discovering nearby outlets...</span>
          </div>
        ) : filteredOutlets.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm sm:text-base font-bold text-slate-800">No outlets found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or reset location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredOutlets.map((outlet) => (
              <OutletCard
                key={outlet._id}
                outlet={outlet}
                isSelected={selectedOutlet?._id === outlet._id}
                onSelect={changeSelectedOutlet}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
