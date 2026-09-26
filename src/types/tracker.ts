export type TaskStatus = 'Tamamlandı' | 'Devam ediyor' | 'Bekliyor';

export type TaskCategory = 'Ders' | 'Proje' | 'Pratik' | 'Okuma' | 'Genel';

export interface StudyTask {
  id: string;
  weekNumber: number; // 1 to 30
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "2.5 saat" or "14:00 - 16:30"
  hours: number; // numeric hours for calculation, e.g. 2.5
  description: string;
  link: string;
  status: TaskStatus;
  category?: TaskCategory;
  createdAt: string;
}

export interface WeekMeta {
  weekNumber: number;
  title: string;
  goal: string;
  keyTopics?: string[];
}

export interface Technology {
  id: string;
  name: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  category?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  targetGoal: string;
  startDate: string;
  technologies: Technology[];
  socialLinks: {
    github: string;
    linkedin: string;
    website: string;
    email: string;
  };
}

export type ActiveTab = 'overview' | 'all-tasks' | 'insights' | 'about';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}
