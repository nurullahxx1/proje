import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { Flame, Clock, Calendar, CheckCircle2, TrendingUp, BarChart3, FileSpreadsheet, Printer, Award, Target, Sparkles } from 'lucide-react';

interface InsightsViewProps {
  onSelectWeek: (weekNum: number) => void;
  onOpenPrintReport: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onSelectWeek, onOpenPrintReport }) => {
  const {
    weeks,
    tasks,
    totalHours,
    completedTasks,
    totalTasks,
    overallPercentage,
    completedWeeksCount,
    currentStreak,
    longestStreak,
    activeDaysCount,
    getWeekHours,
    getWeekStatus,
    exportToCsv
  } = useTracker();

  // Phase statistics
  const phase1Weeks = weeks.filter((w) => w.weekNumber >= 1 && w.weekNumber <= 10);
  const phase2Weeks = weeks.filter((w) => w.weekNumber >= 11 && w.weekNumber <= 20);
  const phase3Weeks = weeks.filter((w) => w.weekNumber >= 21 && w.weekNumber <= 30);

  const getPhaseStats = (phaseWeeks: typeof weeks) => {
    const pWeeksCompleted = phaseWeeks.filter((w) => getWeekStatus(w.weekNumber) === 'Tamamlandı').length;
    const pTasks = tasks.filter((t) => phaseWeeks.some((w) => w.weekNumber === t.weekNumber));
    const pTasksCompleted = pTasks.filter((t) => t.status === 'Tamamlandı').length;
    const pHours = Number(pTasks.reduce((sum, t) => sum + (t.hours || 0), 0).toFixed(1));
    const percent = pTasks.length > 0 ? Math.round((pTasksCompleted / pTasks.length) * 100) : 0;
    return { completedWeeks: pWeeksCompleted, totalTasks: pTasks.length, completedTasks: pTasksCompleted, hours: pHours, percentage: percent };
  };

  const p1Stats = getPhaseStats(phase1Weeks);
  const p2Stats = getPhaseStats(phase2Weeks);
  const p3Stats = getPhaseStats(phase3Weeks);

  // Category distribution
  const categories = ['Ders', 'Proje', 'Pratik', 'Okuma', 'Genel'] as const;
  const categoryCounts = categories.map((cat) => {
    const count = tasks.filter((t) => (t.category || 'Genel') === cat).length;
    const hours = Number(tasks.filter((t) => (t.category || 'Genel') === cat).reduce((s, t) => s + (t.hours || 0), 0).toFixed(1));
    return { name: cat, count, hours };
  });

  // Calculate maximum weekly hours for bar scaling
  const weeklyHoursList = weeks.map((w) => ({
    weekNum: w.weekNumber,
    hours: getWeekHours(w.weekNumber),
    status: getWeekStatus(w.weekNumber)
  }));
  const maxWeeklyHours = Math.max(...weeklyHoursList.map((w) => w.hours), 6);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner with Quick Actions */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>Performans &amp; Çalışma Analizi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            30 Haftalık Süreç Analizi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            Tüm haftalık çalışma ritminizi, serilerinizi ve saat dağılımınızı buradan detaylıca inceleyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenPrintReport}
            className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdırılabilir Rapor</span>
          </button>
          <button
            onClick={exportToCsv}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel / CSV İndir</span>
          </button>
        </div>
      </div>

      {/* 4 Essential Productivity Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Çalışma Serisi</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {currentStreak}
            </span>
            <span className="text-xs text-stone-400 font-mono">gün</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
            En uzun seri: <strong className="text-stone-800 dark:text-stone-200">{longestStreak} gün</strong>
          </p>
        </div>

        {/* Active Days */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Aktif Çalışılan Gün</span>
            <Calendar className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {activeDaysCount}
            </span>
            <span className="text-xs text-stone-400 font-mono">farklı gün</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
            Düzenli takip edilen takvim
          </p>
        </div>

        {/* Total Hours */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Toplam Süre</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {totalHours}
            </span>
            <span className="text-xs text-stone-400 font-mono">saat</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
            Ort. hafta başı: <strong className="text-stone-800 dark:text-stone-200">{(totalHours / 30).toFixed(1)} sa</strong>
          </p>
        </div>

        {/* Overall Completion */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Genel Başarı Oranı</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              %{overallPercentage}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
            {completedWeeksCount} / 30 hafta tamamlandı
          </p>
        </div>
      </div>

      {/* 30-Week Hours Distribution Bar Chart */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Haftalık Çalışma Saati Dağılımı (1 - 30. Hafta)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Her sütun o haftaya kaydedilen toplam saati gösterir. Detay için sütuna tıklayabilirsiniz.
            </p>
          </div>
          <div className="text-xs text-stone-400 font-mono">
            Maks: {maxWeeklyHours} sa
          </div>
        </div>

        {/* SVG/CSS Bar Chart Grid */}
        <div className="pt-6 pb-2">
          <div className="h-44 flex items-end gap-1.5 sm:gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
            {weeklyHoursList.map((item) => {
              const heightPercent = item.hours > 0 ? Math.max(12, Math.round((item.hours / maxWeeklyHours) * 100)) : 4;
              const isCompleted = item.status === 'Tamamlandı';
              const isInProgress = item.status === 'Devam ediyor';

              return (
                <div
                  key={item.weekNum}
                  onClick={() => onSelectWeek(item.weekNum)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                  title={`${item.weekNum}. Hafta: ${item.hours} saat (${item.status})`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-stone-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.hours} sa
                  </div>

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-500 group-hover:bg-emerald-600'
                        : isInProgress
                        ? 'bg-amber-500 group-hover:bg-amber-600'
                        : item.hours > 0
                        ? 'bg-stone-400 dark:bg-stone-600 group-hover:bg-stone-500'
                        : 'bg-stone-200 dark:bg-stone-800'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-stone-400 mt-1 hidden sm:inline">
                    {item.weekNum}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-stone-400 pt-2">
            <span>1. Hafta</span>
            <span>10. Hafta</span>
            <span>20. Hafta</span>
            <span>30. Hafta</span>
          </div>
        </div>
      </div>

      {/* 3 Phases Detailed Breakdown */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
            3 Aşamalı Gelişim İlerlemesi
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Eğitim sürecinizin 3 ana evresindeki durum ve hedefleriniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                1 - 10. HAFTA
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                %{p1Stats.percentage}
              </span>
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Temel Yapı &amp; Arayüz
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Programlama temelleri, algoritma, modern Javascript ve ilk bileşenler.
            </p>

            <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all rounded-full"
                style={{ width: `${p1Stats.percentage}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span>{p1Stats.completedWeeks} / 10 hafta</span>
              <span>{p1Stats.hours} saat</span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                11 - 20. HAFTA
              </span>
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                %{p2Stats.percentage}
              </span>
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Full-Stack &amp; Veritabanı
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Backend mimarisi, API entegrasyonu, veri depolama ve kimlik doğrulama.
            </p>

            <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all rounded-full"
                style={{ width: `${p2Stats.percentage}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span>{p2Stats.completedWeeks} / 10 hafta</span>
              <span>{p2Stats.hours} saat</span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                21 - 30. HAFTA
              </span>
              <span className="text-xs font-mono font-semibold text-stone-600 dark:text-stone-400">
                %{p3Stats.percentage}
              </span>
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              İleri Projeler &amp; Final
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Kapsamlı bitirme projeleri, mimari optimizasyon, testler ve canlıya alma.
            </p>

            <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 dark:bg-stone-100 transition-all rounded-full"
                style={{ width: `${p3Stats.percentage}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span>{p3Stats.completedWeeks} / 10 hafta</span>
              <span>{p3Stats.hours} saat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution Grid */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Kategoriye Göre Çalışma Dağılımı
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Ders, proje, kodlama pratiği ve okuma çalışmalarınızın dökümü.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {categoryCounts.map((cat) => (
            <div
              key={cat.name}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30 space-y-1"
            >
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {cat.name}
              </span>
              <div className="text-xl font-bold font-mono text-stone-800 dark:text-stone-200">
                {cat.count}
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                {cat.hours} saat
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
