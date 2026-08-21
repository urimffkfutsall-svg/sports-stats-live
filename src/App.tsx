import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import LivePage from "./pages/LivePage";
import SuperligaPage from "./pages/SuperligaPage";
import LigaParePage from "./pages/LigaParePage";
import KupaPage from "./pages/KupaPage";
import PlayerOfWeekPage from "./pages/PlayerOfWeekPage";
import StatistikatPage from "./pages/StatistikatPage";
import TeamProfilePage from "./pages/TeamProfilePage";
import HeadToHeadPage from "./pages/HeadToHeadPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import SkuadratPage from "./pages/SkuadratPage";
import KombetarjaPage from "./pages/KombetarjaPage";
import PlayoffPage from "./pages/PlayoffPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import LiveMatchPage from "./pages/LiveMatchPage";
import LiveStreamsPage from "./pages/LiveStreamsPage";
import NotFound from "./pages/NotFound";
import KomisioniPage from "./pages/KomisioniPage";
import AktetNormativePage from "./pages/AktetNormativePage";
import WhatsAppButton from "./components/WhatsAppButton";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const FootballSpinner: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div className="flex flex-col items-center justify-center" style={{ width: size, height: size + 20 }}>
    <div
      className="rounded-full shadow-lg relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #ffffff 38%, #d0a650 39%, #d0a650 100%)',
        animation: 'ffkSpin 0.9s linear infinite',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <polygon points="50,14 66,25 61,43 39,43 34,25" fill="#2a499a" />
        <polygon points="50,57 66,68 61,86 39,86 34,68" fill="#2a499a" opacity="0.85" />
        <polygon points="18,44 34,42 39,58 27,69 13,60" fill="#2a499a" opacity="0.7" />
        <polygon points="82,44 66,42 61,58 73,69 87,60" fill="#2a499a" opacity="0.7" />
      </svg>
    </div>
    <div
      className="mt-2 rounded-full bg-[#0B1226]/25 blur-[2px]"
      style={{ width: size * 0.5, height: Math.max(4, size * 0.1), animation: 'ffkShadow 0.9s ease-in-out infinite' }}
    />
    <style>{`
      @keyframes ffkSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes ffkShadow { 0%, 100% { transform: scaleX(1); opacity: 0.5; } 50% { transform: scaleX(0.65); opacity: 0.25; } }
    `}</style>
  </div>
);
const AppLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useData();
  const [showContent, setShowContent] = useState(false);
  const [isPhoneOrTablet, setIsPhoneOrTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsPhoneOrTablet(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (isLoading) {
    if (isPhoneOrTablet) {
      return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1226]">
          <FootballSpinner size={72} />
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <FootballSpinner size={56} />
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-700 ease-out ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <AppLoader>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="pb-24 lg:pb-0">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/live" element={<LivePage />} />
                    <Route path="/superliga" element={<SuperligaPage />} />
                    <Route path="/liga-pare" element={<LigaParePage />} />
                    <Route path="/kupa" element={<KupaPage />} />
                    <Route path="/lojtari-javes" element={<PlayerOfWeekPage />} />
                    <Route path="/statistikat" element={<StatistikatPage />} />
                    <Route path="/skuadra/:id" element={<TeamProfilePage />} />
                    <Route path="/head-to-head" element={<HeadToHeadPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/skuadrat" element={<SkuadratPage />} />
                    <Route path="/kombetarja" element={<KombetarjaPage />} />
                    <Route path="/playoff" element={<PlayoffPage />} />
                    <Route path="/aktivitete/:id" element={<ActivityDetailPage />} />
                    <Route path="/lajme/:id" element={<NewsDetailPage />} />
                    <Route path="/live/:id" element={<LiveMatchPage />} />
                    <Route path="/live-streams" element={<LiveStreamsPage />} />
                    <Route path="/komisioni" element={<KomisioniPage />} />
                    <Route path="/aktet-normative" element={<AktetNormativePage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <WhatsAppButton />
                  <BottomNav />
                </div>
              </BrowserRouter>
            </AuthProvider>
          </AppLoader>
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;




