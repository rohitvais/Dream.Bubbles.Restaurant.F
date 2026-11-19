import React, { useState } from 'react';
import { Plus, Check, Flame, AlertTriangle, X, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [sweetness, setSweetness] = useState('70%');
  const [ice, setIce] = useState('Less Ice');
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  const stockInfo = product.outletStock || { isOutOfStock: false, stockQuantity: 50 };
  const isOutOfStock = stockInfo.isOutOfStock || stockInfo.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && stockInfo.stockQuantity <= 10;

  const handleOpenCustomizer = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setShowCustomModal(true);
  };

  const confirmAddToCart = () => {
    addToCart(product, { sweetness, ice, quantity });
    setShowCustomModal(false);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <>
      <div
        onClick={handleOpenCustomizer}
        className={`group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99] sm:active:scale-100 ${
          isOutOfStock ? 'opacity-70 grayscale-[30%]' : ''
        }`}
      >
        <div>
          {/* Product Image */}
          <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            {/* Badges on Top */}
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
              {product.isVeg && (
                <span
                  className="w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs border border-emerald-600 flex items-center justify-center p-0.5 shadow-xs"
                  title="100% Vegetarian"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                  <Flame className="w-3 h-3 fill-white" />
                  <span>Bestseller</span>
                </span>
              )}
            </div>

            {/* Price Badge */}
            <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-md">
              ₹{product.price}
            </div>

            {/* Stock indicator badge */}
            {isOutOfStock ? (
              <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                Sold Out
              </div>
            ) : isLowStock ? (
              <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Only {stockInfo.stockQuantity} Left</span>
              </div>
            ) : null}
          </div>

          {/* Product Content */}
          <div className="p-4 sm:p-5 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-bubble-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {product.calories && (
              <div className="pt-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-400">
                ⚡ {product.calories}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Add Button */}
        <div className="p-4 sm:p-5 pt-0">
          <button
            type="button"
            onClick={handleOpenCustomizer}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : addedAnim
                ? 'bg-emerald-600 text-white'
                : 'bg-bubble-50 text-bubble-700 hover:bg-bubble-600 hover:text-white border border-bubble-200 hover:border-transparent shadow-xs'
            }`}
          >
            {isOutOfStock ? (
              <span>Unavailable</span>
            ) : addedAnim ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Customize & Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customization Modal / Mobile Bottom Sheet */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto animate-slide-up">
            
            {/* Mobile Drag Indicator Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-bubble-600 bg-bubble-50 px-2 py-0.5 rounded">
                  Drink Customization
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {product.name}
                </h3>
                <span className="text-sm font-extrabold text-bubble-700">₹{product.price}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sweetness Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Sweetness Level
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {['0%', '30%', '50%', '70%', '100%'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSweetness(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                      sweetness === lvl
                        ? 'bg-bubble-600 text-white border-bubble-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice Level Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Ice Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['No Ice', 'Less Ice', 'Regular Ice'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIce(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                      ice === lvl
                        ? 'bg-bubble-600 text-white border-bubble-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 shadow-xs active:scale-95"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-slate-900 w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 shadow-xs active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Confirm Button */}
            <button
              type="button"
              onClick={confirmAddToCart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bubble-600 to-purple-600 text-white font-extrabold text-sm shadow-bubble hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{product.price * quantity}</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
}
