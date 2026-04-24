import React from 'react';
import { useData } from '@/context/DataContext';

const HeroSection: React.FC = () => {
  const { settings } = useData();

  return (
    <section className="relative bg-[#0A1E3C] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E6FF2]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E6FF2]/3 rounded-full blur-3xl" style={Object.assign({}, { animation: 'pulse 4s ease-in-out infinite' })} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0066CC]/5 rounded-full blur-3xl" style={Object.assign({}, { animation: 'pulse 5s ease-in-out infinite' })} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] md:min-h-[350px] px-4">
        <div className="animate-[fadeInScale_1s_ease-out]">
          <img
            src={settings.logo}
            alt="FFK Futsall"
            className="w-52 h-52 md:w-72 md:h-72 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;