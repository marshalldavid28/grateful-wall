
import React from 'react';
import { TestimonialWall } from '@/components/TestimonialWall';
import { Testimonial } from '@/utils/testimonials';
import { LoadingIndicator } from './LoadingIndicator';

interface TestimonialsSectionProps {
  userTestimonials: Testimonial[];
  deleteLoading: string | null;
  approvalLoading: string | null;
  onDelete: (id: string) => void;
  onApprove: (id: string, approve: boolean) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  userTestimonials,
  deleteLoading,
  approvalLoading,
  onDelete,
  onApprove,
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Testimonials</h2>
      <p className="text-muted-foreground mb-6">
        You can approve, delete, or modify testimonials from this panel.
      </p>
      
      {(deleteLoading || approvalLoading) && (
        <LoadingIndicator type={deleteLoading ? 'deleting' : 'approving'} />
      )}
      
      {userTestimonials.length > 0 ? (
        <TestimonialWall 
          testimonials={userTestimonials} 
          onDelete={onDelete}
          onApprove={onApprove}
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
  );
};
