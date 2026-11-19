import React from 'react';
import { CheckCircle2, MessageCircle, Phone, MapPin, X, ArrowRight, Clock } from 'lucide-react';

export default function OrderSuccessModal({ order, whatsappUrl, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 p-5 sm:p-6 space-y-5 animate-slide-up relative max-h-[90vh] overflow-y-auto">
        
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
            Order Sent to Kitchen
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Order #{order.orderNumber}
          </h3>
          <p className="text-xs text-slate-500">
            Thank you, {order.customerName}! Your order is being confirmed.
          </p>
        </div>

        {/* Order Details Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-600">Kitchen Outlet</span>
            <span className="font-black text-slate-900">{order.outlet?.name}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-600">Order Delivery Mode</span>
            <span className="font-extrabold text-bubble-700">{order.orderType}</span>
          </div>

          <div className="space-y-1 pt-1">
            <span className="font-bold text-slate-700 block text-[10px] uppercase">Items:</span>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-600">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold">₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
            <span>Total Payable</span>
            <span className="text-emerald-700">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* WhatsApp Direct Re-trigger */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold text-xs shadow-md shadow-green-600/20 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open in WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Call Outlet */}
          {order.outlet?.phone && (
            <a
              href={`tel:${order.outlet.phone}`}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Outlet: {order.outlet.phone}</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
}
