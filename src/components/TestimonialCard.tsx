
import React from 'react';
import { type Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';
import { LinkedinTestimonialContent } from './testimonial/LinkedinTestimonialContent';
import { WrittenTestimonialContent } from './testimonial/WrittenTestimonialContent';
import { UserInfo } from './testimonial/UserInfo';
import { DeleteButton } from './testimonial/DeleteButton';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  onDelete?: (id: string) => void;
  onApprove?: (id: string, approve: boolean) => void;
  isAdmin?: boolean;
  isDeleting?: boolean;
  isApproving?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  className,
  onDelete,
  onApprove,
  isAdmin = false,
  isDeleting = false,
  isApproving = false
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
    linkedinUrl,
    approved
  } = testimonial;
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleApprove = (approve: boolean) => {
    if (onApprove) {
      onApprove(id, approve);
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

        {isAdmin && (
          <div className="flex items-center space-x-2">
            {onDelete && (
              <DeleteButton
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
            {onApprove && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(true)}
                  disabled={isApproving || approved}
                  className={cn(
                    "p-1.5 rounded-full transition-colors",
                    approved 
                      ? "text-green-600 bg-green-100 cursor-default" 
                      : "text-green-500 hover:bg-green-100 hover:text-green-600",
                    isApproving && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label="Approve testimonial"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
                {!approved && (
                  <button
                    onClick={() => handleApprove(false)}
                    disabled={isApproving}
                    className={cn(
                      "p-1.5 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600",
                      isApproving && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Reject testimonial"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
