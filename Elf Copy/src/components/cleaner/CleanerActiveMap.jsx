import React from 'react';
import ActiveNavigationMap from '@/components/cleaner/ActiveNavigationMap';

/**
 * Cleaner ELF — Screen 3: Active cleanup map with 3 action buttons
 * Now displaying the selected course points and tracking session impact.
 */
// [수정] courseData(선택된 코스 정보)와 onFinishedCourse(합산 화면용)를 추가로 받습니다.
export default function CleanerActiveMap({ onFinishedSpot, onFinishedCourse, onQuit, courseData }) {
  
  // 이전 화면(handleStartMission)에서 넘겨준 좌표 배열을 가져옵니다.
  const points = courseData?.points || [];

  return (
    <div className="flex flex-col h-full">
      {/* Live navigation map */}
      <div className="relative flex-1 min-h-0">
        {/* [핵심] 빈 배열이었던 곳에 실제 코스 좌표(points)를 넣어줍니다! */}
        <ActiveNavigationMap coursePoints={points} />
        
        {/* 상단 오버레이: 현재 코스 정보 살짝 보여주기 (선택 사항) */}
        {courseData && (
          <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-green-100">
            <p className="text-xs font-bold text-green-700">Active Mission</p>
            <p className="text-sm font-black text-gray-800">
              Target: {courseData.totalWeight?.toFixed(1)}kg · Est: {courseData.estMins}min
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 px-6 py-5 bg-white rounded-t-3xl shadow-inner">
        {/* 1. 스팟 수거 완료: AI 분석 화면으로 이동 */}
        <button 
          onClick={onFinishedSpot} 
          className="w-full bg-green-500 hover:bg-green-600 active:scale-95 transition-transform text-white font-bold py-4 rounded-2xl text-lg shadow"
        >
          Finished spot
        </button>

        {/* 2. 전체 코스 완료: 우리가 아까 만든 '임팩트 합산 팝업'을 띄울 버튼! */}
        <button 
          onClick={onFinishedCourse}
          className="w-full bg-cyan-400 hover:bg-cyan-500 active:scale-95 transition-transform text-white font-bold py-4 rounded-2xl text-lg shadow"
        >
          Finished course
        </button>

        {/* 3. 종료하기 */}
        <button 
          onClick={onQuit} 
          className="w-full bg-gray-800 hover:bg-gray-900 active:scale-95 transition-transform text-white font-bold py-4 rounded-2xl text-lg shadow"
        >
          Quit course
        </button>
      </div>
    </div>
  );
}