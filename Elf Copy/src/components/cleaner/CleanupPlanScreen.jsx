import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const BIG_ANIMALS   = ["Roe Deer", "Hedgehog", "Elk","Beaver"];
const SMALL_ANIMALS = ["Sparrow", "Tree Frog", "Honey Bee", "Baby Hedgehog", "Squirrel"];
const PLANTS        = ["Dandelion", "Clover", "Rape Flower", "Violet", "Daisy Fleabane"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// [신규] CleanerSummary에서 가져온 똑똑한 숫자 추출기
function parseNum(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function extractNumFromText(text) {
  if (!text) return 0;
  const match = String(text).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

const IMPACT_CARDS = [
  { id: 'ba', emoji: '🦌', label: 'Big Animals', color: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'amber-700' },
  { id: 'sa', emoji: '🐿️', label: 'Small Animals', color: 'from-teal-50 to-cyan-50', border: 'border-teal-200', text: 'teal-700' },
  { id: 'f',  emoji: '🌿', label: 'Plants', color: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'green-700' },
];

export default function CleanupPlanScreen({ reportData = {}, onStartCleanup }) {
  const [names] = useState(() => ({
    big: pick(BIG_ANIMALS), small: pick(SMALL_ANIMALS), plant: pick(PLANTS),
  }));

  const [currentMapUrl, setCurrentMapUrl] = useState('');
  const [totalImpact, setTotalImpact] = useState({ ba: 0, sa: 0, f: 0 }); 
  const API_KEY = "AIzaSyDV1pEVuFHkV_uZ1SLG6mZhB-IyOACXq8A";

  useEffect(() => {
    const initializeDashboard = async () => {
      let lat = reportData?.location?.lat;
      let lng = reportData?.location?.lng;

      if (!lat) {
      try {
        const pos = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, {
            enableHighAccuracy: true, // 정확도 높임
            timeout: 10000,           // 5초에서 10초로 늘려줘 (실내 대비)
            maximumAge: 60000         // 1분 이내의 캐시된 위치 정보가 있다면 활용
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) {
        console.warn("위치 정보를 가져오지 못했습니다. 기본 위치(제주)를 사용합니다.", e);
        // 여기서 다른 지역 유저를 위해 기본값을 설정하거나, 
        // "위치 권한을 허용해주세요" 라는 안내를 띄우는 게 나아.
        lat = 33.3617; lng = 126.5292; 
      }
    }

      try {
        const records = await base44.entities.DetectionLog.list();
        let sumBA = 0, sumSA = 0, sumF = 0;
        let markersString = '';

        if (records && records.length > 0) {
          records.forEach(r => {
            // [강화된 데이터 추출 로직]
            // DB 컬럼 직접 확인 -> raw_counts 확인 -> 텍스트 메시지 안의 숫자 확인 순서로 뒤집니다.
            const counts = typeof r.raw_counts === 'string' ? JSON.parse(r.raw_counts || '{}') : (r.raw_counts || {});
            
            // 1. Plants (f)
            const fVal = parseNum(r.f ?? counts.f ?? counts.plants) || extractNumFromText(r.plant_message || counts.plant_message);
            // 2. Small Animals (sa)
            const saVal = parseNum(r.sa ?? counts.sa ?? counts.small_animals) || (r.wildlife_message?.match(/(\d+)\s*small/i)?.[1] || 0);
            // 3. Big Animals (ba)
            const baVal = parseNum(r.ba ?? counts.ba ?? counts.big_animals) || (r.wildlife_message?.match(/(\d+)\s*(big|large)/i)?.[1] || 0);

            sumF  += Number(fVal);
            sumSA += Number(saVal);
            sumBA += Number(baVal);

            if (r.latitude && r.longitude) {
              markersString += `&markers=color:orange|size:tiny|${r.latitude},${r.longitude}`;
            }
          });
          
          setTotalImpact({ ba: sumBA, sa: sumSA, f: sumF });
        }

        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=640x640&maptype=hybrid${markersString.substring(0, 1500)}&markers=color:red|label:U|${lat},${lng}&key=${API_KEY}`;
        setCurrentMapUrl(url);
      } catch (e) {
        console.error("Dashboard Sync Error:", e);
      }
    };

    initializeDashboard();
  }, [reportData]);

  // 최종 노출 데이터 결정
  const finalBA = (reportData?.ba ?? totalImpact.ba) || 0;
  const finalSA = (reportData?.sa ?? totalImpact.sa) || 0;
  const finalF  = (reportData?.f  ?? totalImpact.f)  || 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* (중략: 상단 지도 영역은 동일) */}
      <div className="h-2/5 relative bg-gray-200 shrink-0 overflow-hidden">
        {currentMapUrl ? (
          <div className="relative w-full h-full">
            <img src={currentMapUrl} alt="Eco Map" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-green-600/80 backdrop-blur-md px-3 py-1 rounded-full border border-green-400">
              <span className="text-[10px] text-white font-bold">🍃 ZERO-JS ECO MAP</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-green-50">
            <p className="text-green-700 text-sm font-bold animate-pulse">Syncing Gaia Data...</p>
          </div>
        )}
      </div>

      <div className="h-3/5 flex flex-col px-4 pt-4 pb-4 gap-3 overflow-hidden" style={{ background: 'linear-gradient(160deg, #e8f5e9 0%, #e0f7fa 50%, #e0f2fe 100%)' }}>
        <h2 className="text-center text-green-800 font-black text-base shrink-0">
          {reportData?.ba ? "New discovery! They need help:" : "Current Regional Threats:"}
        </h2>

        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {IMPACT_CARDS.map(({ color, border, text, id }, i) => {
            const counts = [finalBA, finalSA, finalF];
            const nameLabels = [`${names.big}s`, `${names.small}s`, `${names.plant}s`];
            return (
              <div key={i} className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 border bg-gradient-to-r ${color} ${border} shadow-sm`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold text-${text} uppercase tracking-wide`}>{nameLabels[i]}</p>
                </div>
                <div className={`text-2xl font-black text-${text}`}>{counts[i]}</div>
              </div>
            );
          })}
        </div>

        <button onClick={onStartCleanup} className="w-full py-4 rounded-3xl text-white font-black text-lg shadow-xl active:scale-95 transition-all shrink-0" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' }}>
          Start Cleanup
        </button>
      </div>
    </div>
  );
}