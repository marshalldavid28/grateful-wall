
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TestimonialType } from './TestimonialTypeSelector';
import { TestimonialSelectionStep } from './upload-modal/TestimonialSelectionStep';
import { TestimonialForm } from './upload-modal/TestimonialForm';
import { useTestimonialForm } from '@/hooks/useTestimonialForm';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  onSubmit: (data: {
    name: string;
    text: string;
    company?: string;
    role?: string;
    image?: File;
    type: TestimonialType;
    linkedinUrl?: string;
  }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const form = useTestimonialForm();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.testimonialType) return;
    
    onSubmit({
      name: form.name,
      text: form.testimonialType === 'linkedin' ? 'LinkedIn Testimonial' : form.text,
      company: form.company,
      role: form.role,
      image: form.image || undefined,
      type: form.testimonialType,
      linkedinUrl: form.testimonialType === 'linkedin' ? form.linkedinUrl : undefined
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {form.step === 'select' ? (
          <TestimonialSelectionStep onSelect={form.handleTypeSelect} />
        ) : (
          <TestimonialForm
            testimonialType={form.testimonialType!}
            onBack={form.handleBackToSelect}
            onCancel={handleClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            formState={{
              name: form.name,
              text: form.text,
              company: form.company,
              role: form.role,
              linkedinUrl: form.linkedinUrl,
              preview: form.preview
            }}
            formActions={{
              setName: form.setName,
              setText: form.setText,
              setCompany: form.setCompany,
              setRole: form.setRole,
              setLinkedinUrl: form.setLinkedinUrl,
              handleImageChange: form.handleImageChange,
              resetImage: form.resetImage
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
