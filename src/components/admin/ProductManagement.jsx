import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  X,
  Flame,
  RefreshCw,
  Coffee,
} from 'lucide-react';
import api from '../../api/apiClient';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: 'https://images.unsplash.com/photo-1558857563-b37cf5a7304f?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isBestseller: false,
    calories: '250 kcal',
    tags: 'Bestseller, Boba',
    isAvailable: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);

      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (!formData.category && catRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: catRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0]._id : '',
      description: '',
      price: '',
      image: 'https://images.unsplash.com/photo-1558857563-b37cf5a7304f?auto=format&fit=crop&w=600&q=80',
      isVeg: true,
      isBestseller: false,
      calories: '250 kcal',
      tags: 'Bestseller, Boba',
      isAvailable: true,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      description: product.description || '',
      price: product.price,
      image: product.image || '',
      isVeg: product.isVeg !== undefined ? product.isVeg : true,
      isBestseller: product.isBestseller || false,
      calories: product.calories || '',
      tags: product.tags ? product.tags.join(', ') : '',
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');

      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        tags: tagsArray,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
      } else {
        await api.createProduct(payload);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Delete product "${name}"? This will also remove its inventory entries across all outlets.`)) {
      try {
        await api.deleteProduct(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q));

    const matchesCat =
      selectedCategory === 'all' ||
      (p.category && (p.category._id === selectedCategory || p.category === selectedCategory));

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Products Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Configure menu drinks, prices, categories, calorie markers, and vegetarian dietary badges.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-bubble-600 to-purple-600 text-white font-extrabold text-xs shadow-bubble hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-bubble-500 focus:outline-none"
          />
        </div>

        {/* Category Filter Select */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl px-3 py-2 focus:ring-1 focus:ring-bubble-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Products Cards View */}
      <div className="block sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-bubble-600 mb-1" />
            Loading menu items...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No products match the filter.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                  <span>{p.name}</span>
                  {p.isBestseller && (
                    <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-1 rounded">
                      ★
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-purple-700 font-bold">{p.category?.name || 'Drink'}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-black text-xs text-slate-900">₹{p.price}</span>
                  {p.isVeg ? (
                    <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                      Veg
                    </span>
                  ) : (
                    <span className="text-[9px] text-rose-700 font-bold bg-rose-50 px-1 rounded">
                      Non-Veg
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(p)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-bubble-600"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(p._id, p.name)}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Products Table */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-bubble-600" />
            <span className="text-xs font-semibold">Loading menu items...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No products found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Dietary & Tags</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isBestseller && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                                Bestseller
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-lg">
                        {p.category?.name || 'Beverage'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-black text-slate-900 text-sm">
                      ₹{p.price}
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        {p.isVeg ? (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            🌱 Veg
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            Non-Veg
                          </span>
                        )}
                        {p.calories && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {p.calories}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {p.isAvailable ? 'Available' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-bubble-600 hover:bg-bubble-50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
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
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
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

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tiger Brown Sugar Boba Milk"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="249"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, flavors, textures..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Calories Tag</label>
                  <input
                    type="text"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="280 kcal"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Bestseller, Chewy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="rounded text-bubble-600 focus:ring-bubble-500"
                  />
                  <span>100% Vegetarian</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-bubble-600 focus:ring-bubble-500"
                  />
                  <span>Active & In Menu</span>
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
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
