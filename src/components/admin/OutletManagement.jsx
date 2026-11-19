import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Search,
  CheckCircle,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import api from '../../api/apiClient';

export default function OutletManagement() {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Mumbai',
    phone: '',
    whatsappNumber: '',
    location: { lat: 19.076, lng: 72.8777 },
    openingHours: '10:00 AM - 11:30 PM',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    tags: 'Outdoor Seating, Free WiFi',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const res = await api.getOutlets();
      if (res.success) {
        setOutlets(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const openCreateModal = () => {
    setEditingOutlet(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      city: 'Mumbai',
      phone: '',
      whatsappNumber: '',
      location: { lat: 19.076, lng: 72.8777 },
      openingHours: '10:00 AM - 11:30 PM',
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      tags: 'Outdoor Seating, Free WiFi',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (outlet) => {
    setEditingOutlet(outlet);
    setFormData({
      name: outlet.name,
      code: outlet.code || '',
      address: outlet.address,
      city: outlet.city,
      phone: outlet.phone,
      whatsappNumber: outlet.whatsappNumber,
      location: {
        lat: outlet.location?.lat || 19.076,
        lng: outlet.location?.lng || 72.8777,
      },
      openingHours: outlet.openingHours || '10:00 AM - 11:30 PM',
      isActive: outlet.isActive !== undefined ? outlet.isActive : true,
      imageUrl: outlet.imageUrl || '',
      tags: outlet.tags ? outlet.tags.join(', ') : '',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSaveOutlet = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');

      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        tags: tagsArray,
        location: {
          lat: parseFloat(formData.location.lat) || 19.076,
          lng: parseFloat(formData.location.lng) || 72.8777,
        },
      };

      if (editingOutlet) {
        await api.updateOutlet(editingOutlet._id, payload);
      } else {
        await api.createOutlet(payload);
      }

      setShowModal(false);
      fetchOutlets();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save outlet.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOutlet = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete outlet "${name}"? This will also remove its inventory records.`)) {
      try {
        await api.deleteOutlet(id);
        fetchOutlets();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = async (outlet) => {
    try {
      await api.updateOutlet(outlet._id, { isActive: !outlet.isActive });
      fetchOutlets();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredOutlets = outlets.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Outlet Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Manage physical store locations, contact hotlines, WhatsApp numbers, and operating hours.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-bubble-600 to-purple-600 text-white font-extrabold text-xs shadow-bubble hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Outlet</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search outlets by name, city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none"
          />
        </div>

        <span className="text-[11px] text-slate-500 font-bold">
          {filteredOutlets.length} Outlets configured
        </span>
      </div>

      {/* Outlets Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-bubble-600 mb-1" />
            Loading outlets...
          </div>
        ) : filteredOutlets.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No outlets found.
          </div>
        ) : (
          filteredOutlets.map((outlet) => (
            <div
              key={outlet._id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={outlet.imageUrl}
                  alt={outlet.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-slate-900 text-xs truncate">
                    {outlet.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{outlet.city} • Code: {outlet.code || 'N/A'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleActive(outlet)}
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    outlet.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {outlet.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                <div className="line-clamp-2">{outlet.address}</div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-emerald-700 font-bold">📞 {outlet.phone}</span>
                  <span className="text-green-700 font-bold">💬 +{outlet.whatsappNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">🕒 {outlet.openingHours}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(outlet)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-bubble-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOutlet(outlet._id, outlet.name)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Outlets Table */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-bubble-600" />
            <span className="text-xs font-semibold">Loading outlets...</span>
          </div>
        ) : filteredOutlets.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No outlets found. Add one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Outlet Info</th>
                  <th className="px-6 py-4">City & Address</th>
                  <th className="px-6 py-4">Direct Call & WhatsApp</th>
                  <th className="px-6 py-4">Coordinates (Lat, Lng)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOutlets.map((outlet) => (
                  <tr key={outlet._id} className="hover:bg-slate-50/70 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={outlet.imageUrl}
                          alt={outlet.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{outlet.name}</div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Code: {outlet.code || 'N/A'} • {outlet.openingHours}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{outlet.city}</div>
                      <div className="text-[11px] text-slate-500 max-w-xs line-clamp-2">
                        {outlet.address}
                      </div>
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{outlet.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                        <span>+{outlet.whatsappNumber}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                        {outlet.location?.lat?.toFixed(4)}, {outlet.location?.lng?.toFixed(4)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(outlet)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                          outlet.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {outlet.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(outlet)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-bubble-600 hover:bg-bubble-50 transition-colors"
                          title="Edit Outlet"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOutlet(outlet._id, outlet.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Outlet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingOutlet ? 'Edit Outlet' : 'Create New Outlet'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveOutlet} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Outlet Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dream Bubbles - Bandra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Outlet Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. DB-BND-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone (For Direct Calls) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+919820123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="919820123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Opening Hours</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    placeholder="10:00 AM - 11:30 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, shop number, landmark..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Latitude (GPS) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.location.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, lat: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Longitude (GPS) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.location.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, lng: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Outdoor Seating, Free WiFi, Pet Friendly"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-bubble-600 focus:ring-bubble-500"
                />
                <label htmlFor="isActiveToggle" className="font-bold text-slate-700 cursor-pointer">
                  Outlet is Active and Accepting Orders
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-bubble-600 text-white font-bold hover:bg-bubble-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingOutlet ? 'Update Outlet' : 'Create Outlet'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
