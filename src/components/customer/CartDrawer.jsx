import React, { useState } from 'react';
import {
  X,
  Trash2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Truck,
  Store,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOutlet } from '../../context/OutletContext';
import api from '../../api/apiClient';

export default function CartDrawer({ onOrderSuccess }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    setLastPlacedOrder,
  } = useCart();

  const { selectedOutlet } = useOutlet();

  const [orderType, setOrderType] = useState('Delivery'); // Delivery or Takeaway
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartOpen) return null;

  const deliveryFee = orderType === 'Delivery' ? 40 : 0;
  const finalTotal = cartSubtotal + deliveryFee;

  const handleWhatsAppOrder = async () => {
    if (!selectedOutlet) {
      setErrorMsg('Please select an outlet first.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your Name and Phone/WhatsApp number.');
      return;
    }
    if (orderType === 'Delivery' && !customerAddress.trim()) {
      setErrorMsg('Please enter your Delivery Address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const orderPayload = {
        outletId: selectedOutlet._id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        orderType,
        deliveryFee,
        specialInstructions: specialInstructions.trim(),
        channel: 'WhatsApp',
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sweetness: item.sweetness,
          ice: item.ice,
        })),
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        setLastPlacedOrder(res.data);
        clearCart();
        setIsCartOpen(false);

        // Open WhatsApp directly with prefilled receipt
        if (res.whatsappUrl) {
          window.open(res.whatsappUrl, '_blank');
        }

        if (onOrderSuccess) {
          onOrderSuccess(res.data, res.whatsappUrl);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-up sm:animate-none">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-bubble-100 text-bubble-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Your Boba Cart</h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {/* Selected Outlet banner */}
            {selectedOutlet ? (
              <div className="bg-bubble-50 border border-bubble-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-black text-bubble-900 truncate">
                    <MapPin className="w-3.5 h-3.5 text-bubble-600 shrink-0" />
                    <span className="truncate">{selectedOutlet.name}</span>
                  </div>
                  <p className="text-[11px] text-bubble-700/80 line-clamp-1 mt-0.5">
                    {selectedOutlet.address}
                  </p>
                </div>
                {/* Direct Call Outlet Button */}
                <a
                  href={`tel:${selectedOutlet.phone}`}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1 shadow-xs shrink-0 active:scale-95"
                  title="Call Outlet Directly"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Please select an outlet to route your order!</span>
              </div>
            )}

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="text-4xl">🧋</div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add delicious boba milk tea, sparkling fruit infusions, or crispy Asian cafe snacks!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors gap-2.5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                        <span className="bg-white border border-slate-200 px-1.5 py-0.2 rounded font-medium">
                          {item.sweetness}
                        </span>
                        <span className="bg-white border border-slate-200 px-1.5 py-0.2 rounded font-medium">
                          {item.ice}
                        </span>
                      </div>
                      <div className="font-black text-xs text-bubble-700 mt-1">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-xs font-bold text-slate-800 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-rose-500 hover:underline font-bold block ml-auto pt-1"
                >
                  Clear cart
                </button>
              </div>
            )}

            {/* Order Type and Customer Details */}
            {cartItems.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                
                {/* Order Type Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Order Delivery Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('Delivery')}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        orderType === 'Delivery'
                          ? 'border-bubble-600 bg-bubble-50 text-bubble-800 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-bubble-600" />
                      <span>Doorstep Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('Takeaway')}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        orderType === 'Takeaway'
                          ? 'border-bubble-600 bg-bubble-50 text-bubble-800 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Store className="w-4 h-4 text-bubble-600" />
                      <span>Self Takeaway</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Customer Information
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none"
                    required
                  />

                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Number for Order Updates *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none"
                    required
                  />

                  {orderType === 'Delivery' && (
                    <textarea
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Delivery Address (Flat/House No, Building, Street, Landmark) *"
                      rows={2}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none"
                      required
                    />
                  )}

                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Notes (e.g. less ice, extra straw, ring doorbell)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Bill Breakdown */}
                <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  {orderType === 'Delivery' && (
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-bubble-700">₹{finalTotal}</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Sticky Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-2.5 shadow-lg">
              
              {/* WhatsApp Order Option (Feature 3) */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs sm:text-sm shadow-md shadow-green-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>
                  {isSubmitting ? 'Sending Order...' : `Order on WhatsApp • ₹${finalTotal}`}
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* Calling Option to Outlet (Feature 4) */}
              {selectedOutlet?.phone && (
                <a
                  href={`tel:${selectedOutlet.phone}`}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call {selectedOutlet.name.split('-')[1] || 'Kitchen'} ({selectedOutlet.phone})</span>
                </a>
              )}

              <p className="text-[10px] text-center text-slate-400">
                1-tap orders sent directly to the barista via WhatsApp.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
