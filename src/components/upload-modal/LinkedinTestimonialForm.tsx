
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImagePlus, X } from 'lucide-react';

interface LinkedinTestimonialFormProps {
  name: string;
  setName: (value: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  preview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetImage: () => void;
}

export const LinkedinTestimonialForm: React.FC<LinkedinTestimonialFormProps> = ({
  name,
  setName,
  linkedinUrl,
  setLinkedinUrl,
  preview,
  handleImageChange,
  resetImage,
}) => {
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="linkedin-url">LinkedIn Post URL</Label>
        <Input
          id="linkedin-url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://www.linkedin.com/feed/update/..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="linkedin-upload">LinkedIn Screenshot <span className="text-red-500">*</span></Label>
        <div className="mt-1">
          {preview ? (
            <div className="relative mt-2 mb-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="h-64 w-full object-contain rounded-md border"
              />
              <button
                type="button"
                onClick={resetImage}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-6 mt-2">
              <label 
                htmlFor="linkedin-upload" 
                className="flex flex-col items-center cursor-pointer text-center"
              >
                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload LinkedIn screenshot
                </span>
                <input
                  id="linkedin-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
