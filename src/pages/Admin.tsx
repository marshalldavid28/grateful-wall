
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { getTestimonials, Testimonial, deleteTestimonial } from '@/utils/testimonials';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { toast: shadcnToast } = useToast();
  const navigate = useNavigate();

  // Load testimonials on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const loadedTestimonials = await getTestimonials();
        setUserTestimonials(loadedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        toast.error("Error loading testimonials. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Subscribe to changes in the testimonials table
    const testimonialsChannel = supabase
      .channel('admin-testimonials-changes')
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        // Check for demo admin login first
        const isDemoAdmin = localStorage.getItem('demoAdminLoggedIn') === 'true';
        
        if (isDemoAdmin) {
          setLoading(false);
          return;
        }
        
        // Check for regular Supabase session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          navigate('/login');
          return;
        }
        
        if (!data.session) {
          navigate('/login');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  const handleDeleteTestimonial = async (id: string) => {
    try {
      console.log('Delete initiated for testimonial ID:', id);
      setDeleteLoading(id);
      
      // Log the testimonial that's being deleted for debugging
      const testimonialToDelete = userTestimonials.find(t => t.id === id);
      console.log('Attempting to delete testimonial:', testimonialToDelete);
      
      // Delete from Supabase
      const wasDeleted = await deleteTestimonial(id);
      
      if (wasDeleted) {
        // Update local state immediately for better UX
        setUserTestimonials(prevTestimonials => 
          prevTestimonials.filter(testimonial => testimonial.id !== id)
        );
        
        toast.success("Testimonial deleted successfully");
      } else {
        toast.error("No testimonial was deleted. It may have already been removed.");
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error("Failed to delete testimonial. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear demo admin login if exists
      localStorage.removeItem('demoAdminLoggedIn');
      
      // Sign out from Supabase auth
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out. Please try again.");
    }
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
      
      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Testimonials</h2>
          <p className="text-muted-foreground mb-6">
            You can delete any testimonial by clicking the trash icon on each card.
            Click twice to confirm deletion.
          </p>
          
          {deleteLoading && (
            <div className="mb-4 p-2 bg-muted/50 rounded flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full"></div>
              <span className="text-sm">Deleting testimonial...</span>
            </div>
          )}
          
          {userTestimonials.length > 0 ? (
            <TestimonialWall 
              testimonials={userTestimonials} 
              onDelete={handleDeleteTestimonial}
              isAdmin={true}
              deletingId={deleteLoading}
            />
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No testimonials available.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. Admin Panel</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
