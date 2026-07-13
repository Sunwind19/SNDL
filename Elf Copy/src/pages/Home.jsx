import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import BottomNav from '@/components/elf/BottomNav';
import NextScreenButton from '@/components/elf/NextScreenButton';
import ReporterCamera from '@/components/reporter/ReporterCamera';
import ReporterMapMark from '@/components/reporter/ReporterMapMark';
import ReporterCleaned from '@/components/reporter/ReporterCleaned';
import CleanerAreaSelect from '@/components/cleaner/CleanerAreaSelect';
import MissionSelectScreen from '@/components/cleaner/MissionSelectScreen';
import CleanerRouteMap from '@/components/cleaner/CleanerRouteMap';
import CleanerActiveMap from '@/components/cleaner/CleanerActiveMap';
import CleanerFinishedCamera from '@/components/cleaner/CleanerFinishedCamera';
import CleanerCongrats from '@/components/cleaner/CleanerCongrats';
import CleanerSummary from '@/components/cleaner/CleanerSummary';
import LeaderboardScreen from '@/components/leaderboard/LeaderboardScreen';
import CleanupPlanScreen from '@/components/cleaner/CleanupPlanScreen';
import CityPickerScreen from '@/components/onboarding/CityPickerScreen';
import MyBiomeScreen from '@/components/biome/MyBiomeScreen';
import SpiritSelect from '@/components/biome/SpiritSelect';
import MyActivityScreen from '@/components/biome/MyActivityScreen';

// Ordered list of all screens — used by the temporary "next" button
const ALL_SCREENS = [
  { tab: 'reporter', step: 0, label: 'R1 Camera' },
  { tab: 'reporter', step: 1, label: 'R2 Map Mark' },
  { tab: 'reporter', step: 2, label: 'R3 Cleaned' },
  { tab: 'plan',     step: 0, label: 'Plan' },
  { tab: 'cleaner',  step: 0, label: 'C1 Area' },
  { tab: 'cleaner',  step: 10, label: 'C1b Mission' },
  { tab: 'cleaner',  step: 1, label: 'C2 Route' },
  { tab: 'cleaner',  step: 2, label: 'C3 Active' },
  { tab: 'cleaner',  step: 3, label: 'C4 Camera' },
  { tab: 'cleaner',  step: 4, label: 'C5 Congrats' },
  { tab: 'cleaner',  step: 5, label: 'C6 Summary' },
  { tab: 'leaderboard', step: 0, label: 'Leaderboard' },
  { tab: 'biome',    step: 0, label: 'My Biome' },
  { tab: 'biome',    step: 1, label: 'My Activity' },
];

