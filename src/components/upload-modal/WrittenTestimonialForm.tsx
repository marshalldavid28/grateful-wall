
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X } from 'lucide-react';

interface WrittenTestimonialFormProps {
  name: string;
  setName: (value: string) => void;
  text: string;
  setText: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  preview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetImage: () => void;
}

export const WrittenTestimonialForm: React.FC<WrittenTestimonialFormProps> = ({
  name,
  setName,
  text,
  setText,
  company,
  setCompany,
  role,
  setRole,
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
        <Label htmlFor="testimonial">Your Testimonial</Label>
        <Textarea
          id="testimonial"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share how Adtechademy helped your career..."
          required
          className="mt-1 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your Company"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Your Position"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="profile-upload">Profile Picture (Optional)</Label>
        <div className="mt-1">
          {preview ? (
            <div className="relative mt-2 mb-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="h-48 w-48 object-cover rounded-full mx-auto"
              />
              <button
                type="button"
                onClick={resetImage}
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-6 mt-2">
              <label 
                htmlFor="profile-upload" 
                className="flex flex-col items-center cursor-pointer text-center"
              >
                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload profile picture
                </span>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
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
