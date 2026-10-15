import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { StudyTask } from '../types/tracker';
import { formatExternalUrl } from '../utils/helpers';
import { X, Plus, Calendar, Clock, ExternalLink, Edit3, Trash2, CheckCircle, Clock3, CircleDot, Target, Gamepad2, Globe, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeModal } from './QRCodeModal';

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
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalCustomData, setQrModalCustomData] = useState<{ url: string; title: string; weekNum?: number } | null>(null);

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
                Haftalık Bağlantı (Google Drive veya Canlı Proje / Oyun URL)
              </label>
              <input
                type="url"
                value={editDriveLink}
                onChange={(e) => setEditDriveLink(e.target.value)}
                placeholder="https://drive.google.com/... veya https://nurullahxx1.github.io/controlhub/"
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Tüm ziyaretçilerin erişebileceği Google Drive klasörü veya canlı proje/oyun web bağlantısı.
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

        {/* Resource Banner if available (Google Drive or Live Web / Game Project) */}
        {(() => {
          const resUrl = currentWeekMeta.driveLink || tasks.find((t) => Boolean(t.link))?.link;
          if (!resUrl) return null;
          const isDriveRes = resUrl.includes('drive.google.com');
          const isGameRes = resUrl.includes('nurullahoyunlarr') || resUrl.includes('vercel.app');

          if (isDriveRes) {
            return (
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
                  href={formatExternalUrl(resUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-xs"
                >
                  <span>Drive Klasörünü Aç</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          }

          if (isGameRes) {
            return (
              <div className="px-6 py-3.5 bg-purple-50/90 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Gamepad2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-1.5">
                      <span>Canlı Web Projesi: Nurullah Oyunlar</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-200/80 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">Vercel</span>
                    </div>
                    <div className="text-[11px] text-purple-700/80 dark:text-purple-300/80">
                      3. haftaya ait geliştirilen canlı web tabanlı oyun projeleri ve uygulama çıktısı
                    </div>
                  </div>
                </div>
                <a
                  href={formatExternalUrl(resUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg transition-colors shadow-xs"
                >
                  <span>Oyunu / Projeyi Aç</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          }

          const isControlHubRes = resUrl.includes('controlhub') || resUrl.includes('github.io') || currentWeekMeta.weekNumber === 4;

          if (isControlHubRes) {
            return (
              <div className="px-6 py-4 bg-teal-50/90 dark:bg-teal-950/40 border-b border-teal-200/80 dark:border-teal-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* High-contrast QR Code preview container */}
                  <div
                    onClick={() => {
                      setQrModalCustomData({
                        url: formatExternalUrl(resUrl),
                        title: 'ControlHub - 4. Hafta Projesi',
                        weekNum: currentWeekMeta.weekNumber
                      });
                      setIsQrModalOpen(true);
                    }}
                    className="p-1.5 bg-white rounded-xl border-2 border-teal-300 dark:border-teal-700 shadow-sm shrink-0 cursor-pointer hover:scale-105 hover:border-teal-500 transition-all group"
                    title="QR Kodu tam boyutta görmek ve indirmek için tıklayın"
                  >
                    <QRCodeSVG
                      value={formatExternalUrl(resUrl)}
                      size={72}
                      level="H"
                      marginSize={1}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                    />
                    <div className="mt-1 text-[9px] font-mono font-bold text-center text-teal-800 flex items-center justify-center gap-0.5">
                      <QrCode className="w-2.5 h-2.5" />
                      <span>Büyüt</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-teal-900 dark:text-teal-100 flex flex-wrap items-center gap-1.5">
                      <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Canlı Web Projesi: ControlHub</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-200/90 dark:bg-teal-900 text-teal-900 dark:text-teal-200 rounded">GitHub Pages</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300/80 dark:border-emerald-800 flex items-center gap-1">
                        <QrCode className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Mobil QR Kod Hazır</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-teal-700/90 dark:text-teal-300/90 mt-1 max-w-lg leading-relaxed">
                      4. haftaya ait ControlHub kontrol paneli ve canlı web uygulaması. Telefon kameranızı QR koda doğrultarak veya &quot;Projeyi Aç&quot; butonuyla doğrudan erişebilirsiniz.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setQrModalCustomData({
                        url: formatExternalUrl(resUrl),
                        title: 'ControlHub - 4. Hafta Projesi',
                        weekNum: currentWeekMeta.weekNumber
                      });
                      setIsQrModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-white dark:bg-stone-800 hover:bg-teal-100/70 dark:hover:bg-stone-700 border border-teal-300 dark:border-teal-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Büyüt &amp; İndir</span>
                  </button>

                  <a
                    href={formatExternalUrl(resUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg transition-colors shadow-xs"
                  >
                    <span>Projeyi Aç</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          }

          return (
            <div className="px-6 py-3.5 bg-stone-100/90 dark:bg-stone-800/50 border-b border-stone-200/80 dark:border-stone-700/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    Haftalık Çalışma &amp; Proje Bağlantısı
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    Bu haftaya ait paylaşılan harici çalışma ve kaynak adresi
                  </div>
                </div>
              </div>
              <a
                href={formatExternalUrl(resUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 rounded-lg transition-colors shadow-xs"
              >
                <span>Bağlantıyı Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })()}

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
                        ) : (task.link.includes('controlhub') || task.link.includes('github.io')) ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={formatExternalUrl(task.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:text-teal-300 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 rounded-lg transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
                              <span>ControlHub Projesini Aç</span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setQrModalCustomData({
                                  url: formatExternalUrl(task.link),
                                  title: 'ControlHub - 4. Hafta Projesi',
                                  weekNum: task.weekNumber
                                });
                                setIsQrModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-100/80 hover:bg-teal-200/90 dark:bg-teal-900/60 dark:hover:bg-teal-800/70 border border-teal-300 dark:border-teal-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>QR Kod</span>
                            </button>
                          </div>
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

      {/* QR Code Modal for Week or Task */}
      {isQrModalOpen && (
        <QRCodeModal
          isOpen={isQrModalOpen}
          onClose={() => {
            setIsQrModalOpen(false);
            setQrModalCustomData(null);
          }}
          url={qrModalCustomData?.url || (currentWeekMeta.driveLink ? formatExternalUrl(currentWeekMeta.driveLink) : 'https://nurullahxx1.github.io/controlhub/')}
          title={qrModalCustomData?.title || 'ControlHub - 4. Hafta Projesi'}
          weekNumber={qrModalCustomData?.weekNum || currentWeekMeta.weekNumber}
        />
      )}
    </div>
  );
};
