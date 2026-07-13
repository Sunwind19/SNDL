import React, { useEffect } from 'react';

const BASE_URL = 'https://raw.githubusercontent.com/Sunwind19/biomeimages/main/';

const SPIRITS = [
  { id: 'espi1', label: 'Forest Spirit', color: 'bg-green-100' },
  { id: 'espi1', label: 'Mountain Spirit', color: 'bg-blue-100' },
];
export default function SpiritSelect({ onSelect }) {
  useEffect(() => {
    if (localStorage.getItem('userSpirit')) {
      onSelect();
    }
  }, []);

  const handlePick = (id) => {
    localStorage.setItem('userSpirit', id);
    onSelect();
  };

  return (
    <div className="flex flex-col h-full items-center justify-center px-6 py-8"
      style={{ background: 'linear-gradient(160deg, #e8f5e9 0%, #f0fdf4 50%, #e0f2fe 100%)' }}>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-green-800 mb-2 tracking-tight">
          Choose Your Guardian
        </h1>
        <p className="text-sm text-green-600 font-medium">
          Which spirit will protect your biome?
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        {SPIRITS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => handlePick(id)}
            // [중요] h-80으로 버튼 높이 고정, overflow-hidden으로 테두리 밖으로 안 나가게 깔끔하게 정리
            className="flex-1 h-80 group relative flex flex-col items-center bg-white rounded-[2.5rem] shadow-xl active:scale-95 transition-all border-2 border-transparent hover:border-green-400 overflow-hidden"
            style={{ animation: 'fadeIn 0.8s ease both' }}
          >
            {/* 배경 후광: 버튼 안에서 은은하게 퍼지도록 조정 */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full ${color} opacity-40 blur-3xl`} />
            
            {/* 정령 이미지 영역: 비율 유지하며 버튼 안을 꽉 채움 */}
            <div className="relative w-full flex-1 flex items-center justify-center p-4 z-10">
              <img
                src={`${BASE_URL}${id}.png`}
                alt={label}
                // [핵심] h-full w-full + object-contain으로 비율 안 깨지게 버튼 안에서 최대 크기 유지
                // hover 시에만 살짝 scale-110을 주어 생동감 부여
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
              />
            </div>
            
            {/* 라벨 영역: 하단에 가독성 좋게 배치 */}
            <div className="w-full py-6 bg-white/50 backdrop-blur-sm z-10">
              <span className="text-lg font-bold text-green-900">{label}</span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}