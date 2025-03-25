
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ImagePreviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export const ImagePreviewPopup: React.FC<ImagePreviewPopupProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt = "Image preview"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-1 max-h-[90vh] overflow-auto">
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-auto object-contain rounded" 
        />
      </DialogContent>
    </Dialog>
  );
};
