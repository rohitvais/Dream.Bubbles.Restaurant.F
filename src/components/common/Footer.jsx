import React from 'react';
import { Phone, MessageCircle, MapPin, Heart, Sparkles, Clock } from 'lucide-react';
import { useOutlet } from '../../context/OutletContext';

export default function Footer() {
  const { selectedOutlet } = useOutlet();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Intro */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧋</span>
              <span className="text-2xl font-extrabold text-white">Dream Bubbles</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Serving velvety Taiwanese bubble tea, slow-simmered brown sugar pearls, and crunchy gourmet Asian bites. Every sip is a dream!
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-950/40 border border-amber-900/60 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Real Tea & Natural Ingredients</span>
            </div>
          </div>

          {/* Current Outlet Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Your Current Outlet
            </h4>
            {selectedOutlet ? (
              <div className="space-y-2.5 text-sm text-slate-400">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-bubble-400 shrink-0" />
                  <span>{selectedOutlet.name}</span>
                </div>
                <p className="text-xs text-slate-400 pl-5.5 leading-relaxed">
                  {selectedOutlet.address}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 pl-5.5">
                  <Clock className="w-3.5 h-3.5 text-bubble-400" />
                  <span>{selectedOutlet.openingHours}</span>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`tel:${selectedOutlet.phone}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Outlet: {selectedOutlet.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedOutlet.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-green-400 hover:text-green-300 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp: +{selectedOutlet.whatsappNumber}</span>
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No outlet selected yet.</p>
            )}
          </div>

          {/* Quick Order Methods */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              How To Order
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>Select your nearest Dream Bubbles outlet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>Add delicious boba, fruit tea, and snacks to cart</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <span>Tap <strong>Order via WhatsApp</strong> for 1-click order transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">4.</span>
                <span>Or tap <strong>Call Outlet</strong> to speak with our barista directly</span>
              </li>
            </ul>
          </div>

          {/* Store Hours & Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Operating Hours
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mon - Sun: 10:00 AM – 11:30 PM<br />
              Late-night delivery available at select locations.
            </p>
            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Admin portal features real-time inventory tracking, orders dispatching, and multi-outlet management.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dream Bubbles Cafe & Boba Bar. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Brewed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>and tapioca pearls for boba lovers everywhere.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
