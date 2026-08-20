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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1226]">          <img src="https://img.uefa.com/imgml/uefacom/elements/logos/ma/KOS.svg" alt="FFK" className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 z-10 opacity-90" />
          <div className="relative w-16 h-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full bg-white"
                style={{
                  width: '11px',
                  height: '11px',
                  marginTop: '-5.5px',
                  marginLeft: '-5.5px',
                  transform: `rotate(${i * 45}deg) translate(26px)`,
                  animation: 'dotFade 1s linear infinite',
                  animationDelay: `${i * 0.125}s`,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes dotFade {
              0% { opacity: 1; }
              100% { opacity: 0.15; }
            }
          `}</style>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#1E6FF2]/15" />
          <div className="absolute inset-0 rounded-full border-4 border-[#1E6FF2] border-t-transparent animate-spin" />
        </div>
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