export default function Home() {
  const [cityDone, setCityDone]         = useState(false);
  const [checkingCity, setCheckingCity] = useState(true);
  const [activeTab, setActiveTab]       = useState('plan');
  const [reporterStep, setReporterStep] = useState(0);
  const [cleanerStep, setCleanerStep]   = useState(0);
  const [selectedArea, setSelectedArea] = useState(null);
  const [screenIdx, setScreenIdx]       = useState(ALL_SCREENS.findIndex(s => s.tab === 'plan'));
  const [reportData, setReportData]     = useState(null); // { photoUrl, location, timestamp, recordId, totalWeightKg, seedsPotential }
  const [analysisResult, setAnalysisResult] = useState(null);
  const [seeds, setSeeds]               = useState(0);
  const [currentGps, setCurrentGps]     = useState(null);
  const [selectedTime, setSelectedTime] = useState(60);
  const [sessionStats, setSessionStats] = useState({ ba: 0, sa: 0, f: 0, weight: 0 });

  // [수정 포인트 1] 선택된 코스 정보를 유지하기 위한 상태 추가
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Save activity record when a cleanup course is finished
  const saveActivityRecord = async () => {
    try {
      const user = await base44.auth.me();
      await base44.entities.ActivityRecord.create({
        user_email: user.email,
        saved_plants: sessionStats.f || 0,
        saved_animals: (sessionStats.ba || 0) + (sessionStats.sa || 0),
        waste_amount: sessionStats.weight || 0,
      });
    } catch (err) {
      console.error('Failed to save activity record:', err);
    }
  };

  const updateSessionImpact = (newData) => {
    setSessionStats(prev => ({
      ba: prev.ba + Number(newData.ba || 0),
      sa: prev.sa + Number(newData.sa || 0),
      f: prev.f + Number(newData.f || 0),
      weight: prev.weight + Number(newData.totalWeightKg || 0),
    }));
  };

  // Check if user already has a city set
  useEffect(() => {
    const check = async () => {
      try {
        // 1. 유저 정보를 가져오기 시도
        const user = await base44.auth.me();
        if (user?.city) setCityDone(true);
      } catch (err) {
        // 2. 에러가 나도(로그인이 안 되어 있어도) 여기서 멈추지 않음
        console.error("Auth check failed, moving to next step");
      } finally {
        // 3. [핵심] 성공하든 실패하든 무조건 로딩 화면을 끈다!
        setCheckingCity(false);
      }
    };
    check();
  }, []);

  // Request GPS on mount and track continuously
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setCurrentGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const applyScreen = (idx) => {
    const s = ALL_SCREENS[idx];
    setScreenIdx(idx);
    setActiveTab(s.tab);
    if (s.tab === 'reporter')    setReporterStep(s.step);
    if (s.tab === 'cleaner')     setCleanerStep(s.step);
  };

  const nextScreen = () => applyScreen((screenIdx + 1) % ALL_SCREENS.length);

  const onTabChange = (tab) => {
    const idx = ALL_SCREENS.findIndex(s => s.tab === tab);
    if (idx !== -1) applyScreen(idx);
  };

  const handlePhotoCapture = (data) => {
    setReportData(data);
    setReporterStep(1);
  };

  const handleClaimSeeds = (amount, snapshot) => {
    setSeeds(s => s + amount);
    setReportData(d => ({ ...d, mapSnapshot: snapshot }));
    applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'plan'));
  };

  const renderScreen = () => {
    if (activeTab === 'reporter') {
      if (reporterStep === 0) return <ReporterCamera onPhotoCapture={handlePhotoCapture} />;
      if (reporterStep === 1) return <ReporterMapMark
        reportData={reportData}
        onClaimSeeds={handleClaimSeeds}
      />;
      if (reporterStep === 2) return <ReporterCleaned />;
    }
    if (activeTab === 'cleaner') {
      if (cleanerStep === 0) return <CleanerAreaSelect selectedArea={selectedArea} onSelect={(area) => { setSelectedArea(area); setSessionStats({ ba: 0, sa: 0, f: 0, weight: 0 }); applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 10)); }} />;
      if (cleanerStep === 10) return <MissionSelectScreen onSelect={(mins) => { setSelectedTime(mins); applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 1)); }} />;
      
      // [수정 포인트 2] C2에서 코스 선택 시 데이터 저장
      if (cleanerStep === 1) return <CleanerRouteMap 
        selectedArea={selectedArea} 
        selectedTime={selectedTime} 
        userLocation={currentGps}
        onStart={(course) => {
          setSelectedCourse(course); // 코스 정보 배달통에 담기
          applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 2));
        }} 
      />;

      // [수정 포인트 3] C3에서 저장된 데이터와 GPS 전달
      if (cleanerStep === 2) return <CleanerActiveMap 
        courseData={selectedCourse} 
        userLocation={currentGps}
        onFinishedSpot={() => applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 3))} 
        onFinishedCourse={() => { saveActivityRecord(); applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 4)); }}
        onQuit={() => applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'plan'))} 
      />;

      if (cleanerStep === 3) return <CleanerFinishedCamera
        reportRecordId={reportData?.recordId ?? null}
        onAnalysisComplete={(data) => { updateSessionImpact(data); setAnalysisResult(data); applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 5)); }}
      />;
      if (cleanerStep === 4) return <CleanerCongrats sessionStats={sessionStats} onBackHome={() => applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'plan'))} />;
      if (cleanerStep === 5) return <CleanerSummary
        summaryData={analysisResult}
        currentGps={currentGps}
        reportLocation={reportData?.location ?? null}
        onClaim={(earned) => setSeeds(s => s + earned)}
      />;
    }
    if (activeTab === 'plan') return <CleanupPlanScreen
      reportData={reportData}
      onStartCleanup={() => applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'cleaner' && s.step === 0))}
    />;
    if (activeTab === 'leaderboard') return <LeaderboardScreen />;
    if (activeTab === 'biome') {
      const biomeScreen = ALL_SCREENS[screenIdx];
      if (biomeScreen?.step === 1) return <MyActivityScreen onBack={() => applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'biome' && s.step === 0))} />;
      if (!localStorage.getItem('userSpirit')) {
        return <SpiritSelect onSelect={() => setActiveTab('biome')} />;
      }
      return <MyBiomeScreen onViewActivity={() => applyScreen(ALL_SCREENS.findIndex(s => s.tab === 'biome' && s.step === 1))} />;
    }
    return null;
  };

  const current = ALL_SCREENS[screenIdx];

  if (checkingCity) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cityDone) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="relative w-full max-w-sm h-screen md:h-[812px] bg-white flex flex-col overflow-hidden md:rounded-3xl md:shadow-2xl">
          <CityPickerScreen onComplete={() => setCityDone(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-screen md:h-[812px] bg-white flex flex-col overflow-hidden md:rounded-3xl md:shadow-2xl">



        {/* Main content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {renderScreen()}
        </div>

        {/* Bottom tab navigation */}
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />

        {/* Temporary next-screen button */}
        <NextScreenButton
          onNext={nextScreen}
          label={`${current.label} ${screenIdx + 1}/${ALL_SCREENS.length}`}
        />
      </div>
    </div>
  );
}