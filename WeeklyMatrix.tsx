import React from 'react';
import { useTracker } from '../context/TrackerContext';

interface WeeklyMatrixProps {
  onSelectWeek: (weekNumber: number) => void;
}

export const WeeklyMatrix: React.FC<WeeklyMatrixProps> = ({ onSelectWeek }) => {
  const { weeks, getWeekStatus, getWeekTasks } = useTracker();

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            30 Haftalık Süreç Haritası
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Herhangi bir haftaya tıklayarak detaylarını ve çalışmalarını görüntüleyebilirsiniz.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>Tamamlandı</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span>Devam Ediyor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700" />
            <span>Bekliyor</span>
          </div>
        </div>
      </div>

      {/* Grid of 30 weeks */}
      <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
        {weeks.map((week) => {
          const status = getWeekStatus(week.weekNumber);
          const tasks = getWeekTasks(week.weekNumber);

          let bgClass = 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700/60 hover:border-stone-400';
          if (status === 'Tamamlandı') {
            bgClass = 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-xs';
          } else if (status === 'Devam ediyor') {
            bgClass = 'bg-amber-500 text-white border-transparent hover:bg-amber-600 shadow-xs';
          }

          return (
            <button
              key={week.weekNumber}
              onClick={() => onSelectWeek(week.weekNumber)}
              title={`${week.weekNumber}. Hafta: ${week.title} (${status}) - ${tasks.length} çalışma`}
              className={`group relative h-10 rounded-md font-mono text-xs font-semibold flex flex-col items-center justify-center transition-all ${bgClass}`}
            >
              <span>{String(week.weekNumber).padStart(2, '0')}</span>
              {tasks.length > 0 && (
                <span className="text-[9px] opacity-75 font-normal">
                  {tasks.length}ç
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
