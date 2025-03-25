
import React from 'react';
import { cn } from '@/lib/utils';

interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onDelete,
  isDeleting = false 
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete();
  };

  return (
    <button 
      onClick={handleDeleteClick}
      className={cn(
        "flex-shrink-0 transition-colors p-2 rounded-full",
        isDeleting 
          ? "bg-red-100 text-red-600 hover:bg-red-200 opacity-50 cursor-not-allowed" 
          : "text-red-500 hover:text-red-700 hover:bg-red-100",
      )}
      aria-label="Delete testimonial"
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
  );
};
