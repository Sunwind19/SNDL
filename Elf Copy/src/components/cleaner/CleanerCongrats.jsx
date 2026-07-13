import React, { useState } from 'react';

const DEFAULT_RESULT = { landName: null };

export default function CleanerCongrats({ resultData = DEFAULT_RESULT, sessionStats = { ba: 0, sa: 0, f: 0, weight: 0 }, onBackHome }) {
  const [landName, setLandName] = useState(resultData.landName ?? '');

  const totalAnimals = (sessionStats.ba || 0) + (sessionStats.sa || 0);
  const totalPlants  = sessionStats.f || 0;

  return (
    <div className="flex flex-col h-full">
      {/* Impact summary — upper portion */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 px-6"
        style={{ background: 'linear-gradient(160deg, #e8f5e9 0%, #e0f7fa 100%)' }}>
        <h2 className="text-green-800 font-black text-xl">🌿 Course Impact</h2>
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow border border-green-100">
            <span className="text-base font-bold text-green-700">🌿 Plants saved</span>
            <span className="text-3xl font-black text-green-600">{totalPlants}</span>
          </div>
          <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow border border-teal-100">
            <span className="text-base font-bold text-teal-700">🐾 Animals saved</span>
            <span className="text-3xl font-black text-teal-600">{totalAnimals}</span>
          </div>
          <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow border border-amber-100">
            <span className="text-base font-bold text-amber-700">⚖️ Trash collected</span>
            <span className="text-3xl font-black text-amber-600">{(sessionStats.weight || 0).toFixed(1)} kg</span>
          </div>
        </div>
      </div>

      {/* Congratulations panel */}
      <div className="bg-white rounded-t-3xl px-6 pt-5 pb-5 flex flex-col gap-3 shadow-inner">
        <div className="text-center">
          <p className="text-green-500 font-bold text-lg">Congratulations!</p>
          <p className="text-gray-700 text-base">You are the fairy of...</p>
        </div>

        <input
          type="text"
          value={landName}
          onChange={(e) => setLandName(e.target.value)}
          placeholder="create land's name"
          className="w-full border-b-2 border-gray-300 text-center text-gray-500 text-base py-1 outline-none focus:border-green-400 bg-transparent"
        />

        <button onClick={onBackHome} className="w-full bg-green-500 hover:bg-green-600 active:scale-95 transition-transform text-white font-bold py-4 rounded-2xl text-lg shadow mt-1">
          Back to home
        </button>
      </div>
    </div>
  );
}