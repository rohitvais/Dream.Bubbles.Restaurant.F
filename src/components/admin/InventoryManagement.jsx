import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import api from '../../api/apiClient';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutletId, setSelectedOutletId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [modifiedItems, setModifiedItems] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const outletRes = await api.getOutlets();
      if (outletRes.success && outletRes.data.length > 0) {
        setOutlets(outletRes.data);
        if (!selectedOutletId) {
          setSelectedOutletId(outletRes.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    if (!selectedOutletId) return;
    try {
      setLoading(true);
      const res = await api.getInventory({
        outletId: selectedOutletId,
        lowStockOnly: lowStockOnly ? 'true' : 'false',
        search: searchTerm,
      });
      if (res.success) {
        setInventory(res.data);
        setModifiedItems({});
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

  useEffect(() => {
    fetchInventory();
  }, [selectedOutletId, lowStockOnly, searchTerm]);

  const handleStockChange = (item, newQuantity) => {
    const qty = Math.max(0, parseInt(newQuantity, 10) || 0);
    const isOut = qty === 0;

    setModifiedItems((prev) => ({
      ...prev,
      [item._id]: {
        ...prev[item._id],
        id: item._id,
        stockQuantity: qty,
        isOutOfStock: isOut,
      },
    }));

    setInventory((prev) =>
      prev.map((row) =>
        row._id === item._id ? { ...row, stockQuantity: qty, isOutOfStock: isOut } : row
      )
    );
  };

  const handleToggleOutOfStock = (item) => {
    const currentOut = modifiedItems[item._id]?.isOutOfStock ?? item.isOutOfStock;
    const newOut = !currentOut;

    setModifiedItems((prev) => ({
      ...prev,
      [item._id]: {
        ...prev[item._id],
        id: item._id,
        stockQuantity: newOut ? 0 : (item.stockQuantity || 20),
        isOutOfStock: newOut,
      },
    }));

    setInventory((prev) =>
      prev.map((row) =>
        row._id === item._id
          ? {
              ...row,
              isOutOfStock: newOut,
              stockQuantity: newOut ? 0 : (row.stockQuantity || 20),
            }
          : row
      )
    );
  };

  const handleSaveAll = async () => {
    const updates = Object.values(modifiedItems);
    if (updates.length === 0) return;

    try {
      setSavingBatch(true);
      await api.batchUpdateInventory(updates);
      setFeedbackMsg(`Successfully saved stock for ${updates.length} items!`);
      setModifiedItems({});
      setTimeout(() => setFeedbackMsg(''), 4000);
      fetchInventory();
    } catch (err) {
      alert(err.message || 'Failed to save inventory updates.');
    } finally {
      setSavingBatch(false);
    }
  };

  const handleSyncInventory = async () => {
    try {
      setSyncing(true);
      const res = await api.syncInventory();
      alert(res.message);
      fetchInventory();
    } catch (err) {
      alert(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const modifiedCount = Object.keys(modifiedItems).length;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-16 sm:pb-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Monitor and adjust stock levels per outlet in real-time. Changes instantly reflect on the customer ordering portal.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleSyncInventory}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Layers className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync Catalog</span>
          </button>

          {modifiedCount > 0 && (
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={savingBatch}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xs shadow-md shadow-green-600/20 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save ({modifiedCount}) Changes</span>
            </button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Outlet Selector & Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-soft">
        
        {/* Outlet Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Kitchen:
          </span>
          <select
            value={selectedOutletId}
            onChange={(e) => setSelectedOutletId(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 font-extrabold text-xs rounded-xl px-3 py-2 text-slate-800 focus:ring-1 focus:ring-bubble-500 focus:outline-none"
          >
            {outlets.map((outlet) => (
              <option key={outlet._id} value={outlet._id}>
                {outlet.name} ({outlet.city})
              </option>
            ))}
          </select>
        </div>

        {/* Search & Low Stock Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border whitespace-nowrap shrink-0 ${
              lowStockOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Low Stock Warnings</span>
            <span className="sm:hidden">Low Stock</span>
          </button>
        </div>

      </div>

      {/* Mobile Inventory Cards View */}
      <div className="block sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-bubble-600 mb-1" />
            Loading stock records...
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-1">
            <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No inventory records found.</p>
          </div>
        ) : (
          inventory.map((item) => {
            const p = item.product;
            const currentStock = item.stockQuantity;
            const isOut = item.isOutOfStock || currentStock <= 0;
            const isLow = !isOut && currentStock <= item.lowStockThreshold;

            return (
              <div
                key={item._id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs text-slate-900 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400">₹{p.price} • Alert at {item.lowStockThreshold}</div>
                  </div>
                  {isOut ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-100 text-rose-800">
                      Sold Out
                    </span>
                  ) : isLow ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Stock Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStockChange(item, currentStock - 5)}
                      className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStockChange(item, currentStock - 1)}
                      className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]"
                    >
                      -1
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={currentStock}
                      onChange={(e) => handleStockChange(item, e.target.value)}
                      className="w-14 px-1.5 py-1 text-center rounded-lg border border-slate-200 font-black text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleStockChange(item, currentStock + 1)}
                      className="px-2 py-1 rounded-lg bg-bubble-50 text-bubble-700 font-bold text-[10px]"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStockChange(item, currentStock + 5)}
                      className="px-2 py-1 rounded-lg bg-bubble-50 text-bubble-700 font-bold text-[10px]"
                    >
                      +5
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleOutOfStock(item)}
                    className={`px-2 py-1 rounded-lg text-[9px] font-bold border ${
                      item.isOutOfStock
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.isOutOfStock ? 'Set In Stock' : 'Force Out'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Inventory Table */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-bubble-600" />
            <span className="text-xs font-semibold">Loading outlet inventory...</span>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs space-y-2">
            <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No inventory records found for this outlet.</p>
            <button
              onClick={handleSyncInventory}
              className="text-bubble-600 font-bold hover:underline"
            >
              Click here to sync inventory with all products
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Adjust Stock (+ / -)</th>
                  <th className="px-6 py-4">Status Indicator</th>
                  <th className="px-6 py-4 text-right">Out of Stock Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => {
                  const p = item.product;
                  const isModified = !!modifiedItems[item._id];
                  const currentStock = item.stockQuantity;
                  const isOut = item.isOutOfStock || currentStock <= 0;
                  const isLow = !isOut && currentStock <= item.lowStockThreshold;

                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors ${
                        isModified ? 'bg-amber-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">{p.name}</div>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Threshold: {item.lowStockThreshold} units
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700">
                        ₹{p.price}
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) => handleStockChange(item, e.target.value)}
                          className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 font-extrabold text-slate-900 text-xs focus:ring-1 focus:ring-bubble-500"
                        />
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStockChange(item, currentStock - 10)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                          >
                            -10
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockChange(item, currentStock - 1)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockChange(item, currentStock + 1)}
                            className="px-2 py-1 rounded-lg bg-bubble-50 hover:bg-bubble-100 text-bubble-700 font-bold text-[10px]"
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockChange(item, currentStock + 10)}
                            className="px-2 py-1 rounded-lg bg-bubble-50 hover:bg-bubble-100 text-bubble-700 font-bold text-[10px]"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Status indicator */}
                      <td className="px-6 py-4">
                        {isOut ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                            Sold Out
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Manual Out of Stock Toggle */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleOutOfStock(item)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                            item.isOutOfStock
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {item.isOutOfStock ? 'Mark In Stock' : 'Force Out of Stock'}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
