
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TestimonialFormFooterProps {
  onCancel: () => void;
}

export const TestimonialFormFooter: React.FC<TestimonialFormFooterProps> = ({
  onCancel,
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        onClick={onCancel}
        variant="outline"
      >
        Cancel
      </Button>
      <Button type="submit">Submit</Button>
    </DialogFooter>
  );
};
