
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TestimonialFormFooterProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TestimonialFormFooter: React.FC<TestimonialFormFooterProps> = ({
  onCancel,
  isSubmitting = false,
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        onClick={onCancel}
        variant="outline"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </DialogFooter>
  );
};
