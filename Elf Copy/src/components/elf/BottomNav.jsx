import React from 'react';
import { Camera, Recycle, Trophy, Leaf, Home } from 'lucide-react';

const TABS = [
  { id: 'reporter',     label: 'Reporter',  icon: Camera  },
  { id: 'cleaner',      label: 'Cleaner',   icon: Recycle },
  { id: 'plan',         label: 'Home',      icon: Home, center: true },
  { id: 'leaderboard',  label: 'Ranks',     icon: Trophy  },
  { id: 'biome',        label: 'My Biome',  icon: Leaf    },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="flex border-t border-gray-200 bg-white shrink-0 items-end">
      {TABS.map((tab) => {
        const TabIcon = tab.icon;
        const isActive = activeTab === tab.id;
        if (tab.center) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center pb-2 gap-0.5 text-xs font-medium transition-all"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all ${
                isActive ? 'bg-green-500 scale-110' : 'bg-green-400'
              }`}>
                <TabIcon size={24} className="text-white" />
              </div>
              <span className={isActive ? 'text-green-500' : 'text-gray-400'}>{tab.label}</span>
            </button>
          );
        }
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <TabIcon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}