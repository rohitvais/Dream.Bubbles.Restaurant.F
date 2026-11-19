import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Coffee,
  Boxes,
  ClipboardList,
  ArrowLeft,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Outlet Management', path: '/admin/outlets', icon: Store },
    { name: 'Products Management', path: '/admin/products', icon: Coffee },
    { name: 'Inventory Management', path: '/admin/inventory', icon: Boxes },
    { name: 'Order Management', path: '/admin/orders', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🧋</span>
            <div>
              <span className="font-extrabold text-sm text-white">Dream Bubbles</span>
              <span className="ml-1 text-[9px] bg-bubble-950 text-bubble-300 font-bold px-1.5 py-0.2 rounded border border-bubble-800">
                Admin
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-bold bg-slate-800 px-2.5 py-1 rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer View</span>
        </Link>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1 z-30 animate-fade-in shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-bubble-600 text-white shadow-bubble shadow-bubble-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-shrink-0 flex-col justify-between border-r border-slate-800 sticky top-0 h-screen">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧋</span>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  Dream Bubbles
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-bubble-400 bg-bubble-950/70 px-2 py-0.5 rounded-md border border-bubble-800/60">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-bubble-600 text-white shadow-bubble shadow-bubble-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher to Customer Portal */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
