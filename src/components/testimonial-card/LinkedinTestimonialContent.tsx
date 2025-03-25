
import React, { useState } from 'react';
import { Linkedin, ExternalLink, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImagePreviewPopup } from '@/components/ImagePreviewPopup';

interface LinkedinTestimonialContentProps {
  headline?: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

export const LinkedinTestimonialContent: React.FC<LinkedinTestimonialContentProps> = ({
  headline,
  imageUrl,
  linkedinUrl,
}) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  return (
    <>
      <div className="mb-3 flex items-center text-primary">
        {linkedinUrl ? (
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:underline"
          >
            <Linkedin size={20} className="mr-2" />
            <span className="text-sm font-medium">View LinkedIn Testimonial</span>
            <ExternalLink size={14} className="ml-1" />
          </a>
        ) : (
          <>
            <Linkedin size={20} className="mr-2" />
            <span className="text-sm font-medium">LinkedIn Testimonial</span>
          </>
        )}
      </div>
      
      {headline && (
        <p className="text-lg font-medium text-foreground mb-4">{headline}</p>
      )}
      
      {imageUrl && (
        <div className="mb-4 rounded-md overflow-hidden border border-border relative group">
          <img 
            src={imageUrl} 
            alt="LinkedIn testimonial" 
            className="w-full object-contain cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setIsImagePreviewOpen(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-1" 
              onClick={() => setIsImagePreviewOpen(true)}
            >
              <ZoomIn size={16} />
              View Full Image
            </Button>
          </div>
        </div>
      )}
      
      {imageUrl && (
        <ImagePreviewPopup 
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={imageUrl}
          alt="LinkedIn testimonial"
        />
      )}
    </>
  );
};
