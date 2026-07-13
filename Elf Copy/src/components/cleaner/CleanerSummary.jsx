import React from 'react';
import { base44 } from '@/api/base44Client';

function distanceMeters(a, b) {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
}

function parseNum(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

// Extract first number from a string message
function extractNumFromText(text) {
  if (!text) return 0;
  const match = String(text).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

// Try multiple key names, fallback to parsing the message text
function extractPlants(data) {
  const direct = data?.f ?? data?.plants ?? data?.plant_count ?? data?.num_plants ?? data?.total_plants;
  if (direct !== undefined && direct !== null) return parseNum(direct);
  return extractNumFromText(data?.plant_message);
}

function extractSmallAnimals(data) {
  const direct = data?.sa ?? data?.small_animals ?? data?.small_animal_count ?? data?.num_small_animals;
  if (direct !== undefined && direct !== null) return parseNum(direct);
  // Try to find 'small' in wildlife_message
  const msg = data?.wildlife_message || '';
  const match = msg.match(/(\d+)\s*small/i);
  return match ? parseInt(match[1]) : 0;
}

function extractBigAnimals(data) {
  const direct = data?.ba ?? data?.big_animals ?? data?.large_animals ?? data?.num_big_animals;
  if (direct !== undefined && direct !== null) return parseNum(direct);
  // Try to find 'big' or 'large' in wildlife_message
  const msg = data?.wildlife_message || '';
  const match = msg.match(/(\d+)\s*(big|large)/i);
  return match ? parseInt(match[1]) : 0;
}

export default function CleanerSummary({ summaryData = null, currentGps = null, reportLocation = null, onClaim }) {
  const [isClaimed, setIsClaimed] = React.useState(false);
  const weightKg     = summaryData?.total_weight_kg  ?? null;
  const plantMsg     = summaryData?.plant_message    ?? null;
  const wildlifeMsg  = summaryData?.wildlife_message ?? null;
  const earnedSeeds  = summaryData?.earned_seeds     ?? null;

  // Log full API response for debugging
  React.useEffect(() => {
    if (summaryData) console.log('[CleanerSummary] Full summaryData:', JSON.stringify(summaryData));
  }, [summaryData]);

  const newPlants       = extractPlants(summaryData);
  const newSmallAnimals = extractSmallAnimals(summaryData);
  const newBigAnimals   = extractBigAnimals(summaryData);

  const handleClaim = async () => {
    if (isClaimed) return;
    setIsClaimed(true);
    if (!currentGps || !reportLocation) {
      alert('GPS location not available. Please wait...');
      return;
    }

    try {
      const user = await base44.auth.me();
      if (!user) {
        alert("Please log in to save your ranking!");
        onClaim && onClaim(earnedSeeds);
        return;
      }

      // 1. 기존 데이터가 있는지 확인
      const existing = await base44.entities.UserStats.filter({ user_email: user.email });
      
      const updatedPlants = newPlants;
      const updatedSmall = newSmallAnimals;
      const updatedBig = newBigAnimals;
      const totalSavedThisTime = updatedPlants + updatedSmall + updatedBig;

      if (existing.length > 0) {
        // [기존 유저] 기존 값에 더하기
        const s = existing[0];
        const newTotalSaved = (s.saved ?? 0) + totalSavedThisTime;
        
        await base44.entities.UserStats.update(s.id, {
          total_plants: (s.total_plants ?? 0) + updatedPlants,
          total_small_animals: (s.total_small_animals ?? 0) + updatedSmall,
          total_big_animals: (s.total_big_animals ?? 0) + updatedBig,
          saved: newTotalSaved, // 랭킹용 통합 필드
          seeds: (s.seeds ?? 0) + (earnedSeeds ?? 0)
        });
      } else {
        // [신규 유저] 처음으로 레코드 생성 (이게 빠져있어서 연동이 안 됐던 것!)
        await base44.entities.UserStats.create({
          user_email: user.email,
          total_plants: updatedPlants,
          total_small_animals: updatedSmall,
          total_big_animals: updatedBig,
          saved: totalSavedThisTime,
          seeds: earnedSeeds ?? 0,
          biome_level: 1
        });
      }
      
      console.log("Data successfully synced to Hall of Fame!");
    } catch (e) {
      console.error('Data sync failed:', e);
    }
    
    onClaim && onClaim(earnedSeeds ?? 0);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Weight strip — ~1/8 height */}
      <div className="flex items-center justify-center px-4 py-3 bg-gray-100 border-b border-gray-200 shrink-0" style={{ minHeight: '12.5%' }}>
        {weightKg !== null ? (
          <span className="text-black text-2xl font-bold">{weightKg} <span className="text-base font-semibold">kg collected</span></span>
        ) : (
          <span className="text-gray-400 text-base italic">Awaiting weight data...</span>
        )}
      </div>

      {/* Plant message */}
      <div className="flex-1 flex items-center justify-center px-6 py-6" style={{ background: 'rgba(134, 239, 172, 0.35)' }}>
        {plantMsg ? (
          <p className="text-green-700 text-center text-base leading-relaxed font-medium">{plantMsg}</p>
        ) : (
          <p className="text-green-300 text-center text-sm italic">Awaiting plant analysis...</p>
        )}
      </div>

      {/* Wildlife message */}
      <div className="flex-1 flex items-center justify-center px-6 py-6" style={{ background: 'rgba(134, 239, 172, 0.20)' }}>
        {wildlifeMsg ? (
          <p className="text-green-700 text-center text-base leading-relaxed font-medium">{wildlifeMsg}</p>
        ) : (
          <p className="text-green-300 text-center text-sm italic">Awaiting wildlife analysis...</p>
        )}
      </div>

      {/* Claim button */}
      <div className="px-5 py-4 bg-white shrink-0">
        <button
          onClick={handleClaim}
          disabled={isClaimed}
          className={`w-full font-bold py-4 rounded-2xl text-xl shadow transition-all active:scale-95 ${
            isClaimed ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isClaimed ? 'Already Claimed' : (earnedSeeds !== null ? `Claim ${earnedSeeds} seeds` : 'Claim ___ seeds')}
        </button>
      </div>

    </div>
  );
}