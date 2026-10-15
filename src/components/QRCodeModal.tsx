import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { X, Copy, Check, ExternalLink, Download, Smartphone, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  subtitle?: string;
  weekNumber?: number;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  title = 'ControlHub QR Kodu',
  subtitle = 'Telefonunuzun kamerasıyla taratarak web uygulamasına doğrudan erişebilirsiniz.',
  weekNumber = 4
}) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    try {
      const canvas = canvasRef.current?.querySelector('canvas');
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        downloadLink.download = `${cleanName || 'qr-code'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err) {
      console.error('QR indirme hatası:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="qr-modal-title" className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {title}
                </h3>
                {weekNumber && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 rounded-full border border-teal-200 dark:border-teal-800">
                    {weekNumber}. Hafta
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Canlı Proje &amp; Mobil QR Kod
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* QR Code Container (Crisp White Card for High Contrast) */}
          <div className="relative p-5 bg-white rounded-2xl border-2 border-stone-200/90 dark:border-stone-700 shadow-md group">
            {/* Hidden canvas for high-quality PNG download */}
            <div ref={canvasRef} className="hidden">
              <QRCodeCanvas
                value={url}
                size={512}
                level="H"
                marginSize={2}
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>

            {/* Crisp Vector SVG for Display */}
            <QRCodeSVG
              value={url}
              size={220}
              level="H"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />

            {/* Scan overlay icon on hover/focus */}
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] font-mono text-stone-600 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              <span>Kamera ile okutun</span>
            </div>
          </div>

          {/* Subtitle / Instructions */}
          <p className="mt-4 text-xs text-stone-600 dark:text-stone-400 max-w-xs leading-relaxed">
            {subtitle}
          </p>

          {/* URL Bar */}
          <div className="mt-4 w-full flex items-center gap-2 p-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 text-xs">
            <span className="flex-1 truncate font-mono text-stone-700 dark:text-stone-300 px-1 text-left select-all">
              {url}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-600 shadow-2xs'
              }`}
              title="Bağlantıyı kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 w-full grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span>QR İndir (.PNG)</span>
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Projeyi Aç</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
