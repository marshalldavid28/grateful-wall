
import React from 'react';
import { TestimonialWall } from '@/components/TestimonialWall';
import { Testimonial } from '@/utils/testimonials';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ 
  testimonials,
  isLoading
}) => {
  return (
    <section className="animate-fade-in">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : testimonials.length > 0 ? (
        <TestimonialWall 
          testimonials={testimonials}
          isAdmin={false}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials yet. Be the first to share your experience!</p>
        </div>
      )}
    </section>
  );
};
