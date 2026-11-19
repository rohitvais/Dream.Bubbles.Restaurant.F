import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  UtensilsCrossed,
  X,
  Navigation,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOutlet } from '../../context/OutletContext';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { selectedOutlet, outlets, changeSelectedOutlet, detectLocation, isLocating } = useOutlet();
  const location = useLocation();

  const [showMobileOutletModal, setShowMobileOutletModal] = useState(false);
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-bubble-500 via-bubble-600 to-purple-600 flex items-center justify-center text-xl sm:text-2xl shadow-bubble shadow-bubble-500/25 group-hover:scale-105 transition-transform duration-300">
                🧋
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-bubble-700 via-purple-700 to-pearl-600 bg-clip-text text-transparent">
                  Dream Bubbles
                </span>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <span>Boba & Asian Bites</span>
                  <Sparkles className="w-3 h-3 text-amber-500 inline shrink-0" />
                </p>
              </div>
            </Link>

            {/* Desktop Center: Selected Outlet Pill with Hover Dropdown */}
            {!isAdmin && (
              <div className="hidden lg:flex items-center gap-2">
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-bubble-50 border border-slate-200 hover:border-bubble-200 transition-colors text-xs sm:text-sm font-semibold text-slate-700 hover:text-bubble-700"
                  >
                    <MapPin className="w-4 h-4 text-bubble-600 shrink-0" />
                    <span className="max-w-[200px] truncate">
                      {selectedOutlet ? selectedOutlet.name : 'Choose Outlet'}
                    </span>
                    {selectedOutlet?.distanceKm !== undefined && (
                      <span className="bg-bubble-100 text-bubble-700 text-xs px-2 py-0.5 rounded-full font-bold">
                        {selectedOutlet.distanceKm} km
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-bubble-600" />
                  </button>

                  {/* Desktop Dropdown */}
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 hidden group-hover:block transition-all z-50">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Select Outlet
                      </span>
                      <button
                        onClick={detectLocation}
                        disabled={isLocating}
                        className="text-xs text-bubble-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {outlets.map((outlet) => (
                        <button
                          key={outlet._id}
                          onClick={() => changeSelectedOutlet(outlet)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-start justify-between gap-2 transition-colors ${
                            selectedOutlet?._id === outlet._id
                              ? 'bg-bubble-50 text-bubble-800 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{outlet.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {outlet.address}
                            </div>
                          </div>
                          {outlet.distanceKm !== undefined && (
                            <span className="text-xs font-bold text-bubble-600 whitespace-nowrap">
                              {outlet.distanceKm} km
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Call Button (Desktop) */}
                {selectedOutlet?.phone && (
                  <a
                    href={`tel:${selectedOutlet.phone}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {selectedOutlet.phone}</span>
                  </a>
                )}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Mobile Outlet Pill Button (visible only on small/medium screens) */}
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowMobileOutletModal(true)}
                  className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-bubble-50 border border-bubble-200/80 text-bubble-800 text-xs font-bold active:scale-95 transition-all max-w-[140px] sm:max-w-[180px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-bubble-600 shrink-0" />
                  <span className="truncate">
                    {selectedOutlet ? selectedOutlet.name.replace('Dream Bubbles - ', '') : 'Select Outlet'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-bubble-500 shrink-0" />
                </button>
              )}

              {/* Desktop Nav Links */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/"
                  className={`text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-colors ${
                    location.pathname === '/'
                      ? 'bg-bubble-50 text-bubble-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Menu
                </Link>

                <Link
                  to="/outlets"
                  className={`text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-colors ${
                    location.pathname === '/outlets'
                      ? 'bg-bubble-50 text-bubble-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Outlets
                </Link>
              </div>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-bubble-600 to-purple-600 text-white font-bold text-xs sm:text-sm hover:opacity-95 shadow-bubble shadow-bubble-500/20 active:scale-95 transition-all flex items-center gap-2"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-white text-bubble-700 text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Toggle (Desktop) */}
              <Link
                to={isAdmin ? '/' : '/admin'}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{isAdmin ? 'Customer View' : 'Admin'}</span>
              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Food App Standard UX for mobile users) */}
      {!isAdmin && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl safe-area-pb">
          <div className="grid grid-cols-5 h-16 items-center px-1">
            
            {/* 1. Menu / Home */}
            <Link
              to="/"
              className={`flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold transition-colors ${
                location.pathname === '/' ? 'text-bubble-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>Menu</span>
            </Link>

            {/* 2. Outlets */}
            <Link
              to="/outlets"
              className={`flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold transition-colors ${
                location.pathname === '/outlets' ? 'text-bubble-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Outlets</span>
            </Link>

            {/* 3. Cart Button (Center Highlight) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center justify-center -mt-4 relative group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-bubble-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-bubble-500/30 group-active:scale-95 transition-transform">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black text-slate-700 mt-1">Cart</span>
            </button>

            {/* 4. Direct Call */}
            {selectedOutlet?.phone ? (
              <a
                href={`tel:${selectedOutlet.phone}`}
                className="flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setShowMobileOutletModal(true)}
                className="flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold text-slate-500"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </button>
            )}

            {/* 5. Admin Portal */}
            <Link
              to="/admin"
              className="flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold text-slate-500 hover:text-purple-600"
            >
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Admin</span>
            </Link>

          </div>
        </nav>
      )}

      {/* Mobile Outlet Selector Bottom Sheet Modal */}
      {showMobileOutletModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bubble-100 text-bubble-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Choose Dream Bubbles Kitchen</h3>
                  <p className="text-[10px] text-slate-400">Closest outlet guarantees fastest delivery</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileOutletModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Button */}
            <div className="py-3">
              <button
                onClick={() => {
                  detectLocation();
                  setShowMobileOutletModal(false);
                }}
                disabled={isLocating}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-bubble-50 to-purple-50 hover:bg-bubble-100 text-bubble-800 border border-bubble-200/80 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Navigation className={`w-3.5 h-3.5 text-bubble-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting coordinates...' : 'Auto-Detect Closest Outlet (GPS)'}</span>
              </button>
            </div>

            {/* Outlets List */}
            <div className="overflow-y-auto space-y-2 py-1 flex-1 max-h-72">
              {outlets.map((outlet) => {
                const isSelected = selectedOutlet?._id === outlet._id;
                return (
                  <button
                    key={outlet._id}
                    onClick={() => {
                      changeSelectedOutlet(outlet);
                      setShowMobileOutletModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-bubble-500 bg-bubble-50/80 ring-2 ring-bubble-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                        <span>{outlet.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-bubble-600 text-white font-extrabold px-1.5 py-0.2 rounded-md">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {outlet.address}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        🕒 {outlet.openingHours}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {outlet.distanceKm !== undefined && (
                        <div className="text-xs font-black text-bubble-700 bg-white px-2 py-1 rounded-lg border border-bubble-200">
                          {outlet.distanceKm} km
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
