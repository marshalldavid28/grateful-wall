
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { testimonials, Testimonial, deleteTestimonial } from '@/utils/testimonials';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>(testimonials);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleDeleteTestimonial = (id: string) => {
    const updatedTestimonials = deleteTestimonial(id, userTestimonials);
    setUserTestimonials(updatedTestimonials);
    
    toast({
      title: "Testimonial Deleted",
      description: "The testimonial has been removed successfully.",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-6 py-12 md:py-20 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Manage Testimonials</h2>
          <p className="text-muted-foreground mb-6">
            You can delete any testimonial by clicking the trash icon on each card.
          </p>
          
          <TestimonialWall 
            testimonials={userTestimonials} 
            onDelete={handleDeleteTestimonial}
            isAdmin={true}
          />
        </section>
      </main>

      <footer className="border-t py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. Admin Panel</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
