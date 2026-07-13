import React from 'react';

export default function ReporterCleaned({ cleanedData = null }) {
  const cleanerName     = cleanedData?.cleanerName     ?? null;
  const cleanerAvatarUrl = cleanedData?.cleanerAvatarUrl ?? null;
  const cleanedPhotoUrl  = cleanedData?.cleanedPhotoUrl  ?? null;
  const initial = cleanerName ? cleanerName[0].toUpperCase() : null;

  return (
    <div className="flex flex-col h-full bg-white px-6 py-6">
      <div className="flex justify-center mt-6 mb-4">
        {cleanerAvatarUrl ? (
          <img src={cleanerAvatarUrl} alt="cleaner" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{initial ?? '?'}</span>
          </div>
        )}
      </div>
      <div className="text-center mb-6">
        <p className="text-2xl font-semibold text-gray-800">
          <span className="text-green-500">{cleanerName ?? '______'}</span> cleaned
        </p>
        <p className="text-2xl font-semibold text-gray-800">your report</p>
      </div>
      <div className="flex-1 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
        {cleanedPhotoUrl ? (
          <img src={cleanedPhotoUrl} alt="cleaned area" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">[ Cleaned photo will appear here ]</span>
        )}
      </div>
    </div>
  );
}