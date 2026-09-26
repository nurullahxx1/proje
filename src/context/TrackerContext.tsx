import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { StudyTask, WeekMeta, UserProfile, ActiveTab, TaskStatus, Technology, ToastMessage, ToastType } from '../types/tracker';
import { INITIAL_TASKS, INITIAL_WEEKS, INITIAL_PROFILE } from '../data/initialData';

interface TrackerContextType {
  tasks: StudyTask[];
  weeks: WeekMeta[];
  profile: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedWeek: number | null;
  setSelectedWeek: (week: number | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;

  // Task actions
  addTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => StudyTask;
  updateTask: (task: StudyTask) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  // Week actions
  updateWeek: (weekNumber: number, data: Partial<WeekMeta>) => void;
  getWeekTasks: (weekNumber: number) => StudyTask[];
  getWeekStatus: (weekNumber: number) => 'Tamamlandı' | 'Devam ediyor' | 'Bekliyor' | 'Başlanmadı';
  getWeekHours: (weekNumber: number) => number;
  
  // Profile actions
  updateProfile: (data: Partial<UserProfile>) => void;
  addTechnology: (tech: Omit<Technology, 'id'>) => void;
  removeTechnology: (id: string) => void;
  
  // Data management
  exportData: () => void;
  exportToCsv: () => void;
  importData: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  loadSampleData: () => void;
  
  // Computed stats
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalHours: number;
  overallPercentage: number;
  completedWeeksCount: number;
  activeWeekNumber: number;
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'study_tracker_tasks_v2',
  WEEKS: 'study_tracker_weeks_v2',
  PROFILE: 'study_tracker_profile_v2',
  THEME: 'study_tracker_theme_v1'
};

export const TrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Tasks state
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Weeks state
  const [weeks, setWeeks] = useState<WeekMeta[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEEKS);
      return saved ? JSON.parse(saved) : INITIAL_WEEKS;
    } catch {
      return INITIAL_WEEKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(weeks));
    } catch {
      // ignore
    }
  }, [weeks]);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [...prev.slice(-3), newToast]); // keep max 4 toasts

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  }, [dismissToast]);

  // Task methods
  const addTask = (taskData: Omit<StudyTask, 'id' | 'createdAt'>): StudyTask => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Çalışma Eklendi', `"${newTask.title}" ${newTask.weekNumber}. haftaya başarıyla kaydedildi.`, 'success');
    return newTask;
  };

  const updateTask = (updatedTask: StudyTask) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    showToast('Çalışma Güncellendi', `"${updatedTask.title}" güncellendi.`, 'success');
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Çalışma Silindi', taskToDelete ? `"${taskToDelete.title}" kaldırıldı.` : 'Çalışma silindi.', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        let nextStatus: TaskStatus = 'Tamamlandı';
        if (t.status === 'Bekliyor') nextStatus = 'Devam ediyor';
        else if (t.status === 'Devam ediyor') nextStatus = 'Tamamlandı';
        else if (t.status === 'Tamamlandı') nextStatus = 'Bekliyor';
        showToast('Durum Güncellendi', `"${t.title}" → ${nextStatus}`, 'info');
        return { ...t, status: nextStatus };
      })
    );
  };

  // Week methods
  const updateWeek = (weekNumber: number, data: Partial<WeekMeta>) => {
    setWeeks(prev =>
      prev.map(w => (w.weekNumber === weekNumber ? { ...w, ...data } : w))
    );
    showToast('Hafta Güncellendi', `${weekNumber}. Hafta bilgileri ve hedefleri kaydedildi.`, 'success');
  };

  const getWeekTasks = (weekNumber: number): StudyTask[] => {
    return tasks.filter(t => t.weekNumber === weekNumber);
  };

  const getWeekHours = (weekNumber: number): number => {
    return Number(
      tasks
        .filter(t => t.weekNumber === weekNumber)
        .reduce((sum, t) => sum + (t.hours || 0), 0)
        .toFixed(1)
    );
  };

  const getWeekStatus = (weekNumber: number): 'Tamamlandı' | 'Devam ediyor' | 'Bekliyor' | 'Başlanmadı' => {
    const weekTasks = tasks.filter(t => t.weekNumber === weekNumber);
    if (weekTasks.length === 0) return 'Başlanmadı';
    const allCompleted = weekTasks.every(t => t.status === 'Tamamlandı');
    if (allCompleted) return 'Tamamlandı';
    const anyInProgress = weekTasks.some(t => t.status === 'Devam ediyor');
    if (anyInProgress) return 'Devam ediyor';
    const anyCompleted = weekTasks.some(t => t.status === 'Tamamlandı');
    if (anyCompleted) return 'Devam ediyor';
    return 'Bekliyor';
  };

  // Profile methods
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    showToast('Profil Güncellendi', 'Kişisel profil bilgileriniz başarıyla güncellendi.', 'success');
  };

  const addTechnology = (tech: Omit<Technology, 'id'>) => {
    const newTech: Technology = {
      ...tech,
      id: `tech-${Date.now()}`
    };
    setProfile(prev => ({
      ...prev,
      technologies: [...prev.technologies, newTech]
    }));
    showToast('Teknoloji Eklendi', `"${tech.name}" listenize eklendi.`, 'success');
  };

  const removeTechnology = (id: string) => {
    const tech = profile.technologies.find(t => t.id === id);
    setProfile(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t.id !== id)
    }));
    showToast('Teknoloji Kaldırıldı', tech ? `"${tech.name}" kaldırıldı.` : 'Teknoloji kaldırıldı.', 'info');
  };

  // Backup / Reset
  const exportData = () => {
    const data = {
      app: 'nurullah1.1',
      version: 2,
      exportedAt: new Date().toISOString(),
      tasks,
      weeks,
      profile
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nurullah1.1-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Yedek İndirildi', 'Verileriniz JSON dosyası olarak kaydedildi.', 'success');
  };

  const exportToCsv = () => {
    if (tasks.length === 0) {
      showToast('Dışa Aktarma', 'Henüz dışa aktarılacak bir çalışma kaydı bulunmuyor.', 'info');
      return;
    }

    const headers = ['Hafta', 'Başlık', 'Tarih', 'Saat/Süre Metni', 'Hesaplanan Saat', 'Durum', 'Kategori', 'Link', 'Açıklama'];
    const rows = tasks.map(t => [
      `${t.weekNumber}. Hafta`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.date || '',
      `"${(t.time || '').replace(/"/g, '""')}"`,
      t.hours || 0,
      t.status || '',
      t.category || 'Genel',
      `"${(t.link || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nurullah1.1-calismalar-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Excel/CSV İndirildi', 'Çalışmalarınız CSV formatında başarıyla kaydedildi.', 'success');
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
      }
      if (Array.isArray(parsed.weeks)) {
        setWeeks(parsed.weeks);
      }
      if (parsed.profile && typeof parsed.profile === 'object') {
        setProfile(parsed.profile);
      }
      showToast('Yedek Yüklendi', 'Tüm çalışmalar ve profil başarıyla içe aktarıldı.', 'success');
      return true;
    } catch {
      showToast('İçe Aktarma Hatası', 'Yüklenen dosya geçerli bir yedek JSON formatında değil.', 'error');
      return false;
    }
  };

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setWeeks(INITIAL_WEEKS);
    setProfile(INITIAL_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.WEEKS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    showToast('Sıfırlandı', 'Tüm haftalar ve çalışmalar temiz başlangıç durumuna döndürüldü.', 'info');
  };

  const loadSampleData = () => {
    const sampleTasks: StudyTask[] = [
      {
        id: `sample-1`,
        weekNumber: 1,
        title: 'Modern JavaScript (ES6+) & DOM Mimarisi',
        date: new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10),
        time: '3 saat',
        hours: 3,
        description: 'Arrow functions, destructuring, modules, promises ve async/await pratikleri yapıldı.',
        link: 'https://javascript.info',
        status: 'Tamamlandı',
        createdAt: new Date().toISOString()
      },
      {
        id: `sample-2`,
        weekNumber: 1,
        title: 'Git & GitHub İş Akışları',
        date: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
        time: '2 saat',
        hours: 2,
        description: 'Branch yönetimi, PR açma, merge çakışmalarını çözme ve tagleme pratikleri.',
        link: 'https://git-scm.com/doc',
        status: 'Tamamlandı',
        createdAt: new Date().toISOString()
      },
      {
        id: `sample-3`,
        weekNumber: 2,
        title: 'TypeScript Temelleri & Tip Güvenliği',
        date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
        time: '3.5 saat',
        hours: 3.5,
        description: 'Interfaces, type aliases, union types ve generic tipler üzerine egzersizler.',
        link: 'https://www.typescriptlang.org/docs',
        status: 'Tamamlandı',
        createdAt: new Date().toISOString()
      },
      {
        id: `sample-4`,
        weekNumber: 3,
        title: 'React Bileşen Mimarisi & Hooks',
        date: new Date().toISOString().slice(0, 10),
        time: '2.5 saat',
        hours: 2.5,
        description: 'useState, useEffect, useMemo, custom hooks ve context API mimarisi.',
        link: 'https://react.dev',
        status: 'Devam ediyor',
        createdAt: new Date().toISOString()
      }
    ];

    setTasks(sampleTasks);
    setWeeks(prev =>
      prev.map(w => {
        if (w.weekNumber === 1) return { ...w, title: 'JavaScript & Versiyon Kontrol', goal: 'Modern JS temelleri ve profesyonel Git iş akışları.' };
        if (w.weekNumber === 2) return { ...w, title: 'TypeScript & Tip Güvenliği', goal: 'TypeScript ile tip güvenli kod geliştirme alışkanlığı.' };
        if (w.weekNumber === 3) return { ...w, title: 'React Mimarisi & State Yönetimi', goal: 'React 19 bileşen hiyerarşisi ve modern hooklar.' };
        return w;
      })
    );
    showToast('Örnek Veriler Yüklendi', 'Örnek çalışma ve haftalar eklendi.', 'success');
  };

  // Computed statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Tamamlandı').length;
  const inProgressTasks = tasks.filter(t => t.status === 'Devam ediyor').length;
  const pendingTasks = tasks.filter(t => t.status === 'Bekliyor').length;
  const totalHours = Number(tasks.reduce((sum, t) => sum + (t.hours || 0), 0).toFixed(1));

  // Completed weeks count (weeks with at least one task where all tasks are completed)
  const completedWeeksCount = useMemo(() => {
    let count = 0;
    for (let w = 1; w <= 30; w++) {
      const wTasks = tasks.filter(t => t.weekNumber === w);
      if (wTasks.length > 0 && wTasks.every(t => t.status === 'Tamamlandı')) {
        count++;
      }
    }
    return count;
  }, [tasks]);

  // Overall percentage: composite of completed tasks and weeks
  const overallPercentage = useMemo(() => {
    if (totalTasks === 0) return 0;
    // Task-based progress percentage
    const taskPercent = (completedTasks / totalTasks) * 100;
    // Week progress factor (out of 30)
    const weekPercent = (completedWeeksCount / 30) * 100;
    // Balanced weighted score
    const weighted = Math.round(taskPercent * 0.7 + weekPercent * 0.3);
    return Math.min(100, Math.max(0, weighted));
  }, [completedTasks, totalTasks, completedWeeksCount]);

  // Current active week: the earliest week that is currently in progress, or week 1
  const activeWeekNumber = useMemo(() => {
    for (let w = 1; w <= 30; w++) {
      const status = getWeekStatus(w);
      if (status === 'Devam ediyor' || status === 'Bekliyor') {
        return w;
      }
    }
    return 1;
  }, [tasks]);

  // Streak calculations
  const { currentStreak, longestStreak, activeDaysCount } = useMemo(() => {
    const studyDates = Array.from(new Set(tasks.map(t => t.date).filter(Boolean))).sort();
    if (studyDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0 };
    }

    const dateSet = new Set(studyDates);
    const activeDaysCount = dateSet.size;

    // Calculate longest streak
    let longest = 1;
    let tempStreak = 1;
    const sortedDays = studyDates.map(d => new Date(d).getTime());

    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i] - sortedDays[i - 1]) / 86400000;
      if (Math.round(diff) === 1) {
        tempStreak++;
        if (tempStreak > longest) longest = tempStreak;
      } else if (Math.round(diff) > 1) {
        tempStreak = 1;
      }
    }

    // Calculate current streak
    let current = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let checkDate = dateSet.has(todayStr) ? today : (dateSet.has(yesterdayStr) ? yesterday : null);

    if (checkDate) {
      current = 1;
      const cursor = new Date(checkDate);
      while (true) {
        cursor.setDate(cursor.getDate() - 1);
        const curStr = cursor.toISOString().slice(0, 10);
        if (dateSet.has(curStr)) {
          current++;
        } else {
          break;
        }
      }
    }

    return {
      currentStreak: current,
      longestStreak: Math.max(longest, current),
      activeDaysCount
    };
  }, [tasks]);

  return (
    <TrackerContext.Provider
      value={{
        tasks,
        weeks,
        profile,
        activeTab,
        setActiveTab,
        selectedWeek,
        setSelectedWeek,
        theme,
        toggleTheme,
        toasts,
        showToast,
        dismissToast,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        updateWeek,
        getWeekTasks,
        getWeekStatus,
        getWeekHours,
        updateProfile,
        addTechnology,
        removeTechnology,
        exportData,
        exportToCsv,
        importData,
        resetToDefaults,
        loadSampleData,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        totalHours,
        overallPercentage,
        completedWeeksCount,
        activeWeekNumber,
        currentStreak,
        longestStreak,
        activeDaysCount
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
