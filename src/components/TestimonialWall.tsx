
import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialWallProps {
  testimonials: Testimonial[];
  className?: string;
}

export const TestimonialWall: React.FC<TestimonialWallProps> = ({ 
  testimonials,
  className 
}) => {
  return (
    <div className={cn("testimonial-grid", className)}>
      {testimonials.map((testimonial, index) => (
        <div 
          key={testimonial.id} 
          className={cn("stagger-item", testimonial.featured ? "md:col-span-2 lg:col-span-1" : "")}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}
    </div>
  );
};
