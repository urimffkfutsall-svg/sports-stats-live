import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';

const WhatsAppButton: React.FC = () => {
  const { settings } = useData() as any;
  const WHATSAPP_NUMBER = ((settings as any).whatsappNumber || '38345278279').replace(/[^0-9]/g, '');
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (showPopup && countdown === 0) {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=Pershendetje!%20Doja%20te%20bisedoja%20me%20administratorin.', '_blank');
      setShowPopup(false);
      setCountdown(3);
    }
  }, [showPopup, countdown]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-6 right-6 z-[100] w-11 h-11 bg-white hover:bg-gray-50 rounded-full shadow-2xl shadow-gray-300/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-[#1E6FF2]/20"
        title="Na kontaktoni ne WhatsApp"
      >
        <svg className="w-4 h-4 text-[#1E6FF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => { setShowPopup(false); setCountdown(3); }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-500 text-sm mb-4">
              Ju do te ridirektoheni ne WhatsApp per te biseduar me administratorin
            </p>
            <div className="w-12 h-12 bg-[#1E6FF2]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-black text-[#1E6FF2]">{countdown}</span>
            </div>
            <p className="text-xs text-gray-400">Duke u ridirektuar...</p>
            <button
              onClick={() => { setShowPopup(false); setCountdown(3); }}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Anulo
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
