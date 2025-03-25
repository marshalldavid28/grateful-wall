
import React from 'react';
import { type Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  className,
  onDelete,
  isAdmin = false
}) => {
  const { id, name, avatarUrl, text, company, role, tags } = testimonial;

  return (
    <div className={cn("testimonial-card flex flex-col h-full", className)}>      
      <div className="mb-4 text-primary">
        <Quote size={24} />
      </div>
      
      <p className="text-foreground/80 mb-6 flex-grow">{text}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          {avatarUrl ? (
            <div className="flex-shrink-0 mr-4">
              <img 
                src={avatarUrl} 
                alt={name} 
                className="h-12 w-12 rounded-full object-cover border border-muted"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 mr-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-foreground">{name}</h4>
            {(role || company) && (
              <p className="text-sm text-muted-foreground">
                {role}{role && company && ' at '}{company}
              </p>
            )}
            {tags && tags.length > 0 && (
              <p className="text-xs text-primary mt-1">
                {tags.join(', ')}
              </p>
            )}
          </div>
        </div>

        {isAdmin && onDelete && (
          <button 
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700 transition-colors p-2"
            aria-label="Delete testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
