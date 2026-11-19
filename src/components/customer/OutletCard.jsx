import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Star,
  CheckCircle,
  Navigation,
  Compass,
} from 'lucide-react';
import { useOutlet } from '../../context/OutletContext';

export default function OutletCard({ outlet, onSelect, isSelected }) {
  const { changeSelectedOutlet } = useOutlet();

  const handleSelect = () => {
    changeSelectedOutlet(outlet);
    if (onSelect) onSelect(outlet);
  };

  const cleanWhatsApp = outlet.whatsappNumber.replace(/[^0-9]/g, '');
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.location?.lat || 19.076},${outlet.location?.lng || 72.8777}`;

  return (
    <div
      className={`rounded-3xl border bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-soft hover:shadow-xl ${
        isSelected
          ? 'border-bubble-500 ring-4 ring-bubble-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Outlet Image & Tags */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={outlet.imageUrl}
            alt={outlet.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{outlet.rating || 4.8}</span>
          </div>

          {/* Distance Badge if available */}
          {outlet.distanceKm !== undefined && (
            <div className="absolute top-2.5 left-2.5 bg-bubble-600 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-md">
              <Navigation className="w-3 h-3" />
              <span>{outlet.distanceKm} km away</span>
            </div>
          )}

          {/* Outlet Title on Image */}
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black drop-shadow-md truncate">
                {outlet.name}
              </span>
            </div>
            <p className="text-[11px] text-white/90 line-clamp-1">{outlet.city}</p>
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-bubble-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed line-clamp-2">{outlet.address}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{outlet.openingHours}</span>
          </div>

          {outlet.tags && outlet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {outlet.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Call, WhatsApp & Select */}
      <div className="p-4 sm:p-5 pt-0 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          
          {/* Call Option */}
          <a
            href={`tel:${outlet.phone}`}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-all active:scale-95"
            title={`Call ${outlet.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Call</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
              `Hi Dream Bubbles (${outlet.name}), I would like to place an order!`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold transition-all active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Maps Directions */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-all active:scale-95"
            title="Open in Google Maps"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Maps</span>
          </a>

        </div>

        {/* Select Outlet Button */}
        <button
          type="button"
          onClick={handleSelect}
          className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
            isSelected
              ? 'bg-bubble-100 text-bubble-800 border border-bubble-300'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle className="w-4 h-4 text-bubble-600" />
              <span>Ordering From Here</span>
            </>
          ) : (
            <span>Select This Outlet</span>
          )}
        </button>
      </div>
    </div>
  );
}
