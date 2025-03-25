
import { v4 as uuidv4 } from 'uuid';

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  text: string;
  avatarUrl?: string;
  rating?: number;
  date: Date;
  verified: boolean;
  source?: 'linkedin' | 'website' | 'email' | 'other';
  imageUrl?: string;
  tags?: string[];
}

// Default testimonials data for initial display if no stored testimonials exist
const defaultTestimonials: Testimonial[] = [
  {
    id: uuidv4(),
    name: "Alex Johnson",
    role: "Data Science Student",
    company: "TechU",
    text: "The Adtechademy course completely transformed my understanding of digital marketing. The instructors were incredibly knowledgeable and supportive throughout the entire journey.",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: new Date("2023-06-15"),
    verified: true,
    source: "linkedin",
    tags: ["data science", "beginner friendly"]
  },
  {
    id: uuidv4(),
    name: "Sarah Miller",
    role: "Marketing Manager",
    company: "CreativeStudio",
    text: "I've taken several online courses before, but Adtechademy stands out for its practical approach and real-world applications. The community support is fantastic too!",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    date: new Date("2023-05-22"),
    verified: true,
    source: "website",
    tags: ["marketing", "advanced"]
  },
  {
    id: uuidv4(),
    name: "Michael Chen",
    role: "Product Designer",
    company: "DesignHub",
    text: "Adtechademy helped me bridge the gap between design and marketing. The instructors present complex concepts in an accessible way that's easy to understand and apply.",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    date: new Date("2023-07-03"),
    verified: true,
    source: "email",
    tags: ["design", "intermediate"]
  }
];

// Helper function to serialize/deserialize Date objects for localStorage
const serializeTestimonial = (testimonial: Testimonial): any => ({
  ...testimonial,
  date: testimonial.date.toISOString()
});

const deserializeTestimonial = (testimonial: any): Testimonial => ({
  ...testimonial,
  date: new Date(testimonial.date)
});

// Load testimonials from localStorage or use default ones
export const getTestimonials = (): Testimonial[] => {
  try {
    const storedTestimonials = localStorage.getItem('testimonials');
    
    if (storedTestimonials) {
      // Parse stored testimonials and deserialize the date
      const parsed = JSON.parse(storedTestimonials);
      return parsed.map(deserializeTestimonial);
    } else {
      // If no stored testimonials, save the default ones and return them
      localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials.map(serializeTestimonial)));
      return defaultTestimonials;
    }
  } catch (error) {
    console.error('Error loading testimonials from localStorage:', error);
    return defaultTestimonials;
  }
};

// Save testimonials to localStorage
const saveTestimonials = (testimonials: Testimonial[]): void => {
  try {
    localStorage.setItem('testimonials', JSON.stringify(testimonials.map(serializeTestimonial)));
  } catch (error) {
    console.error('Error saving testimonials to localStorage:', error);
  }
};

// Function to add a new testimonial
export const addTestimonial = (testimonial: Omit<Testimonial, 'id' | 'date' | 'verified'>, currentTestimonials: Testimonial[] = []): Testimonial => {
  // Get existing testimonials first
  const testimonials = currentTestimonials.length ? currentTestimonials : getTestimonials();
  
  const newTestimonial: Testimonial = {
    id: uuidv4(),
    ...testimonial,
    date: new Date(),
    verified: false,
  };
  
  // Add new testimonial and save to localStorage
  const updatedTestimonials = [newTestimonial, ...testimonials];
  saveTestimonials(updatedTestimonials);
  
  return newTestimonial;
};

// Function to delete a testimonial
export const deleteTestimonial = (id: string, currentTestimonials: Testimonial[] = []): Testimonial[] => {
  // Get existing testimonials first if not provided
  const testimonials = currentTestimonials.length ? currentTestimonials : getTestimonials();
  
  const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
  saveTestimonials(updatedTestimonials);
  
  return updatedTestimonials;
};

// Legacy export for backward compatibility
export const testimonials = getTestimonials();
