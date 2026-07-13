import React, { useRef, useEffect, useState } from 'react';
import { volunteerVerify } from '@/lib/biomelfApi';
import { base44 } from '@/api/base44Client';

export default function CleanerFinishedCamera({ cleanProgress = null, reportRecordId = null, onAnalysisComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [analyzing, setAnalyzing] = useState(false);
  const barWidth = cleanProgress !== null ? `${Math.min(100, cleanProgress)}%` : '40%';

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        streamRef.current = stream;
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || analyzing) return;
    setAnalyzing(true);

    // Capture frame to canvas
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    // Convert to File
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'cleanup.jpg', { type: 'image/jpeg' });

      // Fetch before_counts_json from the linked report
      let beforeCounts = null;
      if (reportRecordId) {
        try {
          const records = await base44.entities.DetectionLog.filter({ id: reportRecordId });
          if (records.length > 0 && records[0].raw_counts) {
            beforeCounts = records[0].raw_counts;
          }
        } catch (e) {
          console.warn('[CleanerCamera] Could not fetch report record:', e.message);
        }
      }

      try {
        const result = await volunteerVerify(file, beforeCounts ?? '{}');
        onAnalysisComplete && onAnalysisComplete(result);
      } catch (err) {
        const msg = err?.message || String(err);
        console.error('[CleanerCamera] Analysis failed:', msg);
        alert(`Analysis Error:\n${msg}`);
        setAnalyzing(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <video 
        ref={videoRef} 
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Progress bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: barWidth, background: 'linear-gradient(to right, #4ade80, #16a34a)' }} />
        </div>
      </div>

      {/* Analyzing overlay */}
      {analyzing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-60 gap-4">
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm font-medium">Analyzing ecosystem impact...</p>
        </div>
      )}

      {/* Capture button */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
        <button
          onClick={handleCapture}
          disabled={analyzing}
          className="w-20 h-20 rounded-full border-4 border-white border-opacity-70 bg-green-400 bg-opacity-60 flex items-center justify-center shadow-2xl active:scale-95 disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-green-300 bg-opacity-80" />
        </button>
      </div>
    </div>
  );
}