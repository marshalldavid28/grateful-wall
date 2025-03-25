
import React from 'react';

export const PageFooter: React.FC = () => {
  return (
    <footer className="border-t py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Adtechademy. All rights reserved.</p>
      </div>
    </footer>
  );
};
