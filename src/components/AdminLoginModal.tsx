import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, X, ShieldAlert } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminModalOpen, closeAdminLogin, adminPromptReason, loginAdmin } = useTracker();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Reset and focus when modal opens
  useEffect(() => {
    if (isAdminModalOpen) {
      setPassword('');
      setError(null);
      setShowPassword(false);
    }
  }, [isAdminModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAdminModalOpen) {
        closeAdminLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminModalOpen, closeAdminLogin]);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = password.trim();
    if (!trimmed) {
      setError('Lütfen yönetici şifresini giriniz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(trimmed, rememberMe);
      setIsLoading(false);
      if (!success) {
        setError('Hatalı şifre! Yönetici şifrenizi kontrol edip tekrar deneyiniz.');
        setPassword('');
      }
    }, 200);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAdminLogin();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={closeAdminLogin}
          className="absolute right-4 top-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          title="Kapat (Ziyaretçi modunda kal)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 pb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-inner">
            <Lock className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Yönetici Yetkilendirmesi</span>
            </div>
            <h2 id="admin-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Admin Girişi
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              {adminPromptReason || 'Yeni çalışma eklemek, haftalık hedefleri güncellemek ve sitede değişiklik yapmak için yönetici şifrenizi giriniz.'}
            </p>
          </div>
        </div>

        {/* Public Visitor Notice */}
        <div className="mb-4 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Ziyaretçiler tüm çalışmaları, haftalık konuları ve analizleri serbestçe görüntüleyebilir; ancak düzenleme ve ekleme yapabilmek yalnızca yönetici yetkisi ile mümkündür.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              Yönetici Şifresi
            </label>

            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                autoComplete="current-password"
                placeholder="Yönetici şifrenizi girin..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full pl-3.5 pr-11 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none transition-all ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 focus:ring-2 focus:ring-stone-400/20'
                }`}
              />

              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1 rounded-md transition-colors"
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-1.5 pt-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 dark:border-stone-700 text-stone-900 focus:ring-stone-400 dark:bg-stone-950"
              />
              <span>Bu cihazda oturumu açık tut</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={closeAdminLogin}
              className="w-full sm:w-auto flex-1 order-2 sm:order-1 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              Vazgeç (Ziyaretçi Modu)
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex-1 order-1 sm:order-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 active:scale-[0.99] transition-all disabled:opacity-50 shadow-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Giriş Yap</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
