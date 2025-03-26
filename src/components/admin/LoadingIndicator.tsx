
import React from 'react';

interface LoadingIndicatorProps {
  type: 'deleting' | 'approving' | 'loading';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ type }) => {
  const messages = {
    deleting: 'Deleting testimonial...',
    approving: 'Updating testimonial approval...',
    loading: 'Loading...'
  };

  return (
    <div className="mb-4 p-2 bg-muted/50 rounded flex items-center gap-2">
      <div className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full"></div>
      <span className="text-sm">{messages[type]}</span>
    </div>
  );
};
