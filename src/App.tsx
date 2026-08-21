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

const GoldRingSpinner: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div
    className="rounded-full animate-spin"
    style={{
      width: size,
      height: size,
      borderWidth: Math.max(3, size * 0.09),
      borderStyle: 'solid',
      borderColor: 'rgba(208,166,80,0.2)',
      borderTopColor: '#d0a650',
    }}
  />
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
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 bg-[#0B1226]">
          <GoldRingSpinner size={64} />
          <img src="https://img.uefa.com/imgml/uefacom/elements/logos/ma/KOS.svg" alt="FFK" className="w-32 h-32 opacity-90 mt-4" />
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 bg-[#0B1226]">
        <GoldRingSpinner size={56} />
        <img src="https://img.uefa.com/imgml/uefacom/elements/logos/ma/KOS.svg" alt="FFK" className="w-28 h-28 opacity-90 mt-4" />
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







