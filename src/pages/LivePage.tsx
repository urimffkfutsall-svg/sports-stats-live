import React from 'react';
import Header from '@/components/Header';
import LandingMatches from '@/components/LandingMatches';
import Footer from '@/components/Footer';

const LivePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <LandingMatches initialTab="live" />
      <Footer />
    </div>
  );
};

export default LivePage;
