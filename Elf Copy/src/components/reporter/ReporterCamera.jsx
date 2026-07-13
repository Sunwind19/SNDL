import React, { useRef, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { reporterAnalyze } from '@/lib/biomelfApi';

const LOADING_TEXTS = [
  'AI analyzing almost done…',
  'Protecting Roe Deer...',
  'Almost there... Thank you for your patience!',
];

export default function ReporterCamera({ pollutionLevel = null, onPhotoCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseChosen, setCourseChosen] = useState(false);
  const selectedCourseRef = useRef(null); // <--- 이 줄을 추가하세요! (실시간 감시 카메라 역할)
  const courseResolverRef = useRef(null);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const loadingIntervalRef = useRef(null);
  const barWidth = pollutionLevel !== null ? `${Math.min(100, pollutionLevel)}%` : '55%';

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startLoadingLoop = () => {
    setLoadingTextIdx(0);
    let i = 0;
    loadingIntervalRef.current = setInterval(() => {
      i = (i + 1) % LOADING_TEXTS.length;
      setLoadingTextIdx(i);
    }, 3000);
  };

  const stopLoadingLoop = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

const handleCourseSelect = (id) => {
  setSelectedCourse(id);
  selectedCourseRef.current = id; // <--- Ref에도 실시간으로 저장!
  setCourseChosen(true);
  
  if (courseResolverRef.current) {
    courseResolverRef.current(id);
    courseResolverRef.current = null;
  }
};

  const waitForCourse = () => new Promise((resolve) => {
    courseResolverRef.current = resolve;
  });

  const capturePhoto = async () => {
    if (!videoRef.current || isCapturing) return;
    setCourseChosen(false);
    setSelectedCourse(null);
    setIsCapturing(true);
    startLoadingLoop();

    try {
      // Get GPS coordinates
      let location = null;
      
      if (!navigator.geolocation) {
        alert('Your browser does not support GPS location services. Please use a modern browser like Chrome or Safari.');
        setIsCapturing(false);
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        });
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (err) {
        console.error('Location error:', err);
        let errorMessage = 'GPS is required to map your trash collection.\n\n';
        
        if (err.code === 1) {
          errorMessage += 'You denied location access. Please:\n1. Click the location icon in your browser address bar\n2. Select "Allow" for location access\n3. Try capturing again';
        } else if (err.code === 2) {
          errorMessage += 'Location information is unavailable. Please check your device settings.';
        } else if (err.code === 3) {
          errorMessage += 'Location request timed out. Please ensure GPS is enabled and try again.';
        }
        
        alert(errorMessage);
        setIsCapturing(false);
        return;
      }

      // Capture photo from video stream
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert to blob for upload
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
      const file = new File([blob], `trash_${Date.now()}.jpg`, { type: 'image/jpeg' });

      // Upload to Base44 storage
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Call HF reporter_analyze API
      let apiResult = null;
      try {
        apiResult = await reporterAnalyze(file);
        console.log('[Reporter] API result:', apiResult);
      } catch (apiErr) {
        console.error('[Reporter] API failed:', apiErr.message);
        // Non-fatal: continue without API data
      }

      // Wait for user to pick course type if not yet chosen
      const chosenCourse = selectedCourseRef.current || await waitForCourse();

      // 4. DB 레코드 생성 (이 부분이 데이터를 결정짓는 핵심!)
      const record = await base44.entities.DetectionLog.create({
        image_url: file_url,
        latitude: location.lat,
        longitude: location.lng,
        status: 'Analyzed', // 'Pending_Analysis' 대신 'Analyzed'로 명시
        
        // 1. 수치 데이터 직접 저장 (이게 가장 중요합니다!)
        f:  apiResult?.f  ?? 0,  // 꽃/식물
        ba: apiResult?.ba ?? 0,  // 대형 동물 (Roe Deer 등)
        sa: apiResult?.sa ?? 0,  // 소형 동물 (Squirrel 등)
        
        // 2. 기타 분석 정보
        estimated_weight_kg: apiResult?.total_weight_kg ?? 0,
        seeds_potential: apiResult?.seeds_potential ?? 0,
        course_type: chosenCourse,

        // 3. 백업용 원본 데이터 (이름표가 헷갈려도 나중에 찾을 수 있게!)
        raw_counts: JSON.stringify(apiResult?.raw_counts || apiResult || {}),
      });

      // Play shutter sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltrzxnMpBSl+zPLaizsIGGS57OihUhELTKXh8bllHgU2jdXzzn0vBSF2xPDblkgLEmC26+mjUBELTKXi8bllHgU1jNXzzn0vBSF2xPDblkgLEmC26+mjUBELTKXi8bllHgU1jNXzzn0vBSF2xPDblkgLEmC26+mjUBELTKXi8bllHgU1jNXzzn0vBQ==');
      audio.play().catch(() => {});

      // Success feedback
      alert('Report Saved Successfully!');

      // Pass data to parent
      if (onPhotoCapture) {
        onPhotoCapture({
          photoUrl: file_url,
          location,
          timestamp: new Date().toISOString(),
          recordId: record.id,
          totalWeightKg: apiResult?.total_weight_kg ?? null,
          seedsPotential: apiResult?.seeds_potential ?? null,
          f:  apiResult?.f  ?? 0,
          ba: apiResult?.ba ?? 0,
          sa: apiResult?.sa ?? 0,
        });
      }
    } catch (error) {
      console.error('Capture failed:', error);
      alert('Failed to save report. Please try again.');
    } finally {
      stopLoadingLoop();
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <video 
        ref={videoRef} 
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: barWidth, background: 'linear-gradient(to right, #fb923c, #ef4444, #991b1b)' }} />
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
        <button 
          onClick={capturePhoto}
          disabled={isCapturing}
          className="w-20 h-20 rounded-full border-4 border-white border-opacity-70 bg-green-400 bg-opacity-60 flex items-center justify-center shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-300 bg-opacity-80" />
          )}
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {/* Loading overlay */}
      {isCapturing && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-3xl px-5 py-6 flex flex-col gap-4" style={{ width: '85%', minHeight: '30%' }}>
            {!courseChosen ? (
              <>
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">Quick Question while AI is analyzing your photo! 🌿</p>
                  <p className="text-lg font-bold text-gray-800">Where is this location?</p>
                </div>
                <div className="flex gap-3 justify-between">
                  {[
                    { id: 'mountain', label: '⛰️ Mountain' },
                    { id: 'forest',   label: '🌳 Forest' },
                    { id: 'flat',     label: '🏃 Flat/Road' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => handleCourseSelect(id)}
                      className="flex-1 py-4 rounded-2xl bg-green-50 border-2 border-green-200 text-green-700 font-semibold text-sm active:scale-95 transition-transform hover:bg-green-100"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-green-700 font-semibold text-center text-base">{LOADING_TEXTS[loadingTextIdx]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}