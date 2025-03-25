import React from 'react';
import { TestimonialCard } from './testimonial-card/TestimonialCard';
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
      
      // For written testimonials, alternate short and long content for better layout
      if (a.type === 'written' && b.type === 'written') {
        const aLength = a.text?.length || 0;
        const bLength = b.text?.length || 0;
        
        // Distribute testimonials by size for better visual balance
        if (aLength > 200 && bLength < 100) return -1; 
        if (aLength < 100 && bLength > 200) return 1;
        
        return bLength - aLength;
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
          className="testimonial-item stagger-item animate-float"
          style={{ 
            animationDelay: `${index * 0.1}s, ${1 + (index % 5) * 0.2}s`
          }}
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
