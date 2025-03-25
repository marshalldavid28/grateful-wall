
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { AddTestimonialButton } from '@/components/AddTestimonialButton';
import { UploadModal } from '@/components/UploadModal';
import { getTestimonials, Testimonial, addTestimonial, seedDefaultTestimonials } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';
import { TestimonialType } from '@/components/TestimonialTypeSelector';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast: shadcnToast } = useToast();

  // Load testimonials on component mount
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

    // Subscribe to changes in the testimonials table
    const testimonialsChannel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        }, 
        async () => {
          // Refresh testimonials when changes are detected
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
      // Unsubscribe from the channel when the component unmounts
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

  const handleSeedTestimonials = async () => {
    if (userTestimonials.length > 0) {
      if (!window.confirm('There are already testimonials in the database. Are you sure you want to add example testimonials?')) {
        return;
      }
    }
    
    try {
      setIsSeeding(true);
      await seedDefaultTestimonials();
      toast.success("Example testimonials added successfully!");
      
      // Refresh the testimonials
      const refreshedTestimonials = await getTestimonials();
      setUserTestimonials(refreshedTestimonials);
    } catch (error) {
      console.error('Error seeding testimonials:', error);
      toast.error("Failed to add example testimonials.");
    } finally {
      setIsSeeding(false);
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

      // Add the new testimonial to Supabase
      const newTestimonial = await addTestimonial(
        testimonialData as Omit<Testimonial, 'id' | 'date' | 'verified'> & { image?: File }
      );

      // Update the local state with the new testimonial
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
              {userTestimonials.length === 0 && (
                <Button
                  variant="outline"
                  onClick={handleSeedTestimonials}
                  disabled={isSeeding}
                  className="mx-auto"
                >
                  {isSeeding ? 'Adding examples...' : 'Add example testimonials'}
                </Button>
              )}
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
