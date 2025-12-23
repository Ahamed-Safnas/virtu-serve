import { supabase } from './supabase';
import { Service, ContactInfo, VisitorData, Testimonial } from '../types';

export const supabaseOperations = {
  async fetchServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
    }));
  },

  async updateServices(services: Service[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error deleting services:', deleteError);
      throw new Error('Failed to update services');
    }

    const { error: insertError } = await supabase
      .from('services')
      .insert(services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        category: service.category,
      })));

    if (insertError) {
      console.error('Error inserting services:', insertError);
      throw new Error('Failed to update services');
    }
  },

  async fetchTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      throw new Error('Failed to fetch testimonials');
    }

    return data.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      designation: testimonial.designation,
      rating: testimonial.rating,
      comment: testimonial.comment,
      avatar: testimonial.avatar,
      dateAdded: testimonial.date_added,
    }));
  },

  async updateTestimonials(testimonials: Testimonial[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('testimonials')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error deleting testimonials:', deleteError);
      throw new Error('Failed to update testimonials');
    }

    const { error: insertError } = await supabase
      .from('testimonials')
      .insert(testimonials.map(testimonial => ({
        id: testimonial.id,
        name: testimonial.name,
        designation: testimonial.designation,
        rating: testimonial.rating,
        comment: testimonial.comment,
        avatar: testimonial.avatar,
        date_added: testimonial.dateAdded,
      })));

    if (insertError) {
      console.error('Error inserting testimonials:', insertError);
      throw new Error('Failed to update testimonials');
    }
  },

  async fetchContactInfo(): Promise<ContactInfo | null> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contact info:', error);
      throw new Error('Failed to fetch contact info');
    }

    if (!data) {
      return null;
    }

    return {
      phone: data.phone,
      email: data.email,
      address: data.address,
      businessHours: data.business_hours,
      socialMedia: data.social_media,
    };
  },

  async updateContactInfo(contactInfo: ContactInfo): Promise<void> {
    const existing = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing.data) {
      const { error } = await supabase
        .from('contact_info')
        .update({
          phone: contactInfo.phone,
          email: contactInfo.email,
          address: contactInfo.address,
          business_hours: contactInfo.businessHours,
          social_media: contactInfo.socialMedia,
        })
        .eq('id', existing.data.id);

      if (error) {
        console.error('Error updating contact info:', error);
        throw new Error('Failed to update contact info');
      }
    } else {
      const { error } = await supabase
        .from('contact_info')
        .insert({
          phone: contactInfo.phone,
          email: contactInfo.email,
          address: contactInfo.address,
          business_hours: contactInfo.businessHours,
          social_media: contactInfo.socialMedia,
        });

      if (error) {
        console.error('Error creating contact info:', error);
        throw new Error('Failed to create contact info');
      }
    }
  },

  async fetchVisitorStats(): Promise<VisitorData[]> {
    const { data, error } = await supabase
      .from('visitor_stats')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching visitor stats:', error);
      throw new Error('Failed to fetch visitor stats');
    }

    return data.map(stat => ({
      date: stat.date,
      visitors: stat.visitors,
    }));
  },

  async recordVisit(date: string): Promise<void> {
    const { data: existing } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('visitor_stats')
        .update({ visitors: existing.visitors + 1 })
        .eq('date', date);

      if (error) {
        console.error('Error updating visitor stats:', error);
        throw new Error('Failed to record visit');
      }
    } else {
      const { error } = await supabase
        .from('visitor_stats')
        .insert({ date, visitors: 1 });

      if (error) {
        console.error('Error inserting visitor stats:', error);
        throw new Error('Failed to record visit');
      }
    }
  },

  async authenticateAdmin(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return false;
    }
  },
};
