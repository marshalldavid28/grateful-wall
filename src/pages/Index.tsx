
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { AddTestimonialButton } from '@/components/AddTestimonialButton';
import { UploadModal } from '@/components/UploadModal';
import { getTestimonials, Testimonial, addTestimonial, deleteTestimonial } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';
import { TestimonialType } from '@/components/TestimonialTypeSelector';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
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

  const handleDeleteTestimonial = async (id: string) => {
    try {
      console.log('Delete initiated for testimonial ID:', id);
      setDeleteLoading(id);
      
      // Find the testimonial in our local state
      const testimonialToDelete = userTestimonials.find(t => t.id === id);
      console.log('Attempting to delete testimonial:', testimonialToDelete);
      
      if (!testimonialToDelete) {
        console.error(`Testimonial with ID ${id} not found in local state`);
        toast.error("Could not find testimonial to delete");
        setDeleteLoading(null);
        return;
      }
      
      console.log(`Found testimonial in local state, proceeding with deletion: ${testimonialToDelete.name}`);
      
      try {
        // Attempt to delete from Supabase
        const wasDeleted = await deleteTestimonial(id);
        console.log(`Deletion API result for ${id}: ${wasDeleted}`);
        
        if (wasDeleted) {
          // Update local state immediately for better UX
          setUserTestimonials(prevTestimonials => 
            prevTestimonials.filter(testimonial => testimonial.id !== id)
          );
          
          toast.success("Testimonial deleted successfully");
        } else {
          console.error(`Failed to delete testimonial with ID ${id}`);
          toast.error("No testimonial was deleted. It may have already been removed.");
        }
      } catch (deleteError) {
        console.error('Error from deletion API:', deleteError);
        toast.error("Failed to delete testimonial. Please try again.");
      }
    } catch (error) {
      console.error('Error in handleDeleteTestimonial:', error);
      toast.error("Failed to process delete request. Please try again.");
    } finally {
      setDeleteLoading(null);
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
        testimonialData.text = data.headline || 'LinkedIn Testimonial';
        testimonialData.headline = data.headline;
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
        <section className="mb-12 sm:mb-16 text-center">
          <div className="animate-slide-down">
            <div className="mb-2">
              <span className="chip">Wall of Gratitude</span>
            </div>
            <h1 className="section-title mb-4 text-[#333333] text-3xl sm:text-4xl md:text-5xl">
              Our Success Stories
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
            <TestimonialWall 
              testimonials={userTestimonials} 
              onDelete={handleDeleteTestimonial}
              isAdmin={true}
              deletingId={deleteLoading}
            />
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
