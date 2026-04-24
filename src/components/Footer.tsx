import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';

const Footer: React.FC = () => {
  const { settings } = useData();

  return (
    <footer className="bg-[#0A1E3C] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={settings.logo} alt="FFK" className="h-10 w-auto" />
              <span className="font-bold text-lg">FFK Futsall</span>
            </div>
            <p className="text-gray-400 text-sm">
              Platforma zyrtare e statistikave të futsallit në Kosovë.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Kompeticionet</h4>
            <ul className="space-y-2">
              <li><Link to="/superliga" className="text-gray-400 hover:text-white text-sm transition-colors">Superliga</Link></li>
              <li><Link to="/liga-pare" className="text-gray-400 hover:text-white text-sm transition-colors">Liga e Parë</Link></li>
              <li><Link to="/kupa" className="text-gray-400 hover:text-white text-sm transition-colors">Kupa e Kosovës</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Navigimi</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Ballina</Link></li>
              <li><Link to="/statistikat" className="text-gray-400 hover:text-white text-sm transition-colors">Statistikat</Link></li>
              <li><Link to="/lojtari-javes" className="text-gray-400 hover:text-white text-sm transition-colors">Lojtari i Javës</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Kontakti</h4>
            <p className="text-gray-400 text-sm">{settings.contact}</p>
            <p className="text-gray-400 text-sm mt-2">Federata e Futbollit e Kosovës</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} FFK Futsall. Të gjitha të drejtat e rezervuara.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
