
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TestimonialType } from '../TestimonialTypeSelector';

interface TestimonialFormHeaderProps {
  testimonialType: TestimonialType;
  onBack: () => void;
}

export const TestimonialFormHeader: React.FC<TestimonialFormHeaderProps> = ({
  testimonialType,
  onBack,
}) => {
  return (
    <DialogHeader>
      <div className="flex items-center">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <DialogTitle className="text-2xl font-display">
          {testimonialType === 'written' 
            ? 'Write Your Testimonial' 
            : 'Upload LinkedIn Screenshot'}
        </DialogTitle>
      </div>
      <DialogDescription>
        {testimonialType === 'written'
          ? "We'd love to hear about your journey with Adtechademy!"
          : "Share a screenshot of your LinkedIn recommendation for Adtechademy"}
      </DialogDescription>
    </DialogHeader>
  );
};
