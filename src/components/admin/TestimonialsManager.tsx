
import React, { useState, useEffect } from 'react';
import { TestimonialsSection } from './TestimonialsSection';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { LoadingIndicator } from './LoadingIndicator';
import { getTestimonials, Testimonial, deleteTestimonial, updateTestimonialApproval } from '@/utils/testimonials';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestimonialsManagerProps {
  onUpdatePendingCount: (count: number) => void;
}

export const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({ onUpdatePendingCount }) => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      console.log('TestimonialsManager: Fetching testimonials');
      setLoading(true);
      // Pass true to get ALL testimonials for admin view
      const loadedTestimonials = await getTestimonials(true);
      setUserTestimonials(loadedTestimonials);
      
      // Update pending count
      const pendingCount = loadedTestimonials.filter(t => !t.approved).length;
      onUpdatePendingCount(pendingCount);
      
      console.log(`TestimonialsManager: Fetched ${loadedTestimonials.length} testimonials`);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error("Error loading testimonials. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    // Subscribe to changes in the testimonials table
    const testimonialsChannel = supabase
      .channel('admin-testimonials-manager-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        }, 
        async (payload) => {
          console.log('TestimonialsManager: Received real-time update:', payload);
          // Refresh the entire testimonial list on any change
          await fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      console.log('TestimonialsManager: Cleaning up subscription');
      supabase.removeChannel(testimonialsChannel);
    };
  }, [onUpdatePendingCount]);

  const handleDeleteTestimonial = async (id: string) => {
    if (!id || deleteLoading) {
      return;
    }
    
    setConfirmDelete(null);
    
    try {
      setDeleteLoading(id);
      
      const success = await deleteTestimonial(id);
      
      if (success) {
        // Remove from local state to update UI immediately
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
        // Update local state to reflect the change immediately
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

  return (
    <>
      {loading && <LoadingIndicator type="loading" />}
      
      {!loading && (
        <TestimonialsSection
          userTestimonials={userTestimonials}
          deleteLoading={deleteLoading}
          approvalLoading={approvalLoading}
          onDelete={openDeleteConfirm}
          onApprove={handleApproveTestimonial}
        />
      )}

      <DeleteConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDeleteTestimonial(confirmDelete)}
      />
    </>
  );
};
