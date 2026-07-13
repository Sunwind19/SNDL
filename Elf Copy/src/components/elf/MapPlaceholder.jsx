import React from 'react';

/**
 * MapPlaceholder — used wherever Google Maps / Leaflet will be integrated later.
 * Styled to resemble the teal map tile seen in the Figma designs.
 */
export default function MapPlaceholder({ className = '' }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center text-teal-400 text-sm select-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, #b2e8e8 0%, #8dd3d3 40%, #a8dfd4 100%)',
      }}
    >
      <span className="opacity-60">[ Map loads here ]</span>
    </div>
  );
}