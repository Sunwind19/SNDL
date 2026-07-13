import React from 'react';

const AREAS = [
  { id: 'mountain', label: 'Fairy of Mountain', bg: 'bg-green-400' },
  { id: 'forest',   label: 'Fairy of Forest',   bg: 'bg-cyan-300'  },
  { id: 'flat',     label: 'Fairy of Flat',      bg: 'bg-yellow-700' },
];

export default function CleanerAreaSelect({ selectedArea, onSelect }) {
  return (
    <div className="flex flex-col h-full bg-white px-6 py-8 justify-center gap-4">
      <h2 className="text-center text-green-400 text-xl font-medium mb-4">
        What area will you<br />be the cleaning fairy?
      </h2>
      {AREAS.map(({ id, label, bg }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`w-full py-7 rounded-2xl text-white text-2xl font-bold shadow-md transition-all active:scale-95 ${bg} ${selectedArea === id ? 'ring-4 ring-offset-2 ring-white' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}