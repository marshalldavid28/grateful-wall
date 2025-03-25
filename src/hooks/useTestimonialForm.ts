
import { useState } from 'react';
import { TestimonialType } from '@/components/TestimonialTypeSelector';

export function useTestimonialForm() {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [testimonialType, setTestimonialType] = useState<TestimonialType | null>(null);
  
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
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

  const resetForm = () => {
    setStep('select');
    setTestimonialType(null);
    setName('');
    setText('');
    setCompany('');
    setRole('');
    setLinkedinUrl('');
    setImage(null);
    setPreview(null);
  };

  const handleTypeSelect = (type: TestimonialType) => {
    setTestimonialType(type);
    setStep('form');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setTestimonialType(null);
  };

  return {
    // State
    step,
    testimonialType,
    name,
    text,
    company,
    role,
    linkedinUrl,
    image,
    preview,
    
    // Actions
    setName,
    setText,
    setCompany,
    setRole,
    setLinkedinUrl,
    handleImageChange,
    resetImage,
    resetForm,
    handleTypeSelect,
    handleBackToSelect
  };
}
