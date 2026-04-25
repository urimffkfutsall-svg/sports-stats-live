import React from 'react';
import { useData } from '@/context/DataContext';
import TeamMarquee from './TeamMarquee';

const Footer: React.FC = () => {
  const { settings } = useData();

  return (
    <>
    <TeamMarquee />
    <footer className="bg-[#2a499a] border-t-[3px] border-[#d0a650] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Logo */}
          {settings.logo && <img src={settings.logo} alt="FFK" className="h-16 w-auto" />}
          <div>
            <h3 className="font-black text-lg">Federata e Futbollit e Kosoves - Futsall</h3>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Kontakti</p>
            {settings.contact && (
              <a href={"tel:" + settings.contact.replace(/[^0-9+]/g, '')} className="text-white/50 text-sm font-medium hover:text-white transition-colors">
                {settings.contact}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/40 text-xs">
          &copy; {new Date().getFullYear()} Federata e Futbollit e Kosoves - Futsall. Te gjitha te drejtat e rezervuara.
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
