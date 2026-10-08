import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { WeekMeta } from '../types/tracker';
import { Plus, ChevronRight, ExternalLink, Gamepad2 } from 'lucide-react';

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
  const hasCustomTitle = Boolean(week.title && week.title.trim() !== `${week.weekNumber}. Hafta`);
  
  // Direct resource link (Drive or Live Project like Vercel game)
  const resourceUrl = week.driveLink || tasks.find((t) => Boolean(t.link))?.link;
  const isDrive = resourceUrl ? resourceUrl.includes('drive.google.com') : false;
  const isGameProject = resourceUrl ? (resourceUrl.includes('nurullahoyunlarr') || resourceUrl.includes('vercel.app')) : false;

  const statusColor =
    status === 'Tamamlandı'
      ? 'text-emerald-600 dark:text-emerald-400'
      : status === 'Devam ediyor'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-stone-400 dark:text-stone-500';

  return (
    <div
      onClick={() => onSelectWeek(week.weekNumber)}
      className="group relative rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 hover:border-red-400/80 dark:hover:border-red-500/50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Status indicator */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
            <span>NO. {String(week.weekNumber).padStart(2, '0')}</span>
          </div>

          {/* Status */}
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

        {/* Title area: Displays only week number unless admin has set a custom name */}
        <div className="mt-1">
          {hasCustomTitle ? (
            <div>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 font-mono">
                {week.weekNumber}. Hafta
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-1 mt-0.5">
                {week.title}
              </h3>
            </div>
          ) : (
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
              {week.weekNumber}. Hafta
            </h3>
          )}

          {/* Goal snippet if defined by admin */}
          {week.goal && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
              {week.goal}
            </p>
          )}
        </div>

        {/* Resource link button (visible and accessible to everyone: Google Drive or Live Project) */}
        {resourceUrl && isDrive && (
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Google Drive döküman ve klasörünü aç"
            className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800 transition-colors shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm3.43 6l4.29 7.5H22l-4.29-7.5h-6.57zm5.14-6l-3.43 6h6.57l3.43-6h-6.57z"/>
            </svg>
            <span>Drive Dosyaları</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        )}

        {resourceUrl && isGameProject && (
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Nurullah Oyunlar canlı web uygulamasını aç"
            className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 dark:text-purple-300 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200/80 dark:border-purple-800 transition-colors shadow-2xs"
          >
            <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span>Oyunlar &amp; Proje</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        )}

        {resourceUrl && !isDrive && !isGameProject && (
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Haftalık projeyi / bağlantıyı yeni sekmede aç"
            className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-stone-600 dark:text-stone-400" />
            <span>Proje Bağlantısı</span>
          </a>
        )}
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
