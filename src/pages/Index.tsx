
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { AddTestimonialButton } from '@/components/AddTestimonialButton';
import { UploadModal } from '@/components/UploadModal';
import { getTestimonials, Testimonial, addTestimonial } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';
import { TestimonialType } from '@/components/TestimonialTypeSelector';

const Index = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load testimonials on component mount
  useEffect(() => {
    try {
      const loadedTestimonials = getTestimonials();
      setUserTestimonials(loadedTestimonials);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: "Error Loading Testimonials",
        description: "There was a problem loading the testimonials. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
  }) => {
    try {
      setIsSubmitting(true);
      
      // Handle different testimonial types
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
        // For LinkedIn testimonials, we use text for the headline content
        testimonialData.text = data.headline || 'LinkedIn Testimonial';
        testimonialData.headline = data.headline;
      }

      // Add the new testimonial, passing the current list to ensure we're not losing any
      const newTestimonial = await addTestimonial(
        testimonialData as Omit<Testimonial, 'id' | 'date' | 'verified'> & { image?: File }, 
        userTestimonials
      );

      setUserTestimonials([newTestimonial, ...userTestimonials]);
      handleCloseModal();
      
      toast({
        title: "Testimonial Submitted!",
        description: "Thank you for sharing your experience with Adtechademy!",
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem saving your testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
        <section className="mb-12 sm:mb-16 text-center">
          <div className="animate-slide-down">
            <div className="mb-2">
              <span className="chip">Wall of Gratitude</span>
            </div>
            <h1 className="section-title mb-4 text-[#333333] text-3xl sm:text-4xl md:text-5xl">
              Our Students' Success Stories
            </h1>
            <p className="section-subtitle mx-auto mb-6 sm:mb-8 text-base sm:text-xl">
              Discover how Adtechademy has transformed careers and opened new opportunities
              for our graduates in the ad tech industry.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AddTestimonialButton 
                onClick={handleOpenModal} 
                className="mx-auto"
              />
            </div>
          </div>
        </section>

        <section className="animate-fade-in">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : userTestimonials.length > 0 ? (
            <TestimonialWall testimonials={userTestimonials} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No testimonials yet. Be the first to share your experience!</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. All rights reserved.</p>
        </div>
      </footer>

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
