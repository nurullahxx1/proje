import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthGateProps {
  onAuthenticated: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setError('Lütfen erişim şifresini giriniz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (trimmedPassword === 'nurullah1') {
        if (rememberMe) {
          localStorage.setItem('nurullah1_authenticated', 'true');
        } else {
          sessionStorage.setItem('nurullah1_authenticated', 'true');
        }
        setIsLoading(false);
        onAuthenticated();
      } else {
        setIsLoading(false);
        setError('Hatalı şifre! Lütfen şifrenizi kontrol edip tekrar deneyin.');
        setPassword('');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Background ambient decoration */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-40 dark:opacity-20">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-stone-300 via-stone-200 to-transparent dark:from-stone-800 dark:via-stone-900 dark:to-transparent blur-3xl transform -translate-y-12" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800/90 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl p-7 sm:p-9 shadow-xl shadow-stone-200/50 dark:shadow-stone-950/70">
          {/* Header */}
          <div className="text-center space-y-3 pb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-inner">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Korumalı Çalışma Alanı</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 pt-1">
                nurullah1.1
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                Bu çalışma takip sistemine erişmek için lütfen şifrenizi giriniz.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Giriş Şifresi
              </label>

              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Şifrenizi yazın..."
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
            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 pt-1">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 active:scale-[0.99] transition-all disabled:opacity-50 shadow-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Discreet Footer Info */}
          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800/80 text-center">
            <p className="text-[11px] text-stone-400 dark:text-stone-500">
              30 Haftalık Kişisel Eğitim &amp; Çalışma Takipçisi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
