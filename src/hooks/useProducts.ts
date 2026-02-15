import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  imageUrl: string | null;
  images: string[];
  categoryId: string | null;
  stock: number;
  weight: string | null;
  burnTime: string | null;
  scentNotes: string[] | null;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  slug: string;
}

function mapProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    originalPrice: data.original_price ? Number(data.original_price) : null,
    imageUrl: data.image_url,
    images: data.images || [],
    categoryId: data.category_id,
    stock: data.stock,
    weight: data.weight,
    burnTime: data.burn_time,
    scentNotes: data.scent_notes,
    slug: data.slug,
    isActive: data.is_active,
    isFeatured: data.is_featured,
    createdAt: data.created_at,
    category: data.categories ? {
      id: data.categories.id,
      name: data.categories.name,
      slug: data.categories.slug,
    } : undefined,
  };
}

export function useProducts(options?: { featured?: boolean; categorySlug?: string; limit?: number }) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true);

      if (options?.featured) {
        query = query.eq('is_featured', true);
      }

      if (options?.categorySlug) {
        query = query.eq('categories.slug', options.categorySlug);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(mapProduct);
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapProduct(data);
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      return (data || []).map((cat): Category => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        imageUrl: cat.image_url,
        slug: cat.slug,
      }));
    },
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        imageUrl: data.image_url,
        slug: data.slug,
      } as Category;
    },
    enabled: !!slug,
  });
}
