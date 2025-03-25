
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
  // Function to arrange testimonials for a better visual layout
  const arrangeTestimonials = (testimonials: Testimonial[]) => {
    // Sort testimonials to alternate between text and image types
    // This helps create a more balanced visual layout
    return [...testimonials].sort((a, b) => {
      // Put LinkedIn testimonials with images more evenly distributed
      if (a.type === 'linkedin' && b.type !== 'linkedin') return 1;
      if (b.type === 'linkedin' && a.type !== 'linkedin') return -1;
      
      // If both are LinkedIn, prefer ones with images
      if (a.type === 'linkedin' && b.type === 'linkedin') {
        if (a.imageUrl && !b.imageUrl) return 1;
        if (!a.imageUrl && b.imageUrl) return -1;
      }
      
      return 0;
    });
  };

  const arrangedTestimonials = arrangeTestimonials(testimonials);

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto",
      "testimonial-masonry",
      className
    )}>
      {arrangedTestimonials.map((testimonial, index) => (
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
