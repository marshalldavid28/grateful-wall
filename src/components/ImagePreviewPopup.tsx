
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => {
    setScale(1);
    setRotation(0);
  };
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-1 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-2 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              onClick={rotate}
              title="Rotate"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetZoom}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <ScrollArea className="flex-1 overflow-auto">
          <div 
            className="min-h-[50vh] flex items-center justify-center p-4"
            style={{ cursor: scale > 1 ? 'move' : 'default' }}
          >
            <div 
              className="transition-all duration-200 ease-out transform"
              style={{ 
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                maxWidth: '100%'
              }}
            >
              <img 
                src={imageUrl}
                alt={alt}
                className="max-w-full object-contain rounded"
                style={{ 
                  maxHeight: "80vh",
                  width: 'auto'
                }}
                onDoubleClick={zoomIn}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
