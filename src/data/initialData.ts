import { StudyTask, WeekMeta, UserProfile } from '../types/tracker';

// 30 haftalık temiz ve boş başlangıç listesi (Kullanıcı kendi konularını ve hedeflerini ekler)
export const INITIAL_WEEKS: WeekMeta[] = Array.from({ length: 30 }, (_, i) => {
  const weekNum = i + 1;
  return {
    weekNumber: weekNum,
    title: `${weekNum}. Hafta`,
    goal: `${weekNum}. hafta çalışma hedefinizi belirleyin ve çalışmalarınızı ekleyin.`,
    keyTopics: []
  };
});

// Haftalar tamamen boş, tüm çalışmaları kullanıcı kendisi ekler
export const INITIAL_TASKS: StudyTask[] = [];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Nurullah',
  role: 'Yazılım Geliştirici & Öğrenci',
  bio: '30 haftalık kişisel eğitim ve çalışma sürecimi adım adım takip ediyor ve kendi programıma göre çalışmalarımı kaydediyorum.',
  avatarUrl: '/src/assets/images/profile_avatar_1790237089060.jpg',
  targetGoal: '30 haftalık süreci eksiksiz ve disiplinli şekilde tamamlayarak hedeflerime ulaşmak.',
  startDate: new Date().toISOString().slice(0, 10),
  technologies: [
    { id: 't-1', name: 'JavaScript', level: 'Orta', category: 'Frontend' },
    { id: 't-2', name: 'TypeScript', level: 'Orta', category: 'Frontend' },
    { id: 't-3', name: 'React', level: 'Orta', category: 'Frontend' },
    { id: 't-4', name: 'Tailwind CSS', level: 'Orta', category: 'Stil' }
  ],
  socialLinks: {
    github: '',
    linkedin: '',
    website: '',
    email: ''
  }
};
