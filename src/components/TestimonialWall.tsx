
import React, { useEffect, useRef } from 'react';
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
  // Function to arrange testimonials for a better visual layout
  const arrangeTestimonials = (testimonials: Testimonial[]) => {
    return [...testimonials].sort((a, b) => {
      // First, sort by type to distribute different types of testimonials
      if (a.type === 'linkedin' && b.type !== 'linkedin') return -1;
      if (a.type !== 'linkedin' && b.type === 'linkedin') return 1;
      
      // For LinkedIn testimonials, prioritize ones with images
      if (a.type === 'linkedin' && b.type === 'linkedin') {
        if (a.imageUrl && !b.imageUrl) return -1;
        if (!a.imageUrl && b.imageUrl) return 1;
      }
      
      // For written testimonials, sort by text length to balance visual layout
      if (a.type === 'written' && b.type === 'written') {
        return (b.text?.length || 0) - (a.text?.length || 0);
      }
      
      return 0;
    });
  };

  const arrangedTestimonials = arrangeTestimonials(testimonials);

  return (
    <div className={cn(
      "testimonial-grid",
      className
    )}>
      {arrangedTestimonials.map((testimonial, index) => (
        <div 
          key={testimonial.id} 
          className="testimonial-item stagger-item"
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
