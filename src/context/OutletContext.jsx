import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';

const OutletContext = createContext();

export const OutletProvider = ({ children }) => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(() => {
    try {
      const saved = localStorage.getItem('dream_bubbles_outlet');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all active outlets
  const fetchOutlets = async (coords = userCoords) => {
    try {
      setLoading(true);
      if (coords && coords.lat && coords.lng) {
        const res = await api.getNearbyOutlets(coords.lat, coords.lng);
        if (res.success && res.data) {
          setOutlets(res.data);
          // If no outlet selected yet, select the closest one automatically
          if (!selectedOutlet && res.data.length > 0) {
            setSelectedOutlet(res.data[0]);
            localStorage.setItem('dream_bubbles_outlet', JSON.stringify(res.data[0]));
          }
        }
      } else {
        const res = await api.getOutlets({ active: 'true' });
        if (res.success && res.data) {
          setOutlets(res.data);
          if (!selectedOutlet && res.data.length > 0) {
            setSelectedOutlet(res.data[0]);
            localStorage.setItem('dream_bubbles_outlet', JSON.stringify(res.data[0]));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load outlets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Request user geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        fetchOutlets(coords);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        setIsLocating(false);
        // Fallback: Mumbai default coords for demo
        const fallback = { lat: 19.076, lng: 72.8777 };
        setUserCoords(fallback);
        fetchOutlets(fallback);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Change selected outlet
  const changeSelectedOutlet = (outlet) => {
    setSelectedOutlet(outlet);
    localStorage.setItem('dream_bubbles_outlet', JSON.stringify(outlet));
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  return (
    <OutletContext.Provider
      value={{
        outlets,
        selectedOutlet,
        changeSelectedOutlet,
        userCoords,
        detectLocation,
        isLocating,
        loading,
        refreshOutlets: fetchOutlets,
      }}
    >
      {children}
    </OutletContext.Provider>
  );
};

export const useOutlet = () => useContext(OutletContext);
