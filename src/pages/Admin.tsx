import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TestimonialWall } from '@/components/TestimonialWall';
import { getTestimonials, Testimonial, deleteTestimonial, updateTestimonialApproval } from '@/utils/testimonials';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const { toast: shadcnToast } = useToast();
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
            You can approve, delete, or modify testimonials from this panel.
          </p>
          
          {(deleteLoading || approvalLoading) && (
            <div className="mb-4 p-2 bg-muted/50 rounded flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full"></div>
              <span className="text-sm">
                {deleteLoading ? 'Deleting testimonial...' : 'Updating testimonial approval...'}
              </span>
            </div>
          )}
          
          {userTestimonials.length > 0 ? (
            <TestimonialWall 
              testimonials={userTestimonials} 
              onDelete={openDeleteConfirm}
              onApprove={handleApproveTestimonial}
              isAdmin={true}
              deletingId={deleteLoading}
              approvingId={approvalLoading}
            />
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No testimonials available.</p>
            </div>
          )}
        </section>
      </main>

      <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDelete && handleDeleteTestimonial(confirmDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <footer className="border-t py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. Admin Panel</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
