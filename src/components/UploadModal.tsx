
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TestimonialType } from './TestimonialTypeSelector';
import { TestimonialSelectionStep } from './upload-modal/TestimonialSelectionStep';
import { TestimonialFormHeader } from './upload-modal/TestimonialFormHeader';
import { WrittenTestimonialForm } from './upload-modal/WrittenTestimonialForm';
import { LinkedinTestimonialForm } from './upload-modal/LinkedinTestimonialForm';
import { TestimonialFormFooter } from './upload-modal/TestimonialFormFooter';

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
    headline?: string;
    linkedinUrl?: string;
  }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [testimonialType, setTestimonialType] = useState<TestimonialType | null>(null);
  
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [headline, setHeadline] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialType) return;
    
    onSubmit({
      name,
      text,
      company,
      role,
      image: image || undefined,
      type: testimonialType,
      headline: testimonialType === 'linkedin' ? headline : undefined,
      linkedinUrl: testimonialType === 'linkedin' ? linkedinUrl : undefined
    });
  };

  const resetForm = () => {
    setStep('select');
    setTestimonialType(null);
    setName('');
    setText('');
    setCompany('');
    setRole('');
    setHeadline('');
    setLinkedinUrl('');
    setImage(null);
    setPreview(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleTypeSelect = (type: TestimonialType) => {
    setTestimonialType(type);
    setStep('form');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setTestimonialType(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 'select' ? (
          <TestimonialSelectionStep onSelect={handleTypeSelect} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <TestimonialFormHeader 
              testimonialType={testimonialType!} 
              onBack={handleBackToSelect} 
            />

            {testimonialType === 'written' ? (
              <WrittenTestimonialForm
                name={name}
                setName={setName}
                text={text}
                setText={setText}
                company={company}
                setCompany={setCompany}
                role={role}
                setRole={setRole}
                preview={preview}
                handleImageChange={handleImageChange}
                resetImage={resetImage}
              />
            ) : (
              <LinkedinTestimonialForm
                name={name}
                setName={setName}
                headline={headline}
                setHeadline={setHeadline}
                linkedinUrl={linkedinUrl}
                setLinkedinUrl={setLinkedinUrl}
                preview={preview}
                handleImageChange={handleImageChange}
                resetImage={resetImage}
              />
            )}

            <TestimonialFormFooter 
              onCancel={handleClose} 
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
