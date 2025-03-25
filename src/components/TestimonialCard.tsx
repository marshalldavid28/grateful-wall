
import React from 'react';
import { type Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';
import { Quote, Linkedin } from 'lucide-react';

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
  const { id, name, avatarUrl, text, company, role, tags, type, headline, imageUrl } = testimonial;
  
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  
  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete?.(id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };
  
  // Reset confirm state when clicking outside
  React.useEffect(() => {
    const resetConfirm = () => setConfirmDelete(false);
    if (confirmDelete) {
      document.addEventListener('click', resetConfirm, { once: true });
      return () => document.removeEventListener('click', resetConfirm);
    }
  }, [confirmDelete]);

  return (
    <div className={cn("testimonial-card flex flex-col h-full", className)}>
      {type === 'linkedin' ? (
        <>
          <div className="mb-3 flex items-center text-primary">
            <Linkedin size={20} className="mr-2" />
            <span className="text-sm font-medium">LinkedIn Testimonial</span>
          </div>
          
          {headline && (
            <p className="text-lg font-medium text-foreground mb-4">{headline}</p>
          )}
          
          {imageUrl && (
            <div className="mb-4 rounded-md overflow-hidden border border-border">
              <img 
                src={imageUrl} 
                alt="LinkedIn testimonial" 
                className="w-full object-contain"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-4 text-primary">
            <Quote size={24} />
          </div>
          
          <p className="text-foreground/80 mb-6 flex-grow line-clamp-6 sm:line-clamp-none">{text}</p>
        </>
      )}
      
      <div className="flex flex-wrap items-center justify-between mt-auto">
        <div className="flex items-center">
          {avatarUrl ? (
            <div className="flex-shrink-0 mr-3">
              <img 
                src={avatarUrl} 
                alt={name} 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-muted"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 mr-3 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          
          <div className="min-w-0 max-w-[70%]">
            <h4 className="font-medium text-foreground truncate">{name}</h4>
            {(role || company) && (
              <p className="text-sm text-muted-foreground truncate">
                {role}{role && company && ' at '}{company}
              </p>
            )}
            {tags && tags.length > 0 && (
              <p className="text-xs text-primary mt-1 truncate">
                {tags.join(', ')}
              </p>
            )}
          </div>
        </div>

        {isAdmin && onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            className={cn(
              "flex-shrink-0 transition-colors p-2 rounded-full",
              confirmDelete 
                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                : "text-red-500 hover:text-red-700"
            )}
            aria-label={confirmDelete ? "Confirm delete" : "Delete testimonial"}
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
