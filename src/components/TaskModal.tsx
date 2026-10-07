import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { StudyTask, TaskStatus, TaskCategory } from '../types/tracker';
import { formatExternalUrl } from '../utils/helpers';
import { X, Calendar, Clock, Link as LinkIcon, FileText, CheckCircle2, AlertCircle, Tag } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: StudyTask | null;
  defaultWeek?: number;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultWeek = 1
}) => {
  const { addTask, updateTask, deleteTask } = useTracker();

  const [title, setTitle] = useState('');
  const [weekNumber, setWeekNumber] = useState<number>(defaultWeek);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('2 saat');
  const [hours, setHours] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Tamamlandı');
  const [category, setCategory] = useState<TaskCategory>('Ders');
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setWeekNumber(taskToEdit.weekNumber);
      setDate(taskToEdit.date);
      setTime(taskToEdit.time);
      setHours(taskToEdit.hours);
      setDescription(taskToEdit.description);
      setLink(taskToEdit.link);
      setStatus(taskToEdit.status);
      setCategory(taskToEdit.category || 'Ders');
    } else {
      setTitle('');
      setWeekNumber(defaultWeek);
      setDate(new Date().toISOString().slice(0, 10));
      setTime('2 saat');
      setHours(2);
      setDescription('');
      setLink('');
      setStatus('Tamamlandı');
      setCategory('Ders');
    }
    setError(null);
  }, [taskToEdit, defaultWeek, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Lütfen bir çalışma başlığı girin.');
      return;
    }

    const formattedLink = formatExternalUrl(link);

    if (taskToEdit) {
      updateTask({
        ...taskToEdit,
        title: title.trim(),
        weekNumber: Number(weekNumber),
        date,
        time: time.trim() || `${hours} saat`,
        hours: Number(hours) || 1,
        description: description.trim(),
        link: formattedLink,
        status,
        category
      });
    } else {
      addTask({
        title: title.trim(),
        weekNumber: Number(weekNumber),
        date,
        time: time.trim() || `${hours} saat`,
        hours: Number(hours) || 1,
        description: description.trim(),
        link: formattedLink,
        status,
        category
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (taskToEdit && confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) {
      deleteTask(taskToEdit.id);
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {taskToEdit ? 'Çalışmayı Düzenle' : 'Yeni Çalışma Ekle'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              30 haftalık eğitim planınıza çalışma kaydı ekleyin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Week & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Hafta Seçimi
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    {w}. Hafta
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Tarih
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Çalışma Başlığı */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Çalışma Başlığı *
            </label>
            <input
              type="text"
              placeholder="Örn: TypeScript Generics & Utility Types"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              required
            />
          </div>

          {/* Saat & Süre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Saat / Süre Metni
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Örn: 2 saat veya 14:00 - 16:30"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Süre (Hesaplanan Saat)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.25"
                max="24"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Durum (Tamamlandı / Devam ediyor / Bekliyor) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Durum
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Tamamlandı', 'Devam ediyor', 'Bekliyor'] as TaskStatus[]).map((st) => {
                const isSelected = status === st;
                return (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setStatus(st)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? st === 'Tamamlandı'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                          : st === 'Devam ediyor'
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-400 text-stone-800 dark:text-stone-200 shadow-xs'
                        : 'bg-transparent border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        st === 'Tamamlandı'
                          ? 'bg-emerald-500'
                          : st === 'Devam ediyor'
                          ? 'bg-amber-500'
                          : 'bg-stone-400'
                      }`}
                    />
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Çalışma Kategorisi
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['Ders', 'Proje', 'Pratik', 'Okuma', 'Genel'] as TaskCategory[]).map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Kaynak / Doküman / Proje Linki
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://github.com/... veya https://docs..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono text-xs"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Açıklama &amp; Notlar
            </label>
            <textarea
              rows={3}
              placeholder="Bu çalışmada ne öğrendiniz, hangi zorluklarla karşılaştınız?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
            {taskToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              >
                Çalışmayı Sil
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-lg transition-colors shadow-xs"
              >
                {taskToEdit ? 'Değişiklikleri Kaydet' : 'Çalışmayı Ekle'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
