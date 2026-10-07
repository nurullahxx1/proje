import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { CheckCircle2, Clock, Calendar, Flame, Sparkles, RefreshCw, Quote } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { text: 'Hiçbir şeye ihtiyacımız yok, yalnız bir şeye ihtiyacımız vardır; çalışkan olmak!', author: 'Mustafa Kemal Atatürk' },
  { text: 'Zafer, "zafer benimdir" diyebilenindir. Başarı ise "başaracağım" diye başlayanın.', author: 'Mustafa Kemal Atatürk' },
  { text: 'Dinlenmemek üzere yürümeye karar verenler, asla ve asla yorulmazlar.', author: 'Mustafa Kemal Atatürk' },
  { text: 'Büyük başarılar, her gün atılan küçük ve istikrarlı adımlarla inşa edilir.', author: 'Geliştirici İlkesi' },
  { text: 'Bugün yazdığın her satır kod, yarın hayalindeki projeyi gerçeğe dönüştürür.', author: 'Yazılım Motivasyonu' }
];

export const StatsBanner: React.FC = () => {
  const {
    profile,
    overallPercentage,
    completedWeeksCount,
    completedTasks,
    totalTasks,
    totalHours,
    activeWeekNumber,
    currentStreak,
    celebrate
  } = useTracker();

  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-linear-to-br from-white via-stone-50/60 to-red-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-red-950/20 p-6 sm:p-8 shadow-xs">
      {/* Decorative subtle ambient warm glow in background */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Welcome & Target statement */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/60 dark:border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="inline-flex items-center gap-1 font-semibold text-red-700 dark:text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              38 Haftalık Çalışma Portalı
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-700 dark:text-stone-300 font-medium">
              Aktif: {activeWeekNumber} / 38. Hafta
            </span>
            {currentStreak > 0 && (
              <>
                <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/70 dark:border-amber-800/60 shadow-2xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  {currentStreak} Gün Seri!
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 text-balance flex items-center gap-2.5">
            <span>Hoş geldin, {profile.name}!</span>
            <span className="text-xl sm:text-2xl select-none" title="Başarılar">✨</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-2xl leading-relaxed">
            {profile.targetGoal || '38 haftalık eğitim sürecindeki çalışmalarını düzenli kaydet ve hedefine adım adım neşeyle ulaş.'}
          </p>

          {/* Cheerful Motivation Quote Capsule */}
          <div className="mt-3.5 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 text-xs text-stone-700 dark:text-stone-300 shadow-2xs backdrop-blur-xs">
            <Quote className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
            <span className="font-medium italic line-clamp-1">
              "{currentQuote.text}"
            </span>
            <span className="text-stone-400 font-normal shrink-0">· {currentQuote.author}</span>
            <button
              onClick={nextQuote}
              title="Yeni İlham Al"
              className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-colors text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Big Percentage Number & Cheerful badge */}
        <div 
          onClick={celebrate}
          title="Tıkla ve Kutla! 🎉"
          className="cursor-pointer group flex items-baseline md:flex-col md:items-end gap-2 md:gap-0 shrink-0 bg-white/80 dark:bg-stone-800/70 hover:bg-white dark:hover:bg-stone-800 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-stone-200/80 dark:border-stone-700/70 hover:border-red-400/80 dark:hover:border-red-500/60 transition-all hover:scale-102 shadow-2xs"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black bg-linear-to-r from-red-600 via-rose-600 to-amber-600 dark:from-red-400 dark:to-amber-400 bg-clip-text text-transparent font-mono tabular-nums">
              %{overallPercentage}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-600 dark:text-stone-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            <span>{overallPercentage === 100 ? '🎉 Tebrikler, Tamamlandı!' : 'Genel İlerleme'}</span>
            <Sparkles className="w-3 h-3 text-amber-500 opacity-70 group-hover:opacity-100" />
          </div>
        </div>
      </div>

      {/* Progress Bar with 38-Week Milestone Markers */}
      <div className="py-6">
        <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-2 font-mono tabular-nums">
          <span className="font-semibold text-stone-700 dark:text-stone-300">🚩 1. H: Başlangıç</span>
          <span className="hidden sm:inline">12. H: Temel &amp; Web</span>
          <span className="hidden sm:inline">25. H: Full-Stack &amp; Veri</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">🏁 38. H: Mezuniyet</span>
        </div>

        <div className="relative w-full h-3.5 bg-stone-200/80 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-linear-to-r from-red-600 via-rose-500 to-amber-500 dark:from-red-500 dark:via-rose-400 dark:to-amber-400 transition-all duration-700 ease-out rounded-full shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, overallPercentage))}%` }}
          />
        </div>

        {/* Milestone tick indicators */}
        <div className="relative w-full flex justify-between mt-1 text-[10px] text-stone-400 font-mono font-medium">
          <span>0%</span>
          <span className="hidden sm:inline">12. Hafta (31%)</span>
          <span className="hidden sm:inline">25. Hafta (65%)</span>
          <span>38. Hafta (100%)</span>
        </div>
      </div>

      {/* Stats Grid - 4 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800 text-stone-900 dark:text-stone-100">
        {/* Stat 1 */}
        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-800 space-y-0.5 hover:bg-white dark:hover:bg-stone-800 transition-colors">
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Tamamlanan Hafta</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {completedWeeksCount}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ 38</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {38 - completedWeeksCount === 0 ? 'Tüm 38 hafta tamamlandı! 🌟' : `${38 - completedWeeksCount} hafta kaldı`}
          </p>
        </div>

        {/* Stat 2 */}
        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-800 space-y-0.5 hover:bg-white dark:hover:bg-stone-800 transition-colors">
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Tamamlanan Çalışma</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {completedTasks}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ {totalTasks}</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {totalTasks > 0 ? `%${Math.round((completedTasks / totalTasks) * 100)} tamamlama oranı` : 'Henüz çalışma yok'}
          </p>
        </div>

        {/* Stat 3 */}
        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-800 space-y-0.5 hover:bg-white dark:hover:bg-stone-800 transition-colors">
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Toplam Süre</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tabular-nums text-red-600 dark:text-red-400">
              {totalHours}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">saat</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Kaydedilen net çalışma
          </p>
        </div>

        {/* Stat 4 */}
        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-800 space-y-0.5 hover:bg-white dark:hover:bg-stone-800 transition-colors">
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Yetenekler &amp; Araçlar</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {profile.technologies.length}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">yetkinlik</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Öğrenilen teknolojiler
          </p>
        </div>
      </div>
    </div>
  );
};
