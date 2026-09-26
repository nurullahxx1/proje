import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { Plus, Sun, Moon, Timer, Lock, Search, BarChart3 } from 'lucide-react';

interface NavbarProps {
  onOpenNewTask: () => void;
  onOpenTimer: () => void;
  onOpenCommandPalette?: () => void;
  onLock?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTask, onOpenTimer, onOpenCommandPalette, onLock }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, completedTasks, totalTasks } = useTracker();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark & Command Palette Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-left font-bold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-100 hover:opacity-85 transition-opacity flex items-baseline gap-1.5"
          >
            <span>nurullah1.1</span>
            <span className="font-normal text-stone-500 dark:text-stone-400 text-xs hidden md:inline">
              · Kişisel Çalışma Takipçisi
            </span>
          </button>

          {/* Quick Command Bar Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              title="Komut Paleti (Ctrl+K)"
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 bg-stone-200/50 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Hızlı Ara...</span>
              <kbd className="px-1.5 py-0.2 text-[10px] font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-400">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2 py-1.5 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 rounded-b-none'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            Genel Bakış
          </button>

          <button
            onClick={() => setActiveTab('all-tasks')}
            className={`px-2 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'all-tasks'
                ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 rounded-b-none'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <span>Çalışmalar</span>
            <span className="font-mono text-xs text-stone-400 dark:text-stone-500 tabular-nums">
              ({totalTasks})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'insights'
                ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 rounded-b-none'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <span>Analiz &amp; Rapor</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-2 py-1.5 rounded-md transition-colors ${
              activeTab === 'about'
                ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 rounded-b-none'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            Hakkımda
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile search button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              title="Komut Paleti (Ctrl+K)"
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Study Timer Button */}
          <button
            onClick={onOpenTimer}
            title="Çalışma Zamanlayıcısı (Pomodoro)"
            aria-label="Çalışma Zamanlayıcısı"
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Timer className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
            aria-label="Tema Değiştir"
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Lock Screen / Logout */}
          {onLock && (
            <button
              onClick={onLock}
              title="Ekranı Kilitle / Çıkış Yap"
              aria-label="Ekranı Kilitle"
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* New Study Button */}
          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Çalışma Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
