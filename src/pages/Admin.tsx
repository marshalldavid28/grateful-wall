import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TestimonialsSection } from '@/components/admin/TestimonialsSection';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { FullPageLoader } from '@/components/admin/FullPageLoader';
import { getTestimonials, Testimonial, deleteTestimonial, updateTestimonialApproval } from '@/utils/testimonials';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
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

    const testimonialsChannel = supabase
      .channel('admin-testimonials-changes')
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const isDemoAdmin = localStorage.getItem('demoAdminLoggedIn') === 'true';
        
        if (isDemoAdmin) {
          setLoading(false);
          return;
        }
        
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
    if (!id || deleteLoading) {
      return;
    }
    
    setConfirmDelete(null);
    
    try {
      setDeleteLoading(id);
      
      const success = await deleteTestimonial(id);
      
      if (success) {
        setUserTestimonials(prevTestimonials => 
          prevTestimonials.filter(testimonial => testimonial.id !== id)
        );
        toast.success("Testimonial deleted successfully");
      } else {
        toast.error("Failed to delete testimonial. Please try again.");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Error deleting testimonial. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleApproveTestimonial = async (id: string, approve: boolean) => {
    if (!id || approvalLoading) {
      return;
    }
    
    try {
      setApprovalLoading(id);
      
      const success = await updateTestimonialApproval(id, approve);
      
      if (success) {
        setUserTestimonials(prevTestimonials => 
          prevTestimonials.map(testimonial => 
            testimonial.id === id 
              ? { ...testimonial, approved: approve }
              : testimonial
          )
        );
        toast.success(`Testimonial ${approve ? 'approved' : 'unapproved'} successfully`);
      } else {
        toast.error(`Failed to ${approve ? 'approve' : 'unapprove'} testimonial. Please try again.`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast.error("Error updating testimonial approval. Please try again.");
    } finally {
      setApprovalLoading(null);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmDelete(id);
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('demoAdminLoggedIn');
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  // Count of pending testimonials
  const pendingCount = userTestimonials.filter(t => !t.approved).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
        <AdminHeader onSignOut={handleSignOut} pendingCount={pendingCount} />

        <TestimonialsSection
          userTestimonials={userTestimonials}
          deleteLoading={deleteLoading}
          approvalLoading={approvalLoading}
          onDelete={openDeleteConfirm}
          onApprove={handleApproveTestimonial}
        />
      </main>

      <DeleteConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDeleteTestimonial(confirmDelete)}
      />

      <footer className="border-t py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. Admin Panel</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
