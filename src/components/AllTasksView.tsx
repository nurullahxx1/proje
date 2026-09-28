import React, { useState, useMemo } from 'react';
import { useTracker } from '../context/TrackerContext';
import { StudyTask, TaskStatus, TaskCategory } from '../types/tracker';
import { formatExternalUrl } from '../utils/helpers';
import { Search, Filter, Plus, ExternalLink, Edit3, Trash2, CheckCircle2, Clock, CircleDot, ArrowUpDown, FileSpreadsheet } from 'lucide-react';

interface AllTasksViewProps {
  onOpenTaskModal: (task?: StudyTask, defaultWeek?: number) => void;
  onSelectWeek: (weekNumber: number) => void;
}

export const AllTasksView: React.FC<AllTasksViewProps> = ({
  onOpenTaskModal,
  onSelectWeek
}) => {
  const { tasks, toggleTaskStatus, deleteTask, exportToCsv, isAdmin, openAdminLogin } = useTracker();

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'hours-desc' | 'week-asc'>('date-desc');

  // Filtered tasks calculation
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const matchLink = task.link.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLink) return false;
        }

        // Week filter
        if (selectedWeekFilter !== 'all') {
          if (task.weekNumber !== Number(selectedWeekFilter)) return false;
        }

        // Status filter
        if (selectedStatusFilter !== 'all') {
          if (task.status !== selectedStatusFilter) return false;
        }

        // Category filter
        if (selectedCategoryFilter !== 'all') {
          if ((task.category || 'Genel') !== selectedCategoryFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'hours-desc') return (b.hours || 0) - (a.hours || 0);
        if (sortBy === 'week-asc') return a.weekNumber - b.weekNumber;
        return 0;
      });
  }, [tasks, searchQuery, selectedWeekFilter, selectedStatusFilter, selectedCategoryFilter, sortBy]);

  const filteredHours = useMemo(() => {
    return filteredTasks.reduce((sum, t) => sum + (t.hours || 0), 0);
  }, [filteredTasks]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Tüm Çalışmalar
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            30 haftalık eğitim boyunca kaydettiğiniz tüm çalışmaları arayın, filtreleyin ve yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={exportToCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors border border-stone-200 dark:border-stone-700 shadow-xs"
            title="Tüm çalışmaları Excel/CSV olarak indir"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">CSV İndir</span>
          </button>

          <button
            onClick={() => {
              if (!isAdmin) {
                openAdminLogin('Yeni çalışma eklemek için lütfen yönetici girişi yapınız.');
                return;
              }
              onOpenTaskModal();
            }}
            title={isAdmin ? "Yeni Çalışma Ekle" : "Çalışma eklemek için yönetici girişi yapınız"}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Çalışma Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Başlık veya not ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Week Filter */}
          <div>
            <select
              value={selectedWeekFilter}
              onChange={(e) => setSelectedWeekFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="all">Tüm Haftalar (1 - 30)</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  {w}. Hafta
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="Devam ediyor">Devam ediyor</option>
              <option value="Bekliyor">Bekliyor</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Ders">Ders</option>
              <option value="Proje">Proje</option>
              <option value="Pratik">Pratik</option>
              <option value="Okuma">Okuma</option>
              <option value="Genel">Genel</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="date-desc">En Yeni Tarih</option>
              <option value="date-asc">En Eski Tarih</option>
              <option value="hours-desc">En Çok Çalışılan Saat</option>
              <option value="week-asc">Haftaya Göre (1 → 30)</option>
            </select>
          </div>
        </div>

        {/* Results Metadata Line (Zero-pill text) */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span>
              <strong className="text-stone-800 dark:text-stone-200 font-mono tabular-nums">
                {filteredTasks.length}
              </strong>{' '}
              çalışma bulundu
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Toplam:{' '}
              <strong className="text-stone-800 dark:text-stone-200 font-mono tabular-nums">
                {filteredHours} saat
              </strong>
            </span>
          </div>

          {(searchQuery || selectedWeekFilter !== 'all' || selectedStatusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWeekFilter('all');
                setSelectedStatusFilter('all');
              }}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline text-xs"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <p className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {tasks.length === 0 ? 'Henüz hiçbir çalışma eklemediniz' : 'Aramanızla eşleşen çalışma bulunamadı'}
          </p>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5 max-w-md mx-auto leading-relaxed">
            {tasks.length === 0
              ? 'Tüm haftalar temiz ve hazır. İstediğiniz haftayı seçerek veya aşağıdaki butona tıklayarak çalışmalarınızı kendiniz ekleyebilirsiniz.'
              : 'Farklı bir arama terimi deneyin veya filtreleri sıfırlayın.'}
          </p>
          {tasks.length === 0 ? (
            <button
              onClick={() => onOpenTaskModal()}
              className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Çalışmamı Ekle</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWeekFilter('all');
                setSelectedStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Tüm Çalışmaları Göster
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                {/* Zero-pill metadata line */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <button
                    onClick={() => onSelectWeek(task.weekNumber)}
                    className="font-mono font-semibold text-stone-900 dark:text-stone-100 hover:underline"
                  >
                    {task.weekNumber}. Hafta
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => {
                      if (!isAdmin) {
                        openAdminLogin('Çalışma durumunu değiştirmek için lütfen yönetici girişi yapınız.');
                        return;
                      }
                      toggleTaskStatus(task.id);
                    }}
                    title={isAdmin ? "Durumu değiştirmek için tıklayın" : "Durumu değiştirmek için yönetici girişi gereklidir"}
                    className="inline-flex items-center gap-1 font-medium hover:underline focus:outline-none"
                  >
                    {task.status === 'Tamamlandı' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Tamamlandı
                      </span>
                    ) : task.status === 'Devam ediyor' ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
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
                      <span className="font-medium text-stone-600 dark:text-stone-300">
                        {task.category}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
                    {task.description}
                  </p>
                )}

                {/* Link */}
                {task.link && (
                  <div>
                    <a
                      href={formatExternalUrl(task.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:underline font-mono truncate max-w-md"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{task.link}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    if (!isAdmin) {
                      openAdminLogin('Çalışmayı düzenlemek için lütfen yönetici girişi yapınız.');
                      return;
                    }
                    onOpenTaskModal(task, task.weekNumber);
                  }}
                  title={isAdmin ? "Düzenle" : "Düzenlemek için yönetici girişi gereklidir"}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => {
                    if (!isAdmin) {
                      openAdminLogin('Çalışmayı silmek için lütfen yönetici girişi yapınız.');
                      return;
                    }
                    if (confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) {
                      deleteTask(task.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title={isAdmin ? "Sil" : "Silmek için yönetici girişi gereklidir"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
