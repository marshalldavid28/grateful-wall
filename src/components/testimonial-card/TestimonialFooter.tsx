
import React from 'react';
import { cn } from '@/lib/utils';

interface TestimonialFooterProps {
  name: string;
  avatarUrl?: string;
  role?: string;
  company?: string;
  tags?: string[];
  isAdmin?: boolean;
  isDeleting?: boolean;
  confirmDelete?: boolean;
  onDeleteClick?: (e: React.MouseEvent) => void;
}

export const TestimonialFooter: React.FC<TestimonialFooterProps> = ({
  name,
  avatarUrl,
  role,
  company,
  tags,
  isAdmin = false,
  isDeleting = false,
  confirmDelete = false,
  onDeleteClick
}) => {
  return (
    <div className="mt-auto pt-4 flex flex-wrap items-center justify-between">
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

      {isAdmin && onDeleteClick && (
        <button 
          onClick={onDeleteClick}
          className={cn(
            "flex-shrink-0 transition-colors p-2 rounded-full",
            confirmDelete 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "text-red-500 hover:text-red-700",
            isDeleting && "opacity-50 cursor-not-allowed"
          )}
          aria-label={confirmDelete ? "Confirm delete" : "Delete testimonial"}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="animate-spin h-4 w-4 border-t-2 border-red-500 rounded-full" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};
