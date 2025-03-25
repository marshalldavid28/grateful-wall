
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { UploadModal } from '@/components/UploadModal';
import { getTestimonials, Testimonial, addTestimonial } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';
import { TestimonialType } from '@/components/TestimonialTypeSelector';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/components/HeroSection';
import { TestimonialSection } from '@/components/TestimonialSection';
import { PageFooter } from '@/components/PageFooter';

const Index = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: shadcnToast } = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const loadedTestimonials = await getTestimonials();
        setUserTestimonials(loadedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        toast.error("Error loading testimonials. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();

    const testimonialsChannel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        }, 
        async () => {
          try {
            const refreshedTestimonials = await getTestimonials();
            setUserTestimonials(refreshedTestimonials);
          } catch (error) {
            console.error('Error refreshing testimonials:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(testimonialsChannel);
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  const handleSubmitTestimonial = async (data: {
    name: string;
    text: string;
    company?: string;
    role?: string;
    image?: File;
    type: TestimonialType;
    headline?: string;
    linkedinUrl?: string;
  }) => {
    try {
      setIsSubmitting(true);
      
      const testimonialData: Partial<Testimonial> & { image?: File } = {
        type: data.type,
        image: data.image,
      };

      if (data.type === 'written') {
        testimonialData.name = data.name;
        testimonialData.text = data.text;
        testimonialData.company = data.company;
        testimonialData.role = data.role;
      } else if (data.type === 'linkedin') {
        testimonialData.name = 'LinkedIn User'; // Default name for LinkedIn testimonials
        testimonialData.text = data.headline || 'LinkedIn Testimonial';
        testimonialData.headline = data.headline;
        testimonialData.linkedinUrl = data.linkedinUrl;
      }

      const newTestimonial = await addTestimonial(
        testimonialData as Omit<Testimonial, 'id' | 'date' | 'verified'> & { image?: File }
      );

      setUserTestimonials([newTestimonial, ...userTestimonials]);
      handleCloseModal();
      
      toast.success("Testimonial submitted successfully!");
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
        <HeroSection onOpenModal={handleOpenModal} />
        <TestimonialSection 
          testimonials={userTestimonials}
          isLoading={isLoading}
        />
      </main>

      <PageFooter />

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmitTestimonial}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Index;
