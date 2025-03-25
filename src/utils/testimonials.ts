
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

const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching testimonials from Supabase:', error);
      return [];
    }
    
    // Simply return empty array if no testimonials found
    if (data && data.length === 0) {
      return [];
    }
    
    return (data || []).map(mapSupabaseRecordToTestimonial);
  } catch (error) {
    console.error('Error in getTestimonials:', error);
    return [];
  }
};

// Function to add a new testimonial
const addTestimonial = async (
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
const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    console.log('Attempting to delete testimonial with ID:', id);
    
    if (!id) {
      throw new Error('Invalid testimonial ID provided for deletion');
    }
    
    // Use `eq` to explicitly match the ID - this ensures it uses the correct ID format
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting testimonial from Supabase:', error);
      throw error;
    }
    
    console.log(`Successfully deleted testimonial with ID: ${id}`);
  } catch (error) {
    console.error('Error in deleteTestimonial:', error);
    throw error;
  }
};

export { getTestimonials, addTestimonial, deleteTestimonial };
