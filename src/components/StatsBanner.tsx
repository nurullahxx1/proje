import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { CheckCircle2, Clock, Calendar, Flame } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const {
    profile,
    overallPercentage,
    completedWeeksCount,
    completedTasks,
    totalTasks,
    totalHours,
    activeWeekNumber,
    currentStreak
  } = useTracker();

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8">
      {/* Welcome & Target statement */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>Kişisel Çalışma Takip Sistemi</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-700 dark:text-stone-300 font-medium">
              Aktif: {activeWeekNumber}. Hafta
            </span>
            {currentStreak > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {currentStreak} Gün Seri
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 text-balance">
            Hoş geldin, {profile.name}!
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            {profile.targetGoal || '30 haftalık eğitim sürecindeki çalışmalarını düzenli kaydet ve hedefine adım adım ulaş.'}
          </p>
        </div>

        {/* Big Percentage Number */}
        <div className="flex items-baseline md:flex-col md:items-end gap-2 md:gap-0 shrink-0">
          <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
            %{overallPercentage}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Genel İlerleme
          </span>
        </div>
      </div>

      {/* Progress Bar with Milestone Markers */}
      <div className="py-6">
        <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-2 font-mono tabular-nums">
          <span>Başlangıç</span>
          <span className="hidden sm:inline">10. Hafta: Temel &amp; Dashboard</span>
          <span className="hidden sm:inline">20. Hafta: Full-Stack &amp; DB</span>
          <span>30. Hafta: Final</span>
        </div>

        <div className="relative w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, overallPercentage))}%` }}
          />
        </div>

        {/* Milestone tick indicators */}
        <div className="relative w-full flex justify-between mt-1 text-[10px] text-stone-400 font-mono">
          <span>0%</span>
          <span className="hidden sm:inline">33%</span>
          <span className="hidden sm:inline">66%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Stats Grid - 4 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-stone-900 dark:text-stone-100">
        {/* Stat 1 */}
        <div className="space-y-0.5">
          <p className="text-xs text-stone-500 dark:text-stone-400">Tamamlanan Hafta</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {completedWeeksCount}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ 30</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {30 - completedWeeksCount} hafta kaldı
          </p>
        </div>

        {/* Stat 2 */}
        <div className="space-y-0.5">
          <p className="text-xs text-stone-500 dark:text-stone-400">Tamamlanan Çalışma</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {completedTasks}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ {totalTasks}</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {totalTasks > 0 ? `%${Math.round((completedTasks / totalTasks) * 100)} tamamlama` : '0 çalışma'}
          </p>
        </div>

        {/* Stat 3 */}
        <div className="space-y-0.5">
          <p className="text-xs text-stone-500 dark:text-stone-400">Toplam Çalışma Saati</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {totalHours}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">saat</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Kaydedilen net süre
          </p>
        </div>

        {/* Stat 4 */}
        <div className="space-y-0.5">
          <p className="text-xs text-stone-500 dark:text-stone-400">Öğrenilen Teknolojiler</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {profile.technologies.length}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">araç &amp; dil</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Kişisel yetenek havuzu
          </p>
        </div>
      </div>
    </div>
  );
};
