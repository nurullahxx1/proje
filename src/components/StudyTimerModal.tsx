import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { StudyTask } from '../types/tracker';
import { playTimerChime } from '../utils/helpers';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogStudy: (durationHours: number, defaultWeek: number) => void;
  defaultWeek?: number;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  onLogStudy,
  defaultWeek = 1
}) => {
  const [seconds, setSeconds] = useState(25 * 60); // 25 min default
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [targetWeek, setTargetWeek] = useState(defaultWeek);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setTargetWeek(defaultWeek);
  }, [defaultWeek]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'pomodoro') {
            if (prev <= 1) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsRunning(false);
              playTimerChime();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(mode === 'pomodoro' ? 25 * 60 : 0);
  };

  const handleSwitchMode = (newMode: 'pomodoro' | 'stopwatch') => {
    setIsRunning(false);
    setMode(newMode);
    setSeconds(newMode === 'pomodoro' ? 25 * 60 : 0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCompleteAndLog = () => {
    setIsRunning(false);
    let durationHours = 0.5;
    if (mode === 'pomodoro') {
      const elapsed = 25 * 60 - seconds;
      durationHours = Math.max(0.25, Number((elapsed / 3600).toFixed(2)));
    } else {
      durationHours = Math.max(0.25, Number((seconds / 3600).toFixed(2)));
    }
    onLogStudy(durationHours, targetWeek);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden p-6 text-center space-y-5"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
            <button
              onClick={() => handleSwitchMode('pomodoro')}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                mode === 'pomodoro'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Pomodoro (25 dk)
            </button>
            <button
              onClick={() => handleSwitchMode('stopwatch')}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                mode === 'stopwatch'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Kronometre
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Digital Display */}
        <div className="py-4">
          <div className="text-5xl font-mono font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
            {formatTime(seconds)}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
            {mode === 'pomodoro' ? 'Odaklanma Süresi' : 'Serbest Çalışma Sayacı'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Duraklat' : 'Başlat'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Week selection & Log as study */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span>Kaydedilecek Hafta:</span>
            <select
              value={targetWeek}
              onChange={(e) => setTargetWeek(Number(e.target.value))}
              className="px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-xs text-stone-900 dark:text-stone-100"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  {w}. Hafta
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompleteAndLog}
            className="w-full py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Süreyi Çalışma Olarak Kaydet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
