
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTestimonialButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddTestimonialButton: React.FC<AddTestimonialButtonProps> = ({ 
  onClick,
  className 
}) => {
  return (
    <Button 
      onClick={onClick}
      className={cn(
        "btn-primary flex items-center space-x-2 animate-float shadow-lg", 
        className
      )}
    >
      <PlusIcon size={16} />
      <span>Add Your Testimonial</span>
    </Button>
  );
};
