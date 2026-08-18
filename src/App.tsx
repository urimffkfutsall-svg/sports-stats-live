import React from "react";
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
import WhatsAppButton from "./components/WhatsAppButton";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const AppLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useData();
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png"
          alt="FFK Futsall"
          className="w-20 h-20 object-contain mb-6 rounded-2xl shadow-lg"
        />
        <div className="w-12 h-12 rounded-full border-4 border-[#1E6FF2] border-t-transparent animate-spin mb-4" />
        <span className="text-sm text-gray-400 font-medium tracking-wide">Duke ngarkuar...</span>
      </div>
    );
  }
  return <>{children}</>;
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