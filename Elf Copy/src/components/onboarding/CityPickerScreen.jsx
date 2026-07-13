import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Loader2, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Large list of world cities
const WORLD_CITIES = [
  { city: 'Seoul', country: 'South Korea' },
  { city: 'Busan', country: 'South Korea' },
  { city: 'Jeju', country: 'South Korea' },
  { city: 'Aewol', country: 'South Korea' },
  { city: 'Incheon', country: 'South Korea' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Osaka', country: 'Japan' },
  { city: 'Kyoto', country: 'Japan' },
  { city: 'New York', country: 'USA' },
  { city: 'Los Angeles', country: 'USA' },
  { city: 'Chicago', country: 'USA' },
  { city: 'San Francisco', country: 'USA' },
  { city: 'Miami', country: 'USA' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Manchester', country: 'United Kingdom' },
  { city: 'Paris', country: 'France' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Munich', country: 'Germany' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Milan', country: 'Italy' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Beijing', country: 'China' },
  { city: 'Shanghai', country: 'China' },
  { city: 'Shenzhen', country: 'China' },
  { city: 'Hong Kong', country: 'China' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'Jakarta', country: 'Indonesia' },
  { city: 'Kuala Lumpur', country: 'Malaysia' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Abu Dhabi', country: 'UAE' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Johannesburg', country: 'South Africa' },
  { city: 'São Paulo', country: 'Brazil' },
  { city: 'Rio de Janeiro', country: 'Brazil' },
  { city: 'Buenos Aires', country: 'Argentina' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Bogotá', country: 'Colombia' },
  { city: 'Lima', country: 'Peru' },
  { city: 'Santiago', country: 'Chile' },
  { city: 'Moscow', country: 'Russia' },
  { city: 'Istanbul', country: 'Turkey' },
  { city: 'Taipei', country: 'Taiwan' },
  { city: 'Ho Chi Minh City', country: 'Vietnam' },
  { city: 'Hanoi', country: 'Vietnam' },
  { city: 'Manila', country: 'Philippines' },
  { city: 'Karachi', country: 'Pakistan' },
  { city: 'Dhaka', country: 'Bangladesh' },
  { city: 'Colombo', country: 'Sri Lanka' },
  { city: 'Kathmandu', country: 'Nepal' },
];

export default function CityPickerScreen({ onComplete }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  const filtered = query.length >= 1
    ? WORLD_CITIES.filter(c =>
        `${c.city} ${c.country}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = (item) => {
    setSelected(item);
    setQuery(`${item.city}, ${item.country}`);
    setShowDropdown(false);
  };

  const handleGps = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
          const country = data.address?.country || '';
          if (city && country) {
            const item = { city, country };
            setSelected(item);
            setQuery(`${city}, ${country}`);
          }
        } catch {
          // silently fail
        }
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { timeout: 8000 }
    );
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    await base44.auth.updateMe({ city: selected.city, country: selected.country });
    setSaving(false);
    onComplete();
  };

  return (
    <div
      className="flex flex-col h-full px-6 py-10 justify-between"
      style={{ background: 'linear-gradient(160deg, #e8f5e9 0%, #f0fdf4 50%, #e0f2fe 100%)' }}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mt-4">
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-2xl font-black text-green-800">Where are you from?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Help us rank your ecosystem impact in your city & country.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow border border-gray-100">
            <Globe size={18} className="text-green-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search city or country..."
              className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
            />
            {query.length > 0 && (
              <button onClick={() => { setQuery(''); setSelected(null); }} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-left transition-colors border-b border-gray-50 last:border-0"
                >
                  <MapPin size={14} className="text-green-400 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{item.city}</span>
                    <span className="text-xs text-gray-400 ml-1">{item.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS button */}
        <button
          onClick={handleGps}
          disabled={gpsLoading}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-dashed border-green-300 rounded-2xl py-3 text-green-600 font-semibold text-sm hover:bg-green-50 active:scale-95 transition-all disabled:opacity-60"
        >
          {gpsLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MapPin size={16} />
          )}
          {gpsLoading ? 'Detecting location...' : 'Use Current Location'}
        </button>

        {/* Selected preview */}
        {selected && (
          <div className="bg-green-500 rounded-2xl px-4 py-3 flex items-center gap-3 shadow">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-white font-bold">{selected.city}</p>
              <p className="text-green-100 text-xs">{selected.country}</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!selected || saving}
        className="w-full bg-green-500 text-white font-black text-xl py-5 rounded-3xl shadow-xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {saving ? <Loader2 size={20} className="animate-spin" /> : null}
        {saving ? 'Saving...' : 'Continue →'}
      </button>
    </div>
  );
}