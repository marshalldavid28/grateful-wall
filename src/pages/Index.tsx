
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { AddTestimonialButton } from '@/components/AddTestimonialButton';
import { UploadModal } from '@/components/UploadModal';
import { mockTestimonials, Testimonial } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
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
    course?: string;
    image?: File;
  }) => {
    // In a real app, we would upload the image to a server
    // and get back a URL. For now, we'll just use a placeholder URL
    // if there's an image, or null if there isn't.
    
    const newTestimonial: Testimonial = {
      id: uuidv4(),
      studentName: data.name,
      text: data.text,
      company: data.company,
      role: data.role,
      course: data.course,
      imageUrl: data.image 
        ? URL.createObjectURL(data.image) 
        : undefined,
      date: new Date().toISOString().split('T')[0],
      featured: false
    };

    setTestimonials([newTestimonial, ...testimonials]);
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
            <h1 className="section-title mb-4">
              Our Students' Success Stories
            </h1>
            <p className="section-subtitle mx-auto mb-8">
              Discover how Adtechademy has transformed careers and opened new opportunities
              for our graduates in the ad tech industry.
            </p>
            <AddTestimonialButton 
              onClick={handleOpenModal} 
              className="mx-auto"
            />
          </div>
        </section>

        <section className="animate-fade-in">
          <TestimonialWall testimonials={testimonials} />
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
