
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
  featured?: boolean;
  tags?: string[];
}

// Mock testimonials data for initial display
export const testimonials: Testimonial[] = [
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
    featured: true,
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
    featured: true,
    tags: ["design", "intermediate"]
  }
];

// Function to add a new testimonial
export const addTestimonial = (testimonial: Omit<Testimonial, 'id' | 'date' | 'verified'>): Testimonial => {
  const newTestimonial: Testimonial = {
    id: uuidv4(),
    ...testimonial,
    date: new Date(),
    verified: false,
  };
  
  // In a real application, you would persist this to a database
  // For now, we'll just return the new testimonial
  return newTestimonial;
};

// Function to get all testimonials
export const getTestimonials = (): Testimonial[] => {
  // In a real application, you would fetch this from an API or database
  return testimonials;
};

// Function to get featured testimonials
export const getFeaturedTestimonials = (): Testimonial[] => {
  return testimonials.filter(testimonial => testimonial.featured);
};
