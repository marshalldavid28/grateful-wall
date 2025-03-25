
import React from 'react';
import { TestimonialType } from '../TestimonialTypeSelector';
import { TestimonialFormHeader } from './TestimonialFormHeader';
import { WrittenTestimonialForm } from './WrittenTestimonialForm';
import { LinkedinTestimonialForm } from './LinkedinTestimonialForm';
import { TestimonialFormFooter } from './TestimonialFormFooter';

interface TestimonialFormProps {
  testimonialType: TestimonialType;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formState: {
    name: string;
    text: string;
    company: string;
    role: string;
    linkedinUrl: string;
    preview: string | null;
  };
  formActions: {
    setName: (value: string) => void;
    setText: (value: string) => void;
    setCompany: (value: string) => void;
    setRole: (value: string) => void;
    setLinkedinUrl: (value: string) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetImage: () => void;
  };
}

export const TestimonialForm: React.FC<TestimonialFormProps> = ({
  testimonialType,
  onBack,
  onCancel,
  onSubmit,
  isSubmitting,
  formState,
  formActions
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <TestimonialFormHeader 
        testimonialType={testimonialType} 
        onBack={onBack} 
      />

      {testimonialType === 'written' ? (
        <WrittenTestimonialForm
          name={formState.name}
          setName={formActions.setName}
          text={formState.text}
          setText={formActions.setText}
          company={formState.company}
          setCompany={formActions.setCompany}
          role={formState.role}
          setRole={formActions.setRole}
          preview={formState.preview}
          handleImageChange={formActions.handleImageChange}
          resetImage={formActions.resetImage}
        />
      ) : (
        <LinkedinTestimonialForm
          name={formState.name}
          setName={formActions.setName}
          linkedinUrl={formState.linkedinUrl}
          setLinkedinUrl={formActions.setLinkedinUrl}
          preview={formState.preview}
          handleImageChange={formActions.handleImageChange}
          resetImage={formActions.resetImage}
        />
      )}

      <TestimonialFormFooter 
        onCancel={onCancel} 
        isSubmitting={isSubmitting}
      />
    </form>
  );
};
