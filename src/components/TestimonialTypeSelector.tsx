
import React from 'react';
import { Button } from '@/components/ui/button';
import { Linkedin, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TestimonialType = 'written' | 'linkedin';

interface TestimonialTypeSelectorProps {
  onSelect: (type: TestimonialType) => void;
  className?: string;
}

export const TestimonialTypeSelector: React.FC<TestimonialTypeSelectorProps> = ({
  onSelect,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      <Button 
        onClick={() => onSelect('written')}
        variant="outline" 
        className="h-auto flex flex-col items-center justify-center gap-3 p-6 text-center hover:bg-background/80 hover:border-primary"
      >
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-semibold">Write a Testimonial</h3>
        </div>
      </Button>
      
      <Button 
        onClick={() => onSelect('linkedin')}
        variant="outline" 
        className="h-auto flex flex-col items-center justify-center gap-3 p-6 text-center hover:bg-background/80 hover:border-primary"
      >
        <Linkedin className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-semibold">Upload LinkedIn Screenshot</h3>
        </div>
      </Button>
    </div>
  );
};
