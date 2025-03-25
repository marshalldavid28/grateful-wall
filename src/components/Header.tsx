
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
          <h1 className="text-xl font-semibold font-display tracking-tight">
            Adtechademy <span className="text-primary">Testimonials</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Courses
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            About Us
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};
