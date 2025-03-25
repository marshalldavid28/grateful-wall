
import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialWallProps {
  testimonials: Testimonial[];
  className?: string;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  deletingId?: string | null;
}

export const TestimonialWall: React.FC<TestimonialWallProps> = ({ 
  testimonials,
  className,
  onDelete,
  isAdmin = false,
  deletingId = null
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto", className)}>
      {testimonials.map((testimonial, index) => (
        <div 
          key={testimonial.id} 
          className="stagger-item"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TestimonialCard 
            testimonial={testimonial} 
            onDelete={onDelete}
            isAdmin={isAdmin}
            isDeleting={deletingId === testimonial.id}
          />
        </div>
      ))}
    </div>
  );
};
