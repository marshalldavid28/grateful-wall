
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
  approved: boolean;
  source?: 'linkedin' | 'website' | 'email' | 'other';
  imageUrl?: string;
  tags?: string[];
  type: 'written' | 'linkedin';
  linkedinUrl?: string;
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
    approved: record.approved || false,
    source: record.source as any || undefined,
    imageUrl: record.image_url || undefined,
    tags: record.tags || undefined,
    type: record.type as 'written' | 'linkedin',
    linkedinUrl: record.linkedin_url || undefined
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
    approved: testimonial.approved ?? false,
    source: testimonial.source,
    image_url: testimonial.imageUrl,
    tags: testimonial.tags,
    type: testimonial.type,
    linkedin_url: testimonial.linkedinUrl
  };
};

// Get testimonials from Supabase with appropriate filtering
const getTestimonials = async (isAdmin: boolean = false): Promise<Testimonial[]> => {
  try {
    console.log(`Fetching testimonials, isAdmin: ${isAdmin}`);
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('date', { ascending: false });
    
    // Only filter by approval status for non-admin views
    if (!isAdmin) {
      console.log('Filtering for only approved testimonials');
      query = query.eq('approved', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching testimonials from Supabase:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} testimonials from Supabase`);
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
    
    console.log('Successfully added testimonial:', data);
    
    // Return the newly created testimonial
    return mapSupabaseRecordToTestimonial(data);
  } catch (error) {
    console.error('Error in addTestimonial:', error);
    throw error;
  }
};

// Function to delete a testimonial by ID
const deleteTestimonial = async (id: string): Promise<boolean> => {
  if (!id || typeof id !== 'string') {
    console.error('Invalid testimonial ID:', id);
    return false;
  }

  try {
    console.log(`Deleting testimonial with ID: ${id}`);
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    
    console.log(`Successfully deleted testimonial with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('Exception in deleteTestimonial:', error);
    return false;
  }
};

// Function to update testimonial approval status
const updateTestimonialApproval = async (id: string, approved: boolean): Promise<boolean> => {
  try {
    console.log(`Updating testimonial approval status. ID: ${id}, Approved: ${approved}`);
    
    const { error, data } = await supabase
      .from('testimonials')
      .update({ approved })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating testimonial approval:', error);
      return false;
    }
    
    console.log('Successfully updated testimonial approval status:', data);
    return true;
  } catch (error) {
    console.error('Exception in updateTestimonialApproval:', error);
    return false;
  }
};

export { getTestimonials, addTestimonial, deleteTestimonial, updateTestimonialApproval };
