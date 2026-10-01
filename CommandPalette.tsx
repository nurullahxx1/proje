import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from '../context/TrackerContext';
import { StudyTask } from '../types/tracker';
import { Search, Plus, Timer, Moon, Sun, Lock, Download, FileSpreadsheet, Calendar, BookOpen, User, BarChart3, ArrowRight, Printer } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewTask: () => void;
  onOpenTimer: () => void;
  onSelectWeek: (weekNum: number) => void;
  onSelectTask: (task: StudyTask) => void;
  onOpenPrintReport: () => void;
  onLock: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenNewTask,
  onOpenTimer,
  onSelectWeek,
  onSelectTask,
  onOpenPrintReport,
  onLock
}) => {
  const { weeks, tasks, activeTab, setActiveTab, theme, toggleTheme, exportToCsv, exportData, isAdmin, openAdminLogin } = useTracker();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle escape
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

  // Filter weeks
  const matchedWeeks = weeks
    .filter((w) => {
      if (!query.trim()) return false;
      const q = query.toLowerCase();
      return `${w.weekNumber}`.includes(q) || w.title.toLowerCase().includes(q) || w.goal.toLowerCase().includes(q);
    })
    .slice(0, 5);

  // Filter tasks
  const matchedTasks = tasks
    .filter((t) => {
      if (!query.trim()) return false;
      const q = query.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || `${t.weekNumber}`.includes(q);
    })
    .slice(0, 5);

  // Base navigation actions
  const navigationActions = [
    {
      id: 'nav-overview',
      label: 'Genel Bakış Sayfasına Git',
      icon: <Calendar className="w-4 h-4 text-stone-500" />,
      action: () => {
        setActiveTab('overview');
        onClose();
      }
    },
    {
      id: 'nav-all-tasks',
      label: 'Tüm Çalışmalar Sayfasına Git',
      icon: <BookOpen className="w-4 h-4 text-stone-500" />,
      action: () => {
        setActiveTab('all-tasks');
        onClose();
      }
    },
    {
      id: 'nav-insights',
      label: 'Analiz & Rapor Sayfasına Git',
      icon: <BarChart3 className="w-4 h-4 text-stone-500" />,
      action: () => {
        setActiveTab('insights');
        onClose();
      }
    },
    {
      id: 'nav-about',
      label: 'Hakkımda & Profil Sayfasına Git',
      icon: <User className="w-4 h-4 text-stone-500" />,
      action: () => {
        setActiveTab('about');
        onClose();
      }
    }
  ];

  // Quick tools actions
  const quickActions = [
    {
      id: 'act-new-task',
      label: 'Yeni Çalışma Ekle (Kısayol: N)',
      icon: <Plus className="w-4 h-4 text-emerald-500" />,
      action: () => {
        onClose();
        if (!isAdmin) {
          openAdminLogin('Yeni çalışma eklemek için lütfen yönetici girişi yapınız.');
          return;
        }
        onOpenNewTask();
      }
    },
    {
      id: 'act-timer',
      label: 'Pomodoro & Çalışma Zamanlayıcısı (Kısayol: T)',
      icon: <Timer className="w-4 h-4 text-amber-500" />,
      action: () => {
        onClose();
        onOpenTimer();
      }
    },
    {
      id: 'act-report',
      label: '30 Haftalık Çıktı & Yazdırılabilir Rapor',
      icon: <Printer className="w-4 h-4 text-stone-600 dark:text-stone-300" />,
      action: () => {
        onClose();
        onOpenPrintReport();
      }
    },
    {
      id: 'act-csv',
      label: 'Tüm Çalışmaları Excel/CSV Olarak İndir',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
      action: () => {
        exportToCsv();
        onClose();
      }
    },
    {
      id: 'act-backup',
      label: 'Veri Yedeğini İndir (JSON)',
      icon: <Download className="w-4 h-4 text-stone-500" />,
      action: () => {
        exportData();
        onClose();
      }
    },
    {
      id: 'act-theme',
      label: theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-400" />,
      action: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'act-auth',
      label: isAdmin ? 'Yönetici Oturumunu Kapat (Çıkış Yap)' : 'Yönetici Girişi Yap (Admin Şifresi)',
      icon: <Lock className="w-4 h-4 text-stone-500" />,
      action: () => {
        onClose();
        onLock();
      }
    }
  ];

  const filteredNavActions = navigationActions.filter((a) =>
    !query.trim() || a.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQuickActions = quickActions.filter((a) =>
    !query.trim() || a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-4 h-4 text-stone-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Bir işlem yazın veya hafta, çalışma ara... (örn: 3. Hafta, pomodoro, excel)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-2 space-y-4 flex-1 text-xs">
          {/* Matched Weeks */}
          {matchedWeeks.length > 0 && (
            <div>
              <p className="px-3 py-1 font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider text-[10px]">
                Haftalar
              </p>
              {matchedWeeks.map((w) => (
                <button
                  key={w.weekNumber}
                  onClick={() => {
                    onSelectWeek(w.weekNumber);
                    onClose();
                  }}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">
                      {w.weekNumber}
                    </span>
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">{w.title}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-sm">{w.goal}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <p className="px-3 py-1 font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider text-[10px]">
                Çalışmalar
              </p>
              {matchedTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTask(t);
                    onClose();
                  }}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-stone-400 shrink-0">
                      {t.weekNumber}.H
                    </span>
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">{t.title}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-sm">{t.time} · {t.status}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {filteredQuickActions.length > 0 && (
            <div>
              <p className="px-3 py-1 font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider text-[10px]">
                Hızlı Eylemler &amp; Araçlar
              </p>
              {filteredQuickActions.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="font-medium text-stone-800 dark:text-stone-200">{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          {filteredNavActions.length > 0 && (
            <div>
              <p className="px-3 py-1 font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider text-[10px]">
                Sayfalar
              </p>
              {filteredNavActions.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="font-medium text-stone-800 dark:text-stone-200">{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {matchedWeeks.length === 0 && matchedTasks.length === 0 && filteredQuickActions.length === 0 && filteredNavActions.length === 0 && (
            <div className="py-8 text-center text-stone-400">
              <p className="font-medium">Sonuç bulunamadı</p>
              <p className="text-[11px] mt-0.5">Farklı bir arama kelimesi deneyin.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <span>Kısayol: Ctrl+K / Cmd+K</span>
          <span>Seçmek için tıkla</span>
        </div>
      </div>
    </div>
  );
};
