import React from 'react';
import Header from '@/components/Header';
import LandingMatches from '@/components/LandingMatches';
import Footer from '@/components/Footer';

const LivePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Header />
      <LandingMatches initialTab="live" />
      <div className="mt-auto"><Footer /></div>
    </div>
  );
};

export default LivePage;


