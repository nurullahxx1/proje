import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { WeekMeta } from '../types/tracker';
import { Plus, Check, Clock3, Circle, ChevronRight } from 'lucide-react';

interface WeeklyCardProps {
  week: WeekMeta;
  onSelectWeek: (weekNumber: number) => void;
  onQuickAdd: (weekNumber: number) => void;
}

export const WeeklyCard: React.FC<WeeklyCardProps> = ({
  week,
  onSelectWeek,
  onQuickAdd
}) => {
  const { getWeekTasks, getWeekStatus, getWeekHours } = useTracker();

  const tasks = getWeekTasks(week.weekNumber);
  const status = getWeekStatus(week.weekNumber);
  const hours = getWeekHours(week.weekNumber);
  const completedCount = tasks.filter((t) => t.status === 'Tamamlandı').length;

  const statusColor =
    status === 'Tamamlandı'
      ? 'text-emerald-600 dark:text-emerald-400'
      : status === 'Devam ediyor'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-stone-400 dark:text-stone-500';

  const statusBg =
    status === 'Tamamlandı'
      ? 'bg-emerald-500/10 border-emerald-500/30'
      : status === 'Devam ediyor'
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-stone-500/10 border-stone-500/20';

  return (
    <div
      onClick={() => onSelectWeek(week.weekNumber)}
      className="group relative rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 hover:border-stone-300 dark:hover:border-stone-700 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xs"
    >
      <div>
        {/* Top bar: Week number & Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
              {String(week.weekNumber).padStart(2, '0')}. HAFTA
            </span>
          </div>

          {/* Status (zero-pill text with icon indicator) */}
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'Tamamlandı'
                ? 'bg-emerald-500'
                : status === 'Devam ediyor'
                ? 'bg-amber-500'
                : 'bg-stone-400'
            }`} />
            <span className={statusColor}>{status}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors line-clamp-1">
          {week.title}
        </h3>

        {/* Goal snippet */}
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
          {week.goal}
        </p>
      </div>

      {/* Footer Area */}
      <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        {/* Metadata info */}
        <div className="flex items-center gap-1.5 font-mono tabular-nums">
          <span>{tasks.length} çalışma</span>
          <span aria-hidden="true">·</span>
          <span>{hours} saat</span>
        </div>

        {/* Quick Add Button */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(week.weekNumber);
            }}
            title="Bu haftaya çalışma ekle"
            className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="p-1 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
