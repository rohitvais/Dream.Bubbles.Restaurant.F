import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/customer/CartDrawer';
import OrderSuccessModal from './components/customer/OrderSuccessModal';
import CustomerHome from './pages/CustomerHome';
import OutletsPage from './pages/OutletsPage';

// Admin Portal
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import OutletManagement from './components/admin/OutletManagement';
import ProductManagement from './components/admin/ProductManagement';
import InventoryManagement from './components/admin/InventoryManagement';
import OrderManagement from './components/admin/OrderManagement';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  const handleOrderSuccess = (order, waUrl) => {
    setConfirmedOrder(order);
    setWhatsappUrl(waUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          {/* Customer Portal Routes */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/outlets" element={<OutletsPage />} />

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="outlets" element={<OutletManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </main>

      {/* Footer on Customer views */}
      {!isAdmin && <Footer />}

      {/* Cart Drawer */}
      <CartDrawer onOrderSuccess={handleOrderSuccess} />

      {/* Order Success Modal */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          whatsappUrl={whatsappUrl}
          onClose={() => {
            setConfirmedOrder(null);
            setWhatsappUrl(null);
          }}
        />
      )}

    </div>
  );
}
