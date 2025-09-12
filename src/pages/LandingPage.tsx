import React from 'react';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { AIVetSection } from '../components/AIVetSection';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { RoadmapSection } from '../components/RoadmapSection';
import { CTASection } from '../components/CTASection';

export const LandingPage: React.FC = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <AIVetSection />
      <FeaturedProducts />
      <RoadmapSection />
      <CTASection />
    </div>
  );
};