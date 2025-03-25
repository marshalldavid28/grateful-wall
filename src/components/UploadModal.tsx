
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, ArrowLeft } from 'lucide-react';
import { TestimonialTypeSelector, TestimonialType } from './TestimonialTypeSelector';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    text: string;
    company?: string;
    role?: string;
    image?: File;
    type: TestimonialType;
    headline?: string;
  }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [testimonialType, setTestimonialType] = useState<TestimonialType | null>(null);
  
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [headline, setHeadline] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialType) return;
    
    onSubmit({
      name,
      text,
      company,
      role,
      image: image || undefined,
      type: testimonialType,
      headline: testimonialType === 'linkedin' ? headline : undefined
    });
    resetForm();
  };

  const resetForm = () => {
    setStep('select');
    setTestimonialType(null);
    setName('');
    setText('');
    setCompany('');
    setRole('');
    setHeadline('');
    setImage(null);
    setPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeSelect = (type: TestimonialType) => {
    setTestimonialType(type);
    setStep('form');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setTestimonialType(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 'select' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Share Your Experience</DialogTitle>
              <DialogDescription>
                Choose how you'd like to share your experience with Adtechademy
              </DialogDescription>
            </DialogHeader>

            <TestimonialTypeSelector onSelect={handleTypeSelect} className="my-6" />
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
              <div className="flex items-center">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBackToSelect}
                  className="mr-2 -ml-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-2xl font-display">
                  {testimonialType === 'written' 
                    ? 'Write Your Testimonial' 
                    : 'Upload LinkedIn Screenshot'}
                </DialogTitle>
              </div>
              <DialogDescription>
                {testimonialType === 'written'
                  ? "We'd love to hear about your journey with Adtechademy!"
                  : "Share a screenshot of your LinkedIn recommendation for Adtechademy"}
              </DialogDescription>
            </DialogHeader>

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

              {testimonialType === 'written' ? (
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
              ) : (
                <>
                  <div>
                    <Label htmlFor="headline">Headline or Quote</Label>
                    <Input
                      id="headline"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Add a headline for this testimonial"
                      required
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
                            onClick={(e) => {
                              e.preventDefault();
                              setImage(null);
                              setPreview(null);
                            }}
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
                              required={testimonialType === 'linkedin'}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {testimonialType === 'written' && (
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
              )}

              {testimonialType === 'written' && (
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
                          onClick={() => {
                            setImage(null);
                            setPreview(null);
                          }}
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
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
