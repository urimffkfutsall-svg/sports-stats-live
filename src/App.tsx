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
import ActivityDetailPage from "./pages/ActivityDetailPage";
import NewsDetailPage from './pages/NewsDetailPage';
import LiveMatchPage from "./pages/LiveMatchPage";
import LiveStreamsPage from "./pages/LiveStreamsPage";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                <Route path="/skuadrat" element={<SkuadratPage />} />
                <Route path="/lajme/:id" element={<NewsDetailPage />} />
                <Route path="/kombetarja" element={<KombetarjaPage />} />
                <Route path="/aktivitet/:id" element={<ActivityDetailPage />} />
                <Route path="/kombetarja" element={<KombetarjaPage />} />
                <Route path="/live" element={<LiveMatchPage />} />
                <Route path="/live/streams" element={<LiveStreamsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <WhatsAppButton />
              </BrowserRouter>
          </AuthProvider>
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;


