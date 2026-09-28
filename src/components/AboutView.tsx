import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { Technology } from '../types/tracker';
import { formatExternalUrl } from '../utils/helpers';
import { Edit3, Plus, Trash2, Github, Linkedin, Globe, Mail, Download, Upload, RotateCcw, Check, Sparkles, User, Code2, Database } from 'lucide-react';

export const AboutView: React.FC = () => {
  const {
    profile,
    updateProfile,
    addTechnology,
    removeTechnology,
    exportData,
    importData,
    resetToDefaults,
    loadSampleData,
    completedTasks,
    completedWeeksCount,
    totalHours,
    isAdmin,
    openAdminLogin
  } = useTracker();

  // Profile Edit modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [targetGoal, setTargetGoal] = useState(profile.targetGoal);
  const [github, setGithub] = useState(profile.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(profile.socialLinks?.linkedin || '');
  const [website, setWebsite] = useState(profile.socialLinks?.website || '');
  const [email, setEmail] = useState(profile.socialLinks?.email || '');

  // Add Tech form
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [newTechName, setNewTechName] = useState('');
  const [newTechLevel, setNewTechLevel] = useState<'Başlangıç' | 'Orta' | 'İleri'>('Orta');
  const [newTechCategory, setNewTechCategory] = useState('Frontend');

  // Import JSON feedback
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Close profile modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditingProfile) {
        setIsEditingProfile(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingProfile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Öğrenci',
      role: role.trim() || 'Geliştirici',
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      targetGoal: targetGoal.trim(),
      socialLinks: {
        github: github.trim(),
        linkedin: linkedin.trim(),
        website: website.trim(),
        email: email.trim()
      }
    });
    setIsEditingProfile(false);
  };

  const handleAddTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;
    addTechnology({
      name: newTechName.trim(),
      level: newTechLevel,
      category: newTechCategory.trim() || 'Genel'
    });
    setNewTechName('');
    setIsAddingTech(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          setImportStatus('Veriler başarıyla içe aktarıldı!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Hata: Dosya formatı geçerli bir JSON yedeği değil.');
          setTimeout(() => setImportStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Card */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shadow-xs flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Styled CSS fallback
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <User className="w-10 h-10 text-stone-400" />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {profile.name}
                </h1>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  {profile.role}
                </p>
              </div>

              <button
                onClick={() => {
                  if (!isAdmin) {
                    openAdminLogin('Profili düzenlemek için lütfen yönetici girişi yapınız.');
                    return;
                  }
                  setName(profile.name);
                  setRole(profile.role);
                  setBio(profile.bio);
                  setAvatarUrl(profile.avatarUrl);
                  setTargetGoal(profile.targetGoal);
                  setGithub(profile.socialLinks?.github || '');
                  setLinkedin(profile.socialLinks?.linkedin || '');
                  setWebsite(profile.socialLinks?.website || '');
                  setEmail(profile.socialLinks?.email || '');
                  setIsEditingProfile(true);
                }}
                title={isAdmin ? "Profili Düzenle" : "Profili düzenlemek için yönetici girişi gereklidir"}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Profili Düzenle</span>
              </button>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl whitespace-pre-line">
              {profile.bio}
            </p>

            {/* Target Goal Banner */}
            {profile.targetGoal && (
              <div className="pt-2">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">30 Haftalık Ana Hedef: </span>
                  {profile.targetGoal}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
              {profile.socialLinks?.github && (
                <a
                  href={formatExternalUrl(profile.socialLinks.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={formatExternalUrl(profile.socialLinks.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.socialLinks?.website && (
                <a
                  href={formatExternalUrl(profile.socialLinks.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Web Sitesi</span>
                </a>
              )}
              {profile.socialLinks?.email && (
                <a
                  href={`mailto:${profile.socialLinks.email}`}
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>{profile.socialLinks.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learned Technologies Section */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Öğrendiğim Teknolojiler &amp; Yetenekler
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              30 haftalık süreçte üzerinde çalıştığınız dilleri, kütüphaneleri ve araçları yönetin.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAdmin) {
                openAdminLogin('Teknoloji ve yetkinlik eklemek için lütfen yönetici girişi yapınız.');
                return;
              }
              setIsAddingTech(true);
            }}
            title={isAdmin ? "Yeni Teknoloji Ekle" : "Teknoloji eklemek için yönetici girişi yapınız"}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Teknoloji Ekle</span>
          </button>
        </div>

        {/* Add Tech Inline Modal/Form */}
        {isAddingTech && (
          <form onSubmit={handleAddTechSubmit} className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Yeni Teknoloji Ekle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Teknoloji / Araç Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Docker, Next.js, GraphQL"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Seviye
                </label>
                <select
                  value={newTechLevel}
                  onChange={(e) => setNewTechLevel(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                >
                  <option value="Başlangıç">Başlangıç</option>
                  <option value="Orta">Orta</option>
                  <option value="İleri">İleri</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Örn: Frontend, DevOps, DB"
                  value={newTechCategory}
                  onChange={(e) => setNewTechCategory(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingTech(false)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg"
              >
                Ekle
              </button>
            </div>
          </form>
        )}

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {profile.technologies.map((tech) => (
            <div
              key={tech.id}
              className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30 flex items-center justify-between group hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  {tech.name}
                </div>
                {/* Zero-pill metadata line */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                  <span>{tech.category || 'Teknoloji'}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      tech.level === 'İleri'
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : tech.level === 'Orta'
                        ? 'text-amber-600 dark:text-amber-400 font-medium'
                        : 'text-stone-500'
                    }
                  >
                    {tech.level}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAdmin) {
                    openAdminLogin('Yetkinlik silmek için lütfen yönetici girişi yapınız.');
                    return;
                  }
                  removeTechnology(tech.id);
                }}
                title={isAdmin ? "Kaldır" : "Silmek için yönetici girişi gereklidir"}
                className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-600 rounded-md transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Backup & Restore Section */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Veri Yönetimi &amp; Güvenli Yedekleme
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Tüm çalışmalarınız ve profiliniz tarayıcınızın yerel depolama alanında (localStorage) güvenle saklanır. İsterseniz tek tıkla JSON yedeğini indirebilir veya başka bir cihaza aktarabilirsiniz.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs text-stone-800 dark:text-stone-200">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={exportData}
            className="px-4 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Yedeği İndir (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => {
              if (!isAdmin) {
                openAdminLogin('Yedek yüklemek ve verileri değiştirmek için yönetici girişi yapınız.');
                return;
              }
              const input = document.getElementById('json-upload-input');
              input?.click();
            }}
            title={isAdmin ? "JSON Yedek Yükle" : "Yedek yüklemek için yönetici girişi yapınız"}
            className="px-4 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Yedek Yükle (JSON)</span>
            <input
              id="json-upload-input"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>

          {/* Load Sample Data */}
          <button
            onClick={() => {
              if (!isAdmin) {
                openAdminLogin('Örnek veri yüklemek için lütfen yönetici girişi yapınız.');
                return;
              }
              if (confirm('Örnek çalışmaları ve haftalık hedefleri yüklemek istiyor musunuz?')) {
                loadSampleData();
              }
            }}
            className="px-4 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Örnek çalışma kayıtları yükle"
          >
            <Database className="w-4 h-4" />
            <span>Örnek Verileri Yükle (Demo)</span>
          </button>

          {/* Reset to defaults */}
          <button
            onClick={() => {
              if (!isAdmin) {
                openAdminLogin('Verileri sıfırlamak için lütfen yönetici girişi yapınız.');
                return;
              }
              if (confirm('Tüm verileri başlangıç durumuna döndürmek istediğinizden emin misiniz?')) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Varsayılan Verilere Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditingProfile(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Profili Düzenle
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    İsim
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Ünvan / Rol
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Profil Fotoğrafı URL veya Dosya Yolu
                </label>
                <input
                  type="text"
                  placeholder="/src/assets/... veya resim URL'si"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Kısa Biyografi
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  30 Haftalık Ana Hedef
                </label>
                <textarea
                  rows={2}
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
