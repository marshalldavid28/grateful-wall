
import React from 'react';
import { type Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';
import { LinkedinTestimonialContent } from './testimonial/LinkedinTestimonialContent';
import { WrittenTestimonialContent } from './testimonial/WrittenTestimonialContent';
import { UserInfo } from './testimonial/UserInfo';
import { DeleteButton } from './testimonial/DeleteButton';

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
  const { 
    id, 
    name, 
    avatarUrl, 
    text, 
    company, 
    role, 
    tags, 
    type, 
    imageUrl, 
    linkedinUrl 
  } = testimonial;
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className={cn("testimonial-card", className)}>
      <div className="flex flex-col h-full">
        {type === 'linkedin' ? (
          <LinkedinTestimonialContent
            linkedinUrl={linkedinUrl}
            imageUrl={imageUrl}
            name={name}
          />
        ) : (
          <WrittenTestimonialContent text={text} />
        )}
      </div>
      
      <div className="mt-auto pt-4 flex flex-wrap items-center justify-between">
        <UserInfo
          name={name}
          avatarUrl={avatarUrl}
          role={role}
          company={company}
          tags={tags}
        />

        {isAdmin && onDelete && (
          <DeleteButton
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};
