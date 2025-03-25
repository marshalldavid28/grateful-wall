
import React from 'react';
import { type Testimonial } from '@/utils/testimonials';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  className 
}) => {
  const { studentName, imageUrl, text, company, role, course, featured } = testimonial;

  return (
    <div 
      className={cn(
        "testimonial-card flex flex-col h-full", 
        featured ? "md:col-span-2 lg:col-span-1" : "",
        className
      )}
    >
      {featured && (
        <div className="chip mb-4 self-start">
          Featured
        </div>
      )}
      
      <div className="mb-4 text-primary/30">
        <Quote size={24} />
      </div>
      
      <p className="text-foreground/80 mb-6 flex-grow">{text}</p>
      
      <div className="flex items-center mt-auto">
        {imageUrl ? (
          <div className="flex-shrink-0 mr-4">
            <img 
              src={imageUrl} 
              alt={studentName} 
              className="h-12 w-12 rounded-full object-cover border border-border"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 mr-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">
              {studentName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-foreground">{studentName}</h4>
          {(role || company) && (
            <p className="text-sm text-muted-foreground">
              {role}{role && company && ' at '}{company}
            </p>
          )}
          {course && (
            <p className="text-xs text-primary mt-1">
              {course}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
