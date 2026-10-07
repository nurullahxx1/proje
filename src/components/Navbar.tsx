import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { Plus, Sun, Moon, Timer, Search, Shield, LogOut, Lock, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenNewTask: () => void;
  onOpenTimer: () => void;
  onOpenCommandPalette?: () => void;
  onLock?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTask, onOpenTimer, onOpenCommandPalette, onLock }) => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    totalTasks,
    isAdmin,
    openAdminLogin,
    logoutAdmin,
    soundEnabled,
    toggleSound,
    celebrate
  } = useTracker();

  const handleNewTaskClick = () => {
    if (!isAdmin) {
      openAdminLogin('Yeni çalışma eklemek için lütfen yönetici girişi yapınız.');
      return;
    }
    onOpenNewTask();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Logo, Brand Wordmark & Command Palette Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className="group text-left flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1 -m-1"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-red-600/30 dark:ring-red-500/40 shrink-0 bg-red-600/10 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to generated image directly if needed
                  const target = e.currentTarget;
                  if (!target.src.includes('atatuerk_logo')) {
                    target.src = '/src/assets/images/atatuerk_logo_1791394727051.jpg';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                  Çalışma Takipçisi
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                  38 Hafta
                </span>
              </div>
              <span className="font-medium text-stone-500 dark:text-stone-400 text-[11px] leading-tight hidden sm:inline">
                Eğitim &amp; Proje İlerleme Portalı
              </span>
            </div>
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
        <div className="flex items-center gap-1.5 sm:gap-2">
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

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Ses Efektleri Açık (Kapatmak için tıkla)' : 'Ses Efektleri Kapalı (Açmak için tıkla)'}
            aria-label="Ses Efektlerini Aç/Kapat"
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Cheerful Confetti Party Button */}
          <button
            onClick={celebrate}
            title="Kutlama &amp; Konfeti Patlat! ✨"
            aria-label="Kutlama ve Konfeti"
            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-100/70 dark:hover:bg-amber-950/40 rounded-lg transition-transform hover:scale-110 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
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

          {/* Admin Status / Login & Logout */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5 pl-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Admin Modu</span>
                <span className="sm:hidden">Admin</span>
              </span>
              <button
                onClick={logoutAdmin}
                title="Yönetici Oturumunu Kapat (Ziyaretçi moduna dön)"
                aria-label="Yönetici Oturumunu Kapat"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Çıkış</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAdminLogin('Sitede düzenleme yapmak ve yeni çalışma eklemek için yönetici girişi yapınız.')}
              title="Yönetici Girişi (İçerik düzenleme yetkisi)"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300/70 dark:border-stone-700 rounded-lg transition-colors shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Admin Girişi</span>
            </button>
          )}

          {/* New Study Button */}
          <button
            onClick={handleNewTaskClick}
            title={isAdmin ? 'Yeni Çalışma Ekle' : 'Çalışma eklemek için yönetici girişi yapın'}
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

