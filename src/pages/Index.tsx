
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { UploadModal } from '@/components/UploadModal';
import { getTestimonials, Testimonial, addTestimonial } from '@/utils/testimonials';
import { useToast } from '@/hooks/use-toast';
import { TestimonialType } from '@/components/TestimonialTypeSelector';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/components/HeroSection';
import { TestimonialSection } from '@/components/TestimonialSection';
import { PageFooter } from '@/components/PageFooter';

const Index = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: shadcnToast } = useToast();

  const fetchTestimonials = async () => {
    try {
      console.log('Index: Fetching approved testimonials');
      setIsLoading(true);
      // Pass false to only get approved testimonials for public view
      const loadedTestimonials = await getTestimonials(false);
      setUserTestimonials(loadedTestimonials);
      console.log(`Index: Fetched ${loadedTestimonials.length} approved testimonials`);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error("Error loading testimonials. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    // Subscribe to changes, but only show approved testimonials
    const testimonialsChannel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        }, 
        async (payload) => {
          console.log('Index: Received real-time update:', payload);
          // Reload all approved testimonials
          await fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      console.log('Index: Cleaning up subscription');
      supabase.removeChannel(testimonialsChannel);
    };
  }, []);

  // Clear pending testimonials if they get approved and appear in the main list
  useEffect(() => {
    if (pendingTestimonials.length > 0 && userTestimonials.length > 0) {
      const approvedIds = userTestimonials.map(t => t.id);
      setPendingTestimonials(prevPending => 
        prevPending.filter(pending => !approvedIds.includes(pending.id))
      );
    }
  }, [userTestimonials, pendingTestimonials]);

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
    linkedinUrl?: string;
  }) => {
    try {
      setIsSubmitting(true);
      
      const testimonialData: Partial<Testimonial> & { image?: File } = {
        name: data.name,
        type: data.type,
        image: data.image,
      };

      if (data.type === 'written') {
        testimonialData.text = data.text;
        testimonialData.company = data.company;
        testimonialData.role = data.role;
      } else if (data.type === 'linkedin') {
        testimonialData.text = 'LinkedIn Testimonial';
        testimonialData.linkedinUrl = data.linkedinUrl;
      }

      // Mark as not approved by default
      testimonialData.approved = false;

      const newTestimonial = await addTestimonial(
        testimonialData as Omit<Testimonial, 'id' | 'date' | 'verified'> & { image?: File }
      );

      console.log('New testimonial submitted:', newTestimonial);
      
      // Add the new testimonial to the pending list since it's not approved yet
      setPendingTestimonials(prev => [newTestimonial, ...prev]);
      
      handleCloseModal();
      
      toast.success("Thank you! Your testimonial has been submitted and is pending approval.");
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine approved testimonials with pending ones for display
  const allTestimonials = [...userTestimonials, ...pendingTestimonials];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
        <HeroSection onOpenModal={handleOpenModal} />
        <TestimonialSection 
          testimonials={allTestimonials}
          isLoading={isLoading}
        />
        
        {pendingTestimonials.length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 text-sm">
              Your testimonial has been submitted and is awaiting approval. It will be visible to others once approved.
            </p>
          </div>
        )}
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
