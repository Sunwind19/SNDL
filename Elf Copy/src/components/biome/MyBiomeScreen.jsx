import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const BASE_URL = 'https://raw.githubusercontent.com/Sunwind19/biomeimages/main/';

export default function MyBiomeScreen({ onViewActivity }) {
  const [seeds, setSeeds] = useState(0);
  const [level, setLevel] = useState(0);
  const [statsId, setStatsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const mySpirit = 'espi1';

  const getUpgradeCost = (lv) => (lv < 10 ? 30 : lv < 20 ? 80 : 150);
  const nextCost = getUpgradeCost(level);
  const canUpgrade = seeds >= nextCost && level < 26;

  // Layers: stack images from 00 up to current level+1
  const imageLayers = Array.from({ length: level + 2 }, (_, i) =>
    `${BASE_URL}${String(i).padStart(2, '0')}.png`
  );

  // Fetch or create UserStats on mount
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const user = await base44.auth.me();
      const existing = await base44.entities.UserStats.filter({ user_email: user.email });
      if (existing.length > 0) {
        const s = existing[0];
        setStatsId(s.id);
        setSeeds(s.seeds ?? 0);
        setLevel(s.biome_level ?? 0);
      } else {
        // First time — create entry
        const created = await base44.entities.UserStats.create({
          user_email: user.email,
          seeds: 0,
          biome_level: 0,
        });
        setStatsId(created.id);
        setSeeds(0);
        setLevel(0);
      }
      setLoading(false);
    };
    loadStats();
  }, []);

  const handleUpgrade = async () => {
    if (!canUpgrade || !statsId) return;
    const newSeeds = seeds - nextCost;
    const newLevel = level + 1;
    setSeeds(newSeeds);
    setLevel(newLevel);
    await base44.entities.UserStats.update(statsId, {
      seeds: newSeeds,
      biome_level: newLevel,
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">

      {/* My activity button */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={onViewActivity}
          className="flex items-center gap-1.5 bg-green-400 hover:bg-green-500 active:scale-95 transition-all text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg"
        >
          My activity
        </button>
      </div>

      {/* Seed pill */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full px-4 py-2 shadow-lg">
          <span className="text-xl">🌱</span>
          <span className="text-lg font-black text-green-600">{seeds}</span>
        </div>
      </div>

      {/* Biome image layers */}
      <div className="flex-1 relative flex items-center justify-center">
        {imageLayers.map((url, index) => (
          <img
            key={url}
            src={url}
            className="absolute w-full h-full object-contain p-4 transition-opacity duration-1000"
            style={{ zIndex: index, opacity: 1 }}
          />
        ))}

        {/* Spirit overlay */}
        <img
          src={`${BASE_URL}${mySpirit}.png`}
          alt="My Spirit"
          className="absolute w-1/2 h-1/2 object-contain z-[100]"
          style={{
            bottom: '20%',
            filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))',
            animation: 'bounceSlow 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Upgrade button */}
      <div className="px-6 pb-12 pt-4 z-50">
        <button
          onClick={handleUpgrade}
          disabled={!canUpgrade}
          className={`w-full py-5 rounded-3xl text-white font-black text-xl shadow-2xl transition-all active:scale-95 ${
            canUpgrade ? 'bg-green-500 shadow-green-200' : 'bg-gray-300 opacity-60'
          }`}
        >
          {level >= 26
            ? 'ECOSYSTEM COMPLETE! 🌳'
            : canUpgrade
            ? 'UPGRADE BIOME'
            : `NEED ${nextCost - seeds} MORE 🌱`}
        </button>
      </div>

      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}