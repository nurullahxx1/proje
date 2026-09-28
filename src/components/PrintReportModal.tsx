import React, { useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { Printer, X, Download } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ isOpen, onClose }) => {
  const { profile, weeks, tasks, totalHours, completedTasks, totalTasks, overallPercentage, completedWeeksCount, getWeekTasks, getWeekStatus, getWeekHours, exportToCsv } = useTracker();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-4xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Toolbar (hidden during print) */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950 print:hidden">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              30 Haftalık Eğitim &amp; Çalışma Raporu
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Raporunuzu inceleyebilir, PDF olarak indirebilir veya yazdırabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCsv}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV İndir</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-stone-900 print:p-0 print:overflow-visible">
          {/* Document Header */}
          <div className="border-b-2 border-stone-900 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-stone-500">
                Kişisel Eğitim Takip Raporu
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
                {profile.name}
              </h1>
              <p className="text-sm font-medium text-stone-600 mt-0.5">
                {profile.role}
              </p>
              {profile.targetGoal && (
                <p className="text-xs text-stone-500 mt-2 max-w-xl">
                  <strong>Ana Hedef:</strong> {profile.targetGoal}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right text-xs text-stone-500 font-mono">
              <p>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
              <p className="font-semibold text-stone-900 mt-1">Eğitim &amp; Çalışma Takip Sistemi</p>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-stone-300 bg-stone-50 mb-8 text-center">
            <div>
              <p className="text-[11px] text-stone-500 uppercase font-mono">Genel İlerleme</p>
              <p className="text-2xl font-bold font-mono text-stone-900">%{overallPercentage}</p>
            </div>
            <div>
              <p className="text-[11px] text-stone-500 uppercase font-mono">Tamamlanan Hafta</p>
              <p className="text-2xl font-bold font-mono text-stone-900">{completedWeeksCount} / 30</p>
            </div>
            <div>
              <p className="text-[11px] text-stone-500 uppercase font-mono">Toplam Çalışma</p>
              <p className="text-2xl font-bold font-mono text-stone-900">{completedTasks} / {totalTasks}</p>
            </div>
            <div>
              <p className="text-[11px] text-stone-500 uppercase font-mono">Toplam Süre</p>
              <p className="text-2xl font-bold font-mono text-stone-900">{totalHours} sa</p>
            </div>
          </div>

          {/* 30-Week Detailed Matrix List */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-stone-900 border-b border-stone-200 pb-2">
              Haftalık Müfredat &amp; Çalışma Kayıtları
            </h2>

            <div className="space-y-4">
              {weeks.map((week) => {
                const wTasks = getWeekTasks(week.weekNumber);
                const wStatus = getWeekStatus(week.weekNumber);
                const wHours = getWeekHours(week.weekNumber);

                return (
                  <div
                    key={week.weekNumber}
                    className="p-4 rounded-lg border border-stone-200 break-inside-avoid space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">
                          {String(week.weekNumber).padStart(2, '0')}. Hafta:
                        </span>
                        <span className="font-semibold text-stone-800">{week.title}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-stone-500">
                        <span>{wStatus}</span>
                        <span>·</span>
                        <span>{wHours} saat</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-500 italic">
                      {week.goal}
                    </p>

                    {wTasks.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-stone-100 space-y-1.5">
                        {wTasks.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-start justify-between text-xs text-stone-700 pl-2 border-l-2 border-stone-300"
                          >
                            <div>
                              <span className="font-medium text-stone-900">{t.title}</span>
                              {t.description && (
                                <p className="text-[11px] text-stone-500 line-clamp-1">{t.description}</p>
                              )}
                            </div>
                            <div className="text-right text-[11px] font-mono text-stone-500 shrink-0 ml-4">
                              <span>{t.date}</span> · <span>{t.time}</span> · <span>{t.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-stone-200 text-center text-xs text-stone-400 font-mono">
            30 Haftalık Kişisel Eğitim &amp; Çalışma Takip Sistemi · Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </div>
  );
};
