
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

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
  type: 'written' | 'linkedin';
  headline?: string;
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
    tags: ["data science", "beginner friendly"],
    type: "written"
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
    tags: ["marketing", "advanced"],
    type: "written"
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
    tags: ["design", "intermediate"],
    type: "written"
  }
];

// Helper function to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert Supabase record to Testimonial object
const mapSupabaseRecordToTestimonial = (record: any): Testimonial => {
  return {
    id: record.id,
    name: record.name,
    role: record.role || undefined,
    company: record.company || undefined,
    text: record.text,
    avatarUrl: record.avatar_url || undefined,
    rating: record.rating || undefined,
    date: new Date(record.date),
    verified: record.verified,
    source: record.source as any || undefined,
    imageUrl: record.image_url || undefined,
    tags: record.tags || undefined,
    type: record.type as 'written' | 'linkedin',
    headline: record.headline || undefined
  };
};

// Convert Testimonial object to Supabase record
const mapTestimonialToSupabaseRecord = (testimonial: Partial<Testimonial>) => {
  return {
    name: testimonial.name,
    role: testimonial.role,
    company: testimonial.company,
    text: testimonial.text,
    avatar_url: testimonial.avatarUrl,
    rating: testimonial.rating,
    verified: testimonial.verified || false,
    source: testimonial.source,
    image_url: testimonial.imageUrl,
    tags: testimonial.tags,
    type: testimonial.type,
    headline: testimonial.headline
  };
};

// Load testimonials from Supabase
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching testimonials from Supabase:', error);
      // Fall back to default testimonials
      return defaultTestimonials;
    }
    
    // If we have data but it's empty and this is first time, seed with default testimonials
    if (data && data.length === 0) {
      // Check if we should seed the database
      const shouldSeed = localStorage.getItem('testimonials_seeded') !== 'true';
      
      if (shouldSeed) {
        // Seed the database with default testimonials
        for (const testimonial of defaultTestimonials) {
          await addTestimonial(testimonial);
        }
        localStorage.setItem('testimonials_seeded', 'true');
        
        // Fetch again after seeding
        const { data: seededData, error: seededError } = await supabase
          .from('testimonials')
          .select('*')
          .order('date', { ascending: false });
          
        if (seededError) {
          console.error('Error fetching seeded testimonials:', seededError);
          return defaultTestimonials;
        }
        
        return (seededData || []).map(mapSupabaseRecordToTestimonial);
      }
      
      return [];
    }
    
    // Map data to Testimonial objects
    return (data || []).map(mapSupabaseRecordToTestimonial);
  } catch (error) {
    console.error('Error in getTestimonials:', error);
    return defaultTestimonials;
  }
};

// Function to add a new testimonial
export const addTestimonial = async (
  testimonial: Omit<Testimonial, 'id' | 'date' | 'verified'> & { 
    image?: File,
    id?: string,
    date?: Date,
    verified?: boolean
  }
): Promise<Testimonial> => {
  try {
    // Convert image to base64 if provided
    let avatarUrl;
    let imageUrl;
    
    if (testimonial.image) {
      const base64Image = await fileToBase64(testimonial.image);
      
      if (testimonial.type === 'written') {
        avatarUrl = base64Image;
      } else if (testimonial.type === 'linkedin') {
        imageUrl = base64Image;
      }
    }
    
    // Prepare the record for Supabase
    const supabaseRecord = mapTestimonialToSupabaseRecord({
      ...testimonial,
      avatarUrl: avatarUrl || testimonial.avatarUrl,
      imageUrl: imageUrl || testimonial.imageUrl
    });
    
    // Insert the testimonial into Supabase
    const { data, error } = await supabase
      .from('testimonials')
      .insert(supabaseRecord)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding testimonial to Supabase:', error);
      throw error;
    }
    
    // Return the newly created testimonial
    return mapSupabaseRecordToTestimonial(data);
  } catch (error) {
    console.error('Error in addTestimonial:', error);
    throw error;
  }
};

// Function to delete a testimonial
export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting testimonial from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteTestimonial:', error);
    throw error;
  }
};

// Legacy export for backward compatibility
export const testimonials = defaultTestimonials;
