
import React from 'react';
import { Quote } from 'lucide-react';

interface WrittenTestimonialContentProps {
  text?: string;
}

export const WrittenTestimonialContent: React.FC<WrittenTestimonialContentProps> = ({
  text
}) => {
  return (
    <>
      <div className="mb-4 text-primary">
        <Quote size={24} />
      </div>
      
      <p className="text-foreground/80 mb-6">{text}</p>
    </>
  );
};
