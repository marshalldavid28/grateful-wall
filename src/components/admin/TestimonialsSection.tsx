
import React, { useState } from 'react';
import { TestimonialsTable } from './TestimonialsTable';
import { TestimonialWall } from '@/components/TestimonialWall';
import { Testimonial } from '@/utils/testimonials';
import { LoadingIndicator } from './LoadingIndicator';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);

  // Count of pending testimonials
  const pendingCount = userTestimonials.filter(t => !t.approved).length;

  return (
    <section className="mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Testimonials</h2>
      <p className="text-muted-foreground mb-6">
        You can approve, delete, or modify testimonials from this panel.
        {pendingCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            {pendingCount} pending
          </span>
        )}
      </p>
      
      {(deleteLoading || approvalLoading) && (
        <LoadingIndicator type={deleteLoading ? 'deleting' : 'approving'} />
      )}
      
      <div className="mb-4 flex items-center justify-end space-x-2">
        <Button 
          variant={viewMode === 'grid' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          Grid
        </Button>
        <Button 
          variant={viewMode === 'table' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setViewMode('table')}
        >
          <List className="h-4 w-4 mr-1" />
          Table
        </Button>
      </div>
      
      {userTestimonials.length > 0 ? (
        viewMode === 'grid' ? (
          <TestimonialWall 
            testimonials={userTestimonials} 
            onDelete={onDelete}
            onApprove={onApprove}
            isAdmin={true}
            deletingId={deleteLoading}
            approvingId={approvalLoading}
          />
        ) : (
          <TestimonialsTable 
            testimonials={userTestimonials}
            deletingId={deleteLoading}
            approvingId={approvalLoading}
            onDelete={onDelete}
            onApprove={onApprove}
            showApprovedOnly={showApprovedOnly}
            onToggleShowApproved={() => setShowApprovedOnly(!showApprovedOnly)}
          />
        )
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No testimonials available.</p>
        </div>
      )}
    </section>
  );
};
