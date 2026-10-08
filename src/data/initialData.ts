import { StudyTask, WeekMeta, UserProfile } from '../types/tracker';

// 38 haftalık başlangıç listesi (Hafta adları varsayılan olarak sadece kaçıncı haftaysa o yazar, sadece admin ad koyabilir)
export const INITIAL_WEEKS: WeekMeta[] = Array.from({ length: 38 }, (_, i) => {
  const weekNum = i + 1;
  let driveLink: string | undefined = undefined;

  // 1. ve 2. Hafta için Google Drive, 3. Hafta için Vercel oyun/proje bağlantısı
  if (weekNum === 1) {
    driveLink = 'https://drive.google.com/drive/folders/1WddXWYzBecZYU-YTn1toEKjxvcbhP-0E?usp=sharing';
  } else if (weekNum === 2) {
    driveLink = 'https://drive.google.com/drive/folders/17U0tZzu9BdqJHaWGGqXnLqSavuEQabeI?usp=sharing';
  } else if (weekNum === 3) {
    driveLink = 'https://nurullahoyunlarr.vercel.app/';
  }

  return {
    weekNumber: weekNum,
    title: `${weekNum}. Hafta`,
    goal: '',
    keyTopics: [],
    driveLink
  };
});

// Başlangıç çalışma ve materyal kayıtları
export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-week1-google-drive-materials',
    weekNumber: 1,
    title: '1. Hafta Çalışma Dosyaları ve Dökümanları (Google Drive)',
    date: new Date().toISOString().slice(0, 10),
    time: 'Materyal & Kaynak',
    hours: 4.0,
    description: '1. haftaya ait paylaşılan tüm ders notları, çalışma dökümanları ve kaynak dosyaları Google Drive klasöründe yer almaktadır.\nBağlantıya tıklayarak klasör içerisindeki materyallere doğrudan erişebilirsiniz.',
    link: 'https://drive.google.com/drive/folders/1WddXWYzBecZYU-YTn1toEKjxvcbhP-0E?usp=sharing',
    status: 'Devam ediyor',
    category: 'Ders',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-week2-google-drive-materials',
    weekNumber: 2,
    title: '2. Hafta Çalışma Dosyaları ve Dökümanları (Google Drive)',
    date: new Date().toISOString().slice(0, 10),
    time: 'Materyal & Kaynak',
    hours: 4.0,
    description: '2. haftaya ait paylaşılan tüm ders notları, çalışma dökümanları ve kaynak dosyaları Google Drive klasöründe yer almaktadır.\nBağlantıya tıklayarak klasör içerisindeki materyallere doğrudan erişebilirsiniz.',
    link: 'https://drive.google.com/drive/folders/17U0tZzu9BdqJHaWGGqXnLqSavuEQabeI?usp=sharing',
    status: 'Devam ediyor',
    category: 'Ders',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-week3-nurullahoyunlar-project',
    weekNumber: 3,
    title: '3. Hafta Oyun Projeleri ve Canlı Web Uygulaması',
    date: new Date().toISOString().slice(0, 10),
    time: 'Canlı Proje & Oyun',
    hours: 4.0,
    description: '3. haftaya ait geliştirilen web tabanlı oyun projeleri ve canlı yayınlanan Vercel uygulaması.\nBağlantıya tıklayarak projeyi doğrudan görüntüleyebilir ve oyunları deneyimleyebilirsiniz.',
    link: 'https://nurullahoyunlarr.vercel.app/',
    status: 'Devam ediyor',
    category: 'Proje',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Nurullah',
  role: 'Yazılım Geliştirici & Öğrenci',
  bio: '38 haftalık kişisel eğitim ve çalışma sürecimi adım adım takip ediyor ve kendi programıma göre çalışmalarımı kaydediyorum.',
  avatarUrl: '/src/assets/images/profile_avatar_1790237089060.jpg',
  targetGoal: '38 haftalık süreci eksiksiz ve disiplinli şekilde tamamlayarak hedeflerime ulaşmak.',
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
