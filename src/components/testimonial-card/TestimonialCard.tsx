
import React, { useState, useEffect } from 'react';
import { type Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';
import { LinkedinTestimonialContent } from './LinkedinTestimonialContent';
import { WrittenTestimonialContent } from './WrittenTestimonialContent';
import { TestimonialFooter } from './TestimonialFooter';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  isDeleting?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  className,
  onDelete,
  isAdmin = false,
  isDeleting = false
}) => {
  const { id } = testimonial;
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    e.preventDefault();  // Add prevent default to ensure no form submissions
    
    console.log('Delete button clicked for testimonial:', id, testimonial.name);
    
    if (confirmDelete) {
      console.log('Confirmed delete for testimonial ID:', id);
      if (onDelete) {
        console.log('Calling onDelete with ID:', id);
        onDelete(id);
      }
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      console.log('Delete confirmation requested for:', id);
      
      // Auto-reset confirm state after 3 seconds
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
  };

  // Reset confirm state when clicking outside
  useEffect(() => {
    const resetConfirm = () => setConfirmDelete(false);
    if (confirmDelete) {
      document.addEventListener('click', resetConfirm, { once: true });
      return () => document.removeEventListener('click', resetConfirm);
    }
  }, [confirmDelete]);

  return (
    <div className={cn(
      "testimonial-card",
      className
    )}>
      <div className="flex flex-col h-full">
        {testimonial.type === 'linkedin' ? (
          <LinkedinTestimonialContent 
            headline={testimonial.headline}
            imageUrl={testimonial.imageUrl}
            linkedinUrl={testimonial.linkedinUrl}
          />
        ) : (
          <WrittenTestimonialContent text={testimonial.text} />
        )}
      </div>
      
      <TestimonialFooter 
        name={testimonial.name}
        avatarUrl={testimonial.avatarUrl}
        role={testimonial.role}
        company={testimonial.company}
        tags={testimonial.tags}
        isAdmin={isAdmin}
        isDeleting={isDeleting}
        confirmDelete={confirmDelete}
        onDeleteClick={handleDeleteClick}
      />
    </div>
  );
};
