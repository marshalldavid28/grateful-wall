
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TestimonialTypeSelector, TestimonialType } from '../TestimonialTypeSelector';

interface TestimonialSelectionStepProps {
  onSelect: (type: TestimonialType) => void;
}

export const TestimonialSelectionStep: React.FC<TestimonialSelectionStepProps> = ({ onSelect }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-display">Share Your Experience</DialogTitle>
        <DialogDescription>
          Choose how you'd like to share your experience with Adtechademy
        </DialogDescription>
      </DialogHeader>

      <TestimonialTypeSelector onSelect={onSelect} className="my-6" />
    </>
  );
};
