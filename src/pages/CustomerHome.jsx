import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Flame,
  Zap,
  Leaf,
  HeartHandshake,
} from 'lucide-react';
import { useOutlet } from '../context/OutletContext';
import { useCart } from '../context/CartContext';
import api from '../api/apiClient';
import CategoryFilter from '../components/customer/CategoryFilter';
import ProductCard from '../components/customer/ProductCard';

export default function CustomerHome() {
  const { selectedOutlet, detectLocation, isLocating } = useOutlet();
  const { setIsCartOpen } = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories & products (filtered by selectedOutlet if available to check stock!)
  const loadMenu = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedOutlet?._id) {
        params.outletId = selectedOutlet._id;
      }
      if (vegOnly) {
        params.veg = 'true';
      }

      const [catRes, prodRes] = await Promise.all([
        api.getCategories(),
        api.getProducts(params),
      ]);

      if (catRes.success) setCategories(catRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [selectedOutlet, vegOnly]);

  // Filter products by selected category and search term
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (p.category && (p.category._id === selectedCategory || p.category === selectedCategory));

    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 sm:space-y-12 pb-28 sm:pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bubble-950 via-purple-900 to-slate-900 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-3 sm:mt-4 shadow-xl p-6 sm:p-12 lg:p-16">
        
        {/* Decorative background glow circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-bubble-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-bubble-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Handcrafted Boba & Bubble Teas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Velvety Teas, Slow-Simmered <span className="bg-gradient-to-r from-bubble-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">Boba Pearls.</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Order directly from your nearest kitchen. Enjoy warm brown sugar pearls, ceremonial matcha, Himalayan cheese foam macchiatos, and gourmet crispy Asian street bites.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
            
            {/* Find Outlets */}
            <Link
              to="/outlets"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-bubble-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-bubble shadow-bubble-500/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4" />
              <span>Nearby Outlets</span>
            </Link>

            {/* Direct Call to Nearest Outlet */}
            {selectedOutlet?.phone ? (
              <a
                href={`tel:${selectedOutlet.phone}`}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Kitchen</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={detectLocation}
                disabled={isLocating}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <MapPin className="w-4 h-4 text-bubble-400" />
                <span>{isLocating ? 'Locating...' : 'Auto-Detect Outlet'}</span>
              </button>
            )}

            {/* Admin Link */}
            <Link
              to="/admin"
              className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </Link>

          </div>

          {/* Current Selected Outlet Pill */}
          {selectedOutlet && (
            <div className="pt-1">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>Ordering from:</span>
                <strong className="text-white font-bold">{selectedOutlet.name}</strong>
                {selectedOutlet.distanceKm !== undefined && (
                  <span className="bg-bubble-500/30 text-bubble-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    {selectedOutlet.distanceKm} km away
                  </span>
                )}
                <Link to="/outlets" className="text-bubble-300 hover:underline font-bold ml-1">
                  Change
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Feature Perks Highlights Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-bubble-50 text-bubble-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">15-25 Mins</div>
              <div className="text-[10px] text-slate-400">Fresh hot delivery</div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">WhatsApp 1-Tap</div>
              <div className="text-[10px] text-slate-400">Direct barista link</div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">100% Real Tea</div>
              <div className="text-[10px] text-slate-400">Handcrafted daily</div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Multi-Outlet</div>
              <div className="text-[10px] text-slate-400">Pick closest branch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Menu by Category Section (Feature 2) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-bubble-100 text-bubble-800 mb-1">
              <span>Menu & Food Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Drinks & Bites
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Customize sweetness level (0% - 100%) and ice upon adding!
            </p>
          </div>

          {/* Search & Veg Filter */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative max-w-xs w-full flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search boba, snacks..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Veg toggle */}
            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shadow-xs shrink-0 ${
                vegOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Veg Only</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter (Feature 2) */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-bubble-600" />
            <span className="text-xs sm:text-sm font-bold">Brewing menu delicacies...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-2">
            <div className="text-3xl">🧋</div>
            <h3 className="font-bold text-slate-800 text-sm">No items found</h3>
            <p className="text-xs text-slate-400">
              Try switching category or clear the search filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* Floating Bottom Quick Bar (on Desktop/Tablet) */}
      {selectedOutlet && (
        <div className="hidden sm:block fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl">🧋</span>
              <div className="min-w-0">
                <div className="text-xs font-black truncate">{selectedOutlet.name}</div>
                <div className="text-[10px] text-slate-400">Fast delivery & pickup active</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Call Option */}
              <a
                href={`tel:${selectedOutlet.phone}`}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                title={`Call ${selectedOutlet.name}`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Outlet</span>
              </a>

              {/* View Cart */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-bubble-600 hover:bg-bubble-500 text-white font-extrabold text-xs shadow-bubble transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <span>View Cart</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
