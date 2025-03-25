
import React from 'react';
import { AddTestimonialButton } from '@/components/AddTestimonialButton';

interface HeroSectionProps {
  onOpenModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="mb-12 sm:mb-16 text-center">
      <div className="animate-slide-down">
        <div className="mb-2">
          <span className="chip">Wall of Gratitude</span>
        </div>
        <h1 className="section-title mb-4 text-[#333333] text-3xl sm:text-4xl md:text-5xl">
          Our Success Stories
        </h1>
        <p className="section-subtitle mx-auto mb-6 sm:mb-8 text-base sm:text-xl">
          Discover how Adtechademy has transformed careers and opened new opportunities
          for our graduates in the ad tech industry.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AddTestimonialButton 
            onClick={onOpenModal} 
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
};
