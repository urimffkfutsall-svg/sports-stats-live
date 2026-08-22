import React, { useEffect, useState } from 'react';
import { X, Share, PlusSquare, MoreVertical } from 'lucide-react';

const DISMISS_KEY = 'ffk_install_prompt_dismissed';

function isMobileDevice(): boolean {
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod/i.test(ua);
}

function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  return /iPhone|iPad|iPod/i.test(ua);
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

const InstallPrompt: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed === '1') return;
    } catch {}

    if (isInStandaloneMode()) return;
    if (!isMobileDevice()) return;

    setPlatform(isIOS() ? 'ios' : 'android');
    setVisible(true);

    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setVisible(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted' || outcome === 'dismissed') {
        dismiss();
      }
      setDeferredPrompt(null);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] bg-[#0f1830] text-white px-4 py-3 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex-shrink-0 mt-0.5 bg-white p-1 flex items-center justify-center"><img src="/ffk-logo-192.png" alt="FFK" className="w-full h-full object-contain" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Instalo FFK Futsall ne telefon</p>
          {platform === 'ios' ? (
            <p className="text-xs text-gray-300 mt-1 leading-relaxed flex items-center gap-1 flex-wrap">
              Kliko <Share size={13} className="inline mx-0.5" /> (Share) ne Safari, pastaj
              <PlusSquare size={13} className="inline mx-0.5" /> "Add to Home Screen"
            </p>
          ) : deferredPrompt ? (
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Kliko butonin per ta shtuar ne ekranin kryesor
            </p>
          ) : (
            <p className="text-xs text-gray-300 mt-1 leading-relaxed flex items-center gap-1 flex-wrap">
              Kliko <MoreVertical size={13} className="inline mx-0.5" /> ne shfletues, pastaj "Add to Home screen" / "Install app"
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {deferredPrompt && platform === 'android' && (
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-[#d0a650] text-[#0f1830] text-xs font-bold rounded-lg hover:bg-[#e0b660] transition-colors"
              >
                Instalo Tani
              </button>
            )}
            <button
              onClick={dismiss}
              className="text-xs text-gray-400 hover:text-white font-medium underline underline-offset-2"
            >
              Mos e shfaq me
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="text-gray-400 hover:text-white flex-shrink-0" aria-label="Mbyll">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;

