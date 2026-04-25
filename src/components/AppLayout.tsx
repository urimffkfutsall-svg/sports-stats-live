import React from 'react';
import Header from './Header';
import LandingMatches from './LandingMatches';
import LandingNews from './LandingNews';
import LandingVideos from './LandingVideos';
import LeagueTablesSection from './LeagueTablesSection';
import Footer from './Footer';
import NtActivitiesSection from './NtActivitiesSection';
import FfkMomentsSection from './FfkMomentsSection';
import DecisionsSection from './DecisionsSection';
import { useData } from '@/context/DataContext';

var AppLayout: React.FC = function() {
var _data = useData();
var isLoading = _data.isLoading;

if (isLoading) {
return (
<div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
<div className="relative">
<div className="w-14 h-14 rounded-full border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] animate-spin" />
</div>
</div>
);
}

return (
<div className="min-h-screen bg-[#F1F5F9]">
<Header />

<LandingNews />
      <LandingMatches />
<LeagueTablesSection />
<DecisionsSection />
      <NtActivitiesSection />
      <FfkMomentsSection />
      <LandingVideos />
      <Footer />
</div>
);
};

export default AppLayout;
