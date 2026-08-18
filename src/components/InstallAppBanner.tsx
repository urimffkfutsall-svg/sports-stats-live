import { useState, useEffect } from 'react';

function InstallAppBanner() {
  var deferredPrompt = null;
  var mounted = true;
  var _s = useState(false);
  var showInstall = _s[0];
  var setShowInstall = _s[1];
  var _d = useState(false);
  var dismissed = _d[0];
  var setDismissed = _d[1];

  useEffect(function() {
    function handler(e) {
      e.preventDefault();
      deferredPrompt = e;
      if (mounted) setShowInstall(true);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return function() {
      mounted = false;
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function() {
        deferredPrompt = null;
        setShowInstall(false);
      });
    }
  }

  if (dismissed) return null;

  var bannerStyle = { background: 'linear-gradient(135deg, #2a499a 0%, #1E6FF2 100%)' };

  return (
    <div className="mx-4 my-4 rounded-xl overflow-hidden" style={bannerStyle}>
      <div className="p-4 flex items-center gap-4">
        <img src="/ffk-logo-192.png" alt="FFK" className="w-14 h-14 rounded-xl shadow-lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm">Vendos Aplikacionin</h3>
          <p className="text-blue-200 text-xs mt-0.5">Shto FFK Futsal ne telefonin tuaj</p>
        </div>
        <button onClick={function() { setDismissed(true); }} className="text-blue-300 hover:text-white text-xl leading-none p-1">x</button>
      </div>

      {showInstall ? (
        <div className="px-4 pb-4">
          <button onClick={handleInstall} className="w-full py-2.5 bg-white text-blue-900 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors">
            Instalo Tani
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white text-xs font-semibold mb-2">Si ta instalosh:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <p className="text-blue-100 text-xs"><strong>Android (Chrome):</strong> Kliko menyne (3 pika lart djathtas) dhe zgjidh "Add to Home screen"</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <p className="text-blue-100 text-xs"><strong>iPhone (Safari):</strong> Kliko butonin Share (katrori me shigjet lart) dhe zgjidh "Add to Home Screen"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstallAppBanner;
