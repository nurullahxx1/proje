import React from 'react';
import { useTracker } from '../context/TrackerContext';

interface WeeklyMatrixProps {
  onSelectWeek: (weekNumber: number) => void;
}

export const WeeklyMatrix: React.FC<WeeklyMatrixProps> = ({ onSelectWeek }) => {
  const { weeks, getWeekStatus, getWeekTasks } = useTracker();

  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>38 Haftalık Süreç Haritası</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
              1 - 38. Hafta
            </span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Herhangi bir haftaya tıklayarak detaylarını, Drive dökümanlarını ve çalışmalarını görüntüleyebilirsiniz.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
            <span>Tamamlandı</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
            <span>Devam Ediyor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700" />
            <span>Bekliyor</span>
          </div>
        </div>
      </div>

      {/* Grid of 38 weeks */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-19 gap-2">
        {weeks.map((week) => {
          const status = getWeekStatus(week.weekNumber);
          const tasks = getWeekTasks(week.weekNumber);
          const resUrl = week.driveLink || tasks.find((t) => Boolean(t.link))?.link;
          const hasResource = Boolean(resUrl);
          const isDrive = resUrl ? resUrl.includes('drive.google.com') : false;
          const isGame = resUrl ? (resUrl.includes('nurullahoyunlarr') || resUrl.includes('vercel.app')) : false;

          let bgClass = 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border border-stone-200/90 dark:border-stone-700/60 hover:border-red-400 hover:bg-stone-100/90 dark:hover:bg-stone-800 hover:-translate-y-0.5';
          if (status === 'Tamamlandı') {
            bgClass = 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-xs hover:-translate-y-0.5';
          } else if (status === 'Devam ediyor') {
            bgClass = 'bg-amber-500 text-white border-transparent hover:bg-amber-600 shadow-xs hover:-translate-y-0.5';
          }

          const resourceLabel = isDrive ? 'Drive Dökümanı Mevcut' : isGame ? 'Canlı Oyun / Proje Mevcut' : 'Bağlantı Mevcut';

          return (
            <button
              key={week.weekNumber}
              onClick={() => onSelectWeek(week.weekNumber)}
              title={`${week.weekNumber}. Hafta${week.title && week.title !== `${week.weekNumber}. Hafta` ? `: ${week.title}` : ''} (${status}) - ${tasks.length} çalışma${hasResource ? ` · ${resourceLabel}` : ''}`}
              className={`group relative h-11 rounded-lg font-mono text-xs font-bold flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${bgClass}`}
            >
              <span>{String(week.weekNumber).padStart(2, '0')}</span>
              <div className="flex items-center gap-0.5">
                {tasks.length > 0 && (
                  <span className="text-[9px] opacity-80 font-normal">
                    {tasks.length}ç
                  </span>
                )}
                {hasResource && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full inline-block ${
                      isDrive
                        ? 'bg-blue-500 dark:bg-blue-300'
                        : isGame
                        ? 'bg-purple-500 dark:bg-purple-300'
                        : 'bg-emerald-500 dark:bg-emerald-300'
                    }`}
                    title={resourceLabel}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
