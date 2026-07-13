import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Temporary navigation button for prototype review.
 * Cycles through all app screens in order.
 * Remove before production.
 */
export default function NextScreenButton({ onNext, label }) {
  return (
    <button
      onClick={onNext}
      className="absolute z-50 bg-black bg-opacity-75 text-white rounded-full px-2.5 py-1.5 text-xs flex items-center gap-0.5 shadow-lg"
      style={{ bottom: '68px', right: '10px' }}
    >
      <span className="max-w-[110px] truncate">{label}</span>
      <ChevronRight size={12} />
    </button>
  );
}