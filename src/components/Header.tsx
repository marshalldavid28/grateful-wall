
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full sticky top-0 z-50 glass px-6 py-4", className)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="https://adtechademy.com/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/6e069cee-3f89-4e4f-8aeb-55b02249311c.png" 
              alt="Adtechademy Logo" 
              className="h-6 md:h-8" // Reduced size from h-8 md:h-10 to h-6 md:h-8
            />
          </a>
        </div>
        
        <nav className="flex items-center space-x-6">
          <a 
            href="https://adtechademy.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </a>
          <a 
            href="https://adtechademy.com/course/programmatic" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Our Course
          </a>
        </nav>
      </div>
    </header>
  );
};
