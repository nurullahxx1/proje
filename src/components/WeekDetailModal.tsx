import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { StudyTask } from '../types/tracker';
import { formatExternalUrl } from '../utils/helpers';
import { X, Plus, Calendar, Clock, ExternalLink, Edit3, Trash2, CheckCircle, Clock3, CircleDot, Target } from 'lucide-react';

interface WeekDetailModalProps {
  weekNumber: number | null;
  onClose: () => void;
  onOpenTaskModal: (task?: StudyTask, defaultWeek?: number) => void;
}

export const WeekDetailModal: React.FC<WeekDetailModalProps> = ({
  weekNumber,
  onClose,
  onOpenTaskModal
}) => {
  const {
    weeks,
    getWeekTasks,
    getWeekStatus,
    getWeekHours,
    toggleTaskStatus,
    deleteTask,
    updateWeek,
    isAdmin,
    openAdminLogin
  } = useTracker();

  const [isEditingWeekInfo, setIsEditingWeekInfo] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editDriveLink, setEditDriveLink] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && weekNumber !== null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [weekNumber, onClose]);

  if (weekNumber === null) return null;

  const currentWeekMeta = weeks.find((w) => w.weekNumber === weekNumber) || {
    weekNumber,
    title: `${weekNumber}. Hafta`,
    goal: ''
  };

  const tasks = getWeekTasks(weekNumber);
  const status = getWeekStatus(weekNumber);
  const hours = getWeekHours(weekNumber);
  const completedCount = tasks.filter((t) => t.status === 'Tamamlandı').length;

  const handleStartEditWeek = () => {
    if (!isAdmin) {
      openAdminLogin('Haftanın adını ve hedeflerini sadece yönetici belirleyebilir. Lütfen yönetici girişi yapınız.');
      return;
    }
    setEditTitle(currentWeekMeta.title);
    setEditGoal(currentWeekMeta.goal || '');
    setEditDriveLink(currentWeekMeta.driveLink || '');
    setIsEditingWeekInfo(true);
  };

  const handleAddTaskClick = () => {
    if (!isAdmin) {
      openAdminLogin('Bu haftaya çalışma eklemek için lütfen yönetici girişi yapınız.');
      return;
    }
    onOpenTaskModal(undefined, weekNumber);
  };

  const handleEditTaskClick = (task: StudyTask) => {
    if (!isAdmin) {
      openAdminLogin('Çalışmayı düzenlemek için lütfen yönetici girişi yapınız.');
      return;
    }
    onOpenTaskModal(task, weekNumber);
  };

  const handleDeleteTaskClick = (taskId: string) => {
    if (!isAdmin) {
      openAdminLogin('Çalışmayı silmek için lütfen yönetici girişi yapınız.');
      return;
    }
    if (confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) {
      deleteTask(taskId);
    }
  };

  const handleToggleStatusClick = (taskId: string) => {
    if (!isAdmin) {
      openAdminLogin('Çalışma durumunu değiştirmek için lütfen yönetici girişi yapınız.');
      return;
    }
    toggleTaskStatus(taskId);
  };

  const handleSaveWeek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      openAdminLogin('Haftayı güncellemek için yönetici girişi yapmalısınız.');
      return;
    }
    updateWeek(weekNumber, {
      title: editTitle.trim() || `${weekNumber}. Hafta`,
      goal: editGoal.trim(),
      driveLink: editDriveLink.trim() || undefined
    });
    setIsEditingWeekInfo(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        className="w-full max-w-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
                {String(weekNumber).padStart(2, '0')} / 38. Hafta
              </span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-medium ${
                  status === 'Tamamlandı'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : status === 'Devam ediyor'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {status}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{hours} saat</span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
              {currentWeekMeta.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartEditWeek}
              title={isAdmin ? "Hafta Başlığı ve Bilgilerini Belirle" : "Hafta adını sadece yönetici belirleyebilir"}
              className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="hidden sm:inline font-medium">
                {isAdmin ? 'Hafta Adını Belirle' : 'Yönetici: Ad Belirle'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week Goal / Edit Section */}
        {isEditingWeekInfo ? (
          <form onSubmit={handleSaveWeek} className="p-4 bg-stone-50 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Hafta Adı / Başlığı (Sadece Yönetici Belirleyebilir)
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={`${weekNumber}. Hafta`}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                İsim yazmazsanız varsayılan olarak sadece "{weekNumber}. Hafta" yazar.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Haftalık Açıklama (Sadece Yönetici Belirleyebilir)
              </label>
              <textarea
                rows={2}
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                placeholder="Bu hafta için açıklama yazınız (İsteğe bağlı)..."
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Açıklamayı sadece yönetici belirleyebilir. Boş bırakırsanız hiçbir açıklama gösterilmez.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Google Drive Klasör / Materyal Bağlantısı (Opsiyonel)
              </label>
              <input
                type="url"
                value={editDriveLink}
                onChange={(e) => setEditDriveLink(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Tüm ziyaretçilerin erişebileceği Google Drive klasör bağlantısı.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingWeekInfo(false)}
                className="px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded-md transition-colors shadow-2xs"
              >
                Kaydet
              </button>
            </div>
          </form>
        ) : currentWeekMeta.goal ? (
          <div className="px-6 py-3.5 bg-stone-50/80 dark:bg-stone-800/30 border-b border-stone-100 dark:border-stone-800/80 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <Target className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div>
                <strong className="font-semibold text-stone-900 dark:text-stone-100">Haftalık Açıklama: </strong>
                {currentWeekMeta.goal}
              </div>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleStartEditWeek}
                className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 underline shrink-0"
              >
                Açıklamayı Düzenle
              </button>
            )}
          </div>
        ) : isAdmin ? (
          <div className="px-6 py-3 bg-stone-50/80 dark:bg-stone-800/30 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Target className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Bu hafta için açıklama girilmedi. Yalnızca yönetici açıklama ekleyebilir.</span>
            </div>
            <button
              type="button"
              onClick={handleStartEditWeek}
              className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 underline shrink-0"
            >
              Açıklama Ekle
            </button>
          </div>
        ) : null}

        {/* Drive Resource Banner if available */}
        {(currentWeekMeta.driveLink || tasks.some((t) => t.link?.includes('drive.google.com'))) && (
          <div className="px-6 py-3.5 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm3.43 6l4.29 7.5H22l-4.29-7.5h-6.57zm5.14-6l-3.43 6h6.57l3.43-6h-6.57z"/>
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-1.5">
                  <span>Google Drive Çalışma &amp; Döküman Klasörü</span>
                </div>
                <div className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                  Bu haftaya ait paylaşılan tüm ders notları ve kaynak dosyaları
                </div>
              </div>
            </div>
            <a
              href={formatExternalUrl(currentWeekMeta.driveLink || tasks.find((t) => t.link?.includes('drive.google.com'))?.link)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-xs"
            >
              <span>Drive Klasörünü Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Sub-bar with count and "+ Add Study" */}
        <div className="px-6 py-3 border-b border-stone-100 dark:border-stone-800/60 flex items-center justify-between">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono tabular-nums">
              {tasks.length}
            </span>{' '}
            çalışma kaydedildi{' '}
            <span className="text-stone-400">
              ({completedCount} tamamlandı)
            </span>
          </div>

          <button
            onClick={handleAddTaskClick}
            title={isAdmin ? "Bu haftaya çalışma ekle" : "Çalışma eklemek için yönetici girişi yapınız"}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Çalışma Ekle</span>
          </button>
        </div>

        {/* Task List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Bu haftaya henüz çalışma eklenmedi
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                Konu başlığı, saat, kaynak linki ve notlarınızı girerek ilk çalışmanızı başlatın.
              </p>
              <button
                onClick={handleAddTaskClick}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Çalışmayı Ekle</span>
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Metadata line: zero-pill compliant */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <button
                        onClick={() => handleToggleStatusClick(task.id)}
                        title={isAdmin ? "Durumu değiştirmek için tıklayın" : "Durumu değiştirmek için yönetici girişi gereklidir"}
                        className="inline-flex items-center gap-1 text-left font-medium hover:underline focus:outline-none"
                      >
                        {task.status === 'Tamamlandı' ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Tamamlandı
                          </span>
                        ) : task.status === 'Devam ediyor' ? (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Clock3 className="w-3.5 h-3.5" />
                            Devam ediyor
                          </span>
                        ) : (
                          <span className="text-stone-500 flex items-center gap-1">
                            <CircleDot className="w-3.5 h-3.5" />
                            Bekliyor
                          </span>
                        )}
                      </button>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{task.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{task.time}</span>
                      {task.category && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            {task.category}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {task.title}
                    </h3>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                        {task.description}
                      </p>
                    )}

                    {/* Link */}
                    {task.link && (
                      <div className="pt-1.5">
                        {task.link.includes('drive.google.com') ? (
                          <a
                            href={formatExternalUrl(task.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/90 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors group/drivelink"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm3.43 6l4.29 7.5H22l-4.29-7.5h-6.57zm5.14-6l-3.43 6h6.57l3.43-6h-6.57z"/>
                            </svg>
                            <span>Google Drive Klasörünü Aç</span>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover/drivelink:opacity-100" />
                          </a>
                        ) : (
                          <a
                            href={formatExternalUrl(task.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:underline font-mono truncate max-w-md"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{task.link}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditTaskClick(task)}
                      title={isAdmin ? "Düzenle" : "Düzenlemek için yönetici girişi gereklidir"}
                      className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTaskClick(task.id)}
                      title={isAdmin ? "Sil" : "Silmek için yönetici girişi gereklidir"}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>İpucu: Çalışma durumunu hızlıca değiştirmek için durum metnine tıklayabilirsiniz.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
