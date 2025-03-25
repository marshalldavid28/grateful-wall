
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { AddTestimonialButton } from '@/components/AddTestimonialButton';
import { UploadModal } from '@/components/UploadModal';
import { testimonials, Testimonial, addTestimonial } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>(testimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTestimonial = (data: {
    name: string;
    text: string;
    company?: string;
    role?: string;
    image?: File;
  }) => {
    // In a real app, we would upload the image to a server
    // and get back a URL. For now, we'll just use a placeholder URL
    // if there's an image, or null if there isn't.
    
    const newTestimonial = addTestimonial({
      name: data.name,
      text: data.text,
      company: data.company,
      role: data.role,
      avatarUrl: data.image 
        ? URL.createObjectURL(data.image) 
        : undefined,
    });

    setUserTestimonials([newTestimonial, ...userTestimonials]);
    handleCloseModal();
    
    toast({
      title: "Testimonial Submitted!",
      description: "Thank you for sharing your experience with Adtechademy!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-6 py-12 md:py-20 max-w-7xl mx-auto w-full">
        <section className="mb-16 text-center">
          <div className="animate-slide-down">
            <div className="mb-2">
              <span className="chip">Wall of Gratitude</span>
            </div>
            <h1 className="section-title mb-4 text-[#333333]">
              Our Students' Success Stories
            </h1>
            <p className="section-subtitle mx-auto mb-8">
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
          <TestimonialWall testimonials={userTestimonials} />
        </section>
      </main>

      <footer className="border-t py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. All rights reserved.</p>
        </div>
      </footer>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmitTestimonial}
      />
    </div>
  );
};

export default Index;
