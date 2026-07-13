import React, { useState } from 'react';
import { Clock, Zap, Shield, Star } from 'lucide-react';

const MISSIONS = [
  {
    mins: 30,
    title: 'Quick Boost',
    icon: Zap,
    color: 'from-lime-400 to-green-400',
    border: 'border-lime-400',
    bg: 'bg-lime-50',
    sub: 'A light walk to protect your neighborhood.',
    emoji: '⚡',
  },
  {
    mins: 60,
    title: 'Eco Guardian',
    icon: Shield,
    color: 'from-green-400 to-teal-400',
    border: 'border-green-500',
    bg: 'bg-green-50',
    sub: 'Deep dive into local ecosystem restoration.',
    emoji: '🛡️',
  },
  {
    mins: 90,
    title: 'Nature Hero',
    icon: Star,
    color: 'from-teal-400 to-emerald-500',
    border: 'border-teal-500',
    bg: 'bg-teal-50',
    sub: 'Full-scale mission for maximum impact!',
    emoji: '🌟',
  },
];

export default function MissionSelectScreen({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handlePick = (mins) => {
    setSelected(mins);
    setTimeout(() => onSelect(mins), 250);
  };

  return (
    <div
      className="flex flex-col h-full px-5 py-8 gap-6 overflow-hidden"
      style={{ background: '#F0F9F4' }}
    >
      {/* Header */}
      <div className="text-center pt-2">
        <div className="text-4xl mb-3">🌿</div>
        <h1 className="text-2xl font-black text-green-900 leading-tight">
          How much time do<br />you have today?
        </h1>
        <p className="text-sm text-green-600 mt-2 font-medium">
          Every minute helps restore Jeju's ecosystem.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {MISSIONS.map(({ mins, title, icon: Icon, color, border, bg, sub, emoji }) => {
          const isSelected = selected === mins;
          return (
            <button
              key={mins}
              onClick={() => handlePick(mins)}
              className={`w-full rounded-3xl border-2 px-5 py-5 flex items-center gap-4 shadow-md transition-all duration-200 active:scale-95 text-left
                ${isSelected ? `${border} ${bg} scale-[1.02] shadow-xl` : 'border-gray-100 bg-white hover:scale-[1.01] hover:shadow-lg'}`}
            >
              {/* Icon circle */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow`}>
                <span className="text-2xl">{emoji}</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-black text-gray-800">{title}</p>
                  <span className="text-xs font-bold bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Clock size={10} />
                    {mins} min
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
              </div>

              {/* Check */}
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-green-400 font-medium pb-2">
        🌱 Tap a mission to begin your eco journey
      </p>
    </div>
  );
}