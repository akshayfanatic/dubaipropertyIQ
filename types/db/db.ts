/**
 * ⚠️ REFERENCE ONLY - NOT FOR IMPORT
 *
 * Supabase Database Types Reference
 * Generated from Supabase schema - use for quick lookup only
 *
 * For actual types, use the contracts in /types/
 *
 */

// JSON type for nested objects
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ============================================================================
// ENUMS
// ============================================================================

type AppRole = 'admin' | 'agent' | 'customer';
type PropertyStatus = 'available' | 'sold' | 'reserved' | 'off_plan';

// ============================================================================
// TABLE TYPES (Row)
// ============================================================================

interface Amenity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Area {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AreaAmenity {
  amenity_id: string;
  area_id: string;
}

interface AreaFAQ {
  id: string;
  area_id: string;
  question: string;
  answer: string;
  created_at: string | null;
}

interface AreaAmenityFAQ {
  id: string;
  area_id: string;
  question: string;
  answer: string;
  created_at: string | null;
}

interface AreaProperty {
  area_id: string;
  property_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

interface City {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Developer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  website_url: string | null;
  years_active: number | null;
  total_projects: number | null;
  completed_projects: number | null;
  ongoing_projects: number | null;
  build_quality_score: number | null;
  delivery_timeliness_score: number | null;
  after_sales_score: number | null;
  service_charge_score: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price_aed: number;
  size_sqft: number;
  bedrooms: number;
  bathrooms: number;
  category_id: string | null;
  developer_id: string | null;
  photos: Json | null;
  floor_plan: string | null;
  features: string[] | null;
  golden_visa_eligible: boolean | null;
  status: PropertyStatus;
  created_at: string | null;
  updated_at: string | null;
}

interface UserRole {
  id: number;
  user_id: string;
  role: AppRole;
  created_at: string | null;
}

// ============================================================================
// FULL DATABASE TYPE (for Supabase client)
// ============================================================================

interface Database {
  public: {
    Tables: {
      amenities: {
        Row: Amenity;
        Insert: Omit<Amenity, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Amenity, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Amenity>;
        Relationships: [];
      };
      areas: {
        Row: Area;
        Insert: Omit<Area, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Area, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Area>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      areas_amenities: {
        Row: AreaAmenity;
        Insert: AreaAmenity;
        Update: Partial<AreaAmenity>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      areas_amenities_faqs: {
        Row: AreaAmenityFAQ;
        Insert: Omit<AreaAmenityFAQ, 'id' | 'created_at'> & Partial<Pick<AreaAmenityFAQ, 'id' | 'created_at'>>;
        Update: Partial<AreaAmenityFAQ>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      areas_faqs: {
        Row: AreaFAQ;
        Insert: Omit<AreaFAQ, 'id' | 'created_at'> & Partial<Pick<AreaFAQ, 'id' | 'created_at'>>;
        Update: Partial<AreaFAQ>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      areas_properties: {
        Row: AreaProperty;
        Insert: AreaProperty;
        Update: Partial<AreaProperty>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Category, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Category>;
        Relationships: [];
      };
      cities: {
        Row: City;
        Insert: Omit<City, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<City, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<City>;
        Relationships: [];
      };
      developers: {
        Row: Developer;
        Insert: Omit<Developer, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Developer, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Developer>;
        Relationships: [];
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Property, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Property>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, 'id' | 'created_at'> & Partial<Pick<UserRole, 'id' | 'created_at'>>;
        Update: Partial<UserRole>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json };
      has_role: { Args: { required_role: AppRole }; Returns: boolean };
    };
    Enums: {
      app_role: AppRole;
      property_status_enum: PropertyStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
