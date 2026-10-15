/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { WeeklyMatrix } from './components/WeeklyMatrix';
import { WeeklyCard } from './components/WeeklyCard';
import { WeekDetailModal } from './components/WeekDetailModal';
import { TaskModal } from './components/TaskModal';
import { AllTasksView } from './components/AllTasksView';
import { AboutView } from './components/AboutView';
import { StudyTimerModal } from './components/StudyTimerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ToastContainer } from './components/ToastContainer';
import { InsightsView } from './components/InsightsView';
import { CommandPalette } from './components/CommandPalette';
import { PrintReportModal } from './components/PrintReportModal';
import { QRCodeModal } from './components/QRCodeModal';
import { StudyTask } from './types/tracker';
import { Search, Filter, Layers, CheckCircle2, BookOpen, BarChart3, User, Calendar, Shield } from 'lucide-react';

function TrackerApp() {
  const {
    weeks,
    activeTab,
    setActiveTab,
    selectedWeek,
    setSelectedWeek,
    activeWeekNumber,
    isAdmin,
    openAdminLogin,
    logoutAdmin,
    toasts,
    dismissToast
  } = useTracker();

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<StudyTask | null>(null);
  const [modalDefaultWeek, setModalDefaultWeek] = useState<number>(1);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    url: string;
    title?: string;
    weekNumber?: number;
  }>({
    isOpen: false,
    url: 'https://nurullahxx1.github.io/controlhub/',
    title: 'ControlHub - 4. Hafta Projesi',
    weekNumber: 4
  });

  // Overview week filters
  const [overviewSearch, setOverviewSearch] = useState('');
  const [overviewPhaseFilter, setOverviewPhaseFilter] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');

  const handleOpenNewTask = (weekNumber?: number) => {
    if (!isAdmin) {
      openAdminLogin('Yeni çalışma eklemek için lütfen yönetici girişi yapınız.');
      return;
    }
    setTaskToEdit(null);
    setModalDefaultWeek(weekNumber || selectedWeek || activeWeekNumber || 1);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task?: StudyTask, defaultWeek?: number) => {
    if (!isAdmin) {
      openAdminLogin('Çalışmayı düzenlemek için lütfen yönetici girişi yapınız.');
      return;
    }
    setTaskToEdit(task || null);
    setModalDefaultWeek(defaultWeek || task?.weekNumber || 1);
    setIsTaskModalOpen(true);
  };

  const handleLogFromTimer = (durationHours: number, targetWeek: number) => {
    if (!isAdmin) {
      openAdminLogin('Zamanlayıcı çalışmasını kaydetmek için lütfen yönetici girişi yapınız.');
      return;
    }
    setTaskToEdit(null);
    setModalDefaultWeek(targetWeek);
    setIsTaskModalOpen(true);
  };

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, N for New Task, T for Timer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette trigger
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleOpenNewTask();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsTimerOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWeek, activeWeekNumber]);

  // Filtered weeks for Overview
  const filteredWeeks = weeks.filter((w) => {
    if (overviewSearch.trim()) {
      const q = overviewSearch.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchGoal = w.goal.toLowerCase().includes(q);
      const matchWeek = `${w.weekNumber}`.includes(q);
      if (!matchTitle && !matchGoal && !matchWeek) return false;
    }

    if (overviewPhaseFilter === 'phase1' && (w.weekNumber < 1 || w.weekNumber > 12)) return false;
    if (overviewPhaseFilter === 'phase2' && (w.weekNumber < 13 || w.weekNumber > 25)) return false;
    if (overviewPhaseFilter === 'phase3' && (w.weekNumber < 26 || w.weekNumber > 38)) return false;

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-stone-300 dark:selection:bg-stone-700">
      {/* Top Navbar */}
      <Navbar
        onOpenNewTask={() => handleOpenNewTask()}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onLock={isAdmin ? logoutAdmin : () => openAdminLogin()}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 sm:pb-8">
        {/* Visitor Mode Banner (When not in admin mode) */}
        {!isAdmin && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-start sm:items-center gap-2.5 text-stone-600 dark:text-stone-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1 sm:mt-0" />
              <span>
                <strong className="font-semibold text-stone-900 dark:text-stone-100">Ziyaretçi Modu:</strong> 38 haftalık çalışma süreçlerini ve paylaşılan Google Drive dökümanlarını serbestçe inceleyebilirsiniz. Hafta adı belirlemek veya yeni çalışma eklemek için lütfen sağ üstten <strong>Admin Girişi</strong> yapınız.
              </span>
            </div>
            <button
              onClick={() => openAdminLogin('Yeni çalışma eklemek ve düzenleme yapmak için yönetici girişi yapınız.')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300/80 dark:border-stone-700 rounded-lg transition-colors shrink-0"
            >
              <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Admin Girişi Yap</span>
            </button>
          </div>
        )}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome & Stats Banner */}
            <StatsBanner />

            {/* 38-Week Progress Matrix */}
            <WeeklyMatrix onSelectWeek={(num) => setSelectedWeek(num)} />

            {/* 38-Week Curriculum Section */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                    38 Haftalık Çalışma Takvimi
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    Haftalık hedeflerinizi görüntüleyin, çalışma ekleyin ve detaylara göz atın.
                  </p>
                </div>

                {/* Search & Phase Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Hafta veya konu ara..."
                      value={overviewSearch}
                      onChange={(e) => setOverviewSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 w-48 sm:w-56"
                    />
                  </div>

                  {/* Interactive Segmented Controls for Phase Filter */}
                  <div className="flex items-center gap-1 p-1 bg-stone-200/60 dark:bg-stone-900 rounded-lg text-xs font-medium">
                    <button
                      onClick={() => setOverviewPhaseFilter('all')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        overviewPhaseFilter === 'all'
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      Tümü (1-38)
                    </button>
                    <button
                      onClick={() => setOverviewPhaseFilter('phase1')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        overviewPhaseFilter === 'phase1'
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      1-12. H (Temel)
                    </button>
                    <button
                      onClick={() => setOverviewPhaseFilter('phase2')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        overviewPhaseFilter === 'phase2'
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      13-25. H (Gelişim)
                    </button>
                    <button
                      onClick={() => setOverviewPhaseFilter('phase3')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        overviewPhaseFilter === 'phase3'
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      26-38. H (İleri)
                    </button>
                  </div>
                </div>
              </div>

              {/* 38 Week Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredWeeks.map((week) => (
                  <WeeklyCard
                    key={week.weekNumber}
                    week={week}
                    onSelectWeek={(num) => setSelectedWeek(num)}
                    onQuickAdd={(num) => handleOpenNewTask(num)}
                    onOpenQr={(url, title, weekNum) =>
                      setQrModal({
                        isOpen: true,
                        url,
                        title: title || `${weekNum}. Hafta Projesi`,
                        weekNumber: weekNum
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'all-tasks' && (
          <AllTasksView
            onOpenTaskModal={(task, defWeek) => handleEditTask(task, defWeek)}
            onSelectWeek={(num) => setSelectedWeek(num)}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            onSelectWeek={(num) => setSelectedWeek(num)}
            onOpenPrintReport={() => setIsPrintReportOpen(true)}
          />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Week Details Modal */}
      <WeekDetailModal
        weekNumber={selectedWeek}
        onClose={() => setSelectedWeek(null)}
        onOpenTaskModal={(task, defWeek) => handleEditTask(task, defWeek)}
      />

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        defaultWeek={modalDefaultWeek}
      />

      {/* Study Focus Timer Modal */}
      <StudyTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onLogStudy={handleLogFromTimer}
        defaultWeek={selectedWeek || activeWeekNumber || 1}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenNewTask={() => handleOpenNewTask()}
        onOpenTimer={() => setIsTimerOpen(true)}
        onSelectWeek={(num) => setSelectedWeek(num)}
        onSelectTask={(task) => handleEditTask(task, task.weekNumber)}
        onOpenPrintReport={() => setIsPrintReportOpen(true)}
        onLock={isAdmin ? logoutAdmin : () => openAdminLogin()}
      />

      {/* Printable Report Modal */}
      <PrintReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
      />

      {/* Global QR Code Modal */}
      <QRCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal((prev) => ({ ...prev, isOpen: false }))}
        url={qrModal.url}
        title={qrModal.title}
        weekNumber={qrModal.weekNumber}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 py-6 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-red-500/40 shrink-0">
              <img
                src="/logo.png"
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/atatuerk_logo_1791394727051.jpg';
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-stone-100">Çalışma Takipçisi</span>
              <span aria-hidden="true">·</span>
              <span>38 Haftalık Eğitim &amp; Çalışma Portalı</span>
              <span aria-hidden="true" className="hidden md:inline">·</span>
              <span className="hidden md:inline text-stone-400">Her gün bir adım daha ileri 🚀</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-mono"
            >
              Komut Paleti (⌘K)
            </button>
            <button
              onClick={() => handleOpenNewTask()}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              + Çalışma Ekle
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-medium"
            >
              Başa Dön ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Visible on mobile/tablet) */}
      <nav
        aria-label="Mobil Gezinme"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-3 py-2 flex items-center justify-around text-[10px] font-medium text-stone-600 dark:text-stone-400"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'overview' ? 'text-stone-900 dark:text-stone-100 font-bold' : ''
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Genel Bakış</span>
        </button>
        <button
          onClick={() => setActiveTab('all-tasks')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'all-tasks' ? 'text-stone-900 dark:text-stone-100 font-bold' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Çalışmalar</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'insights' ? 'text-stone-900 dark:text-stone-100 font-bold' : ''
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analiz</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'about' ? 'text-stone-900 dark:text-stone-100 font-bold' : ''
          }`}
        >
          <User className="w-4 h-4" />
          <span>Hakkımda</span>
        </button>
      </nav>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <TrackerApp />
    </TrackerProvider>
  );
}
