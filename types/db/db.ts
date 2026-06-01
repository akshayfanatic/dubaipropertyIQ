/**
 * ⚠️ REFERENCE ONLY - NOT FOR IMPORT
 *
 * Supabase Database Types Reference
 * Generated from Supabase schema - use for quick lookup only
 *
 * For actual types, import from 'types/db/supabase-generated'
 *
 */

// JSON type for nested objects
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ============================================================================
// ENUMS
// ============================================================================

export type AppRole = 'admin' | 'agent' | 'customer';
export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'off_plan';

// ============================================================================
// TABLE TYPES (Row)
// ============================================================================

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Area {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AreaAmenity {
  id: string;
  area_id: string;
  amenity_id: string;
}

export interface AreaFAQ {
  id: string;
  area_id: string;
  question: string;
  answer: string;
  created_at: string | null;
}

export interface AreaAmenityFAQ {
  id: string;
  area_id: string;
  question: string;
  answer: string;
  created_at: string | null;
}

export interface AreaProperty {
  id: string;
  area_id: string;
  property_id: string;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity_id: string;
  created_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Developer {
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

export interface Property {
  id: string;
  slug: string;
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
  is_featured: boolean;
  status: Database['public']['Enums']['property_status_enum'];
  created_at: string | null;
  updated_at: string | null;
}

export interface UserRole {
  id: number;
  user_id: string;
  role: Database['public']['Enums']['app_role'];
  created_at: string | null;
}

// ============================================================================
// RELATIONSHIP TYPES
// ============================================================================

export interface Relationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

// ============================================================================
// FULL DATABASE TYPE (for Supabase client)
// ============================================================================

export interface Database {
  // Allows to automatically instantiate createClient with right options
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      amenities: {
        Row: Amenity;
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: Partial<Amenity>;
        Relationships: [];
      };
      areas: {
        Row: Area;
        Insert: {
          city_id: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          photos?: Json | null;
          slug: string;
          updated_at?: string | null;
        };
        Update: Partial<Area>;
        Relationships: [Relationship];
      };
      areas_amenities: {
        Row: AreaAmenity;
        Insert: {
          amenity_id: string;
          area_id: string;
          id?: string;
        };
        Update: Partial<AreaAmenity>;
        Relationships: [Relationship, Relationship];
      };
      areas_amenities_faqs: {
        Row: AreaAmenityFAQ;
        Insert: {
          answer: string;
          area_id: string;
          created_at?: string | null;
          id?: string;
          question: string;
        };
        Update: Partial<AreaAmenityFAQ>;
        Relationships: [Relationship];
      };
      areas_faqs: {
        Row: AreaFAQ;
        Insert: {
          answer: string;
          area_id: string;
          created_at?: string | null;
          id?: string;
          question: string;
        };
        Update: Partial<AreaFAQ>;
        Relationships: [Relationship];
      };
      areas_properties: {
        Row: AreaProperty;
        Insert: {
          area_id: string;
          id?: string;
          property_id: string;
        };
        Update: Partial<AreaProperty>;
        Relationships: [Relationship, Relationship];
      };
      categories: {
        Row: Category;
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: Partial<Category>;
        Relationships: [];
      };
      cities: {
        Row: City;
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: Partial<City>;
        Relationships: [];
      };
      developers: {
        Row: Developer;
        Insert: {
          after_sales_score?: number | null;
          build_quality_score?: number | null;
          completed_projects?: number | null;
          created_at?: string | null;
          delivery_timeliness_score?: number | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          ongoing_projects?: number | null;
          service_charge_score?: number | null;
          slug: string;
          total_projects?: number | null;
          updated_at?: string | null;
          website_url?: string | null;
          years_active?: number | null;
        };
        Update: Partial<Developer>;
        Relationships: [];
      };
      properties: {
        Row: Property;
        Insert: {
          bathrooms?: number;
          bedrooms?: number;
          category_id?: string | null;
          created_at?: string | null;
          description?: string;
          developer_id?: string | null;
          features?: string[] | null;
          floor_plan?: string | null;
          golden_visa_eligible?: boolean | null;
          id?: string;
          is_featured?: boolean;
          photos?: Json | null;
          price_aed: number;
          size_sqft: number;
          slug: string;
          status?: Database['public']['Enums']['property_status_enum'];
          title: string;
          updated_at?: string | null;
        };
        Update: Partial<Property>;
        Relationships: [Relationship, Relationship];
      };
      properties_amenities: {
        Row: PropertyAmenity;
        Insert: {
          amenity_id: string;
          created_at?: string | null;
          id?: string;
          property_id: string;
        };
        Update: Partial<PropertyAmenity>;
        Relationships: [Relationship, Relationship];
      };
      user_roles: {
        Row: UserRole;
        Insert: {
          created_at?: string | null;
          id?: number;
          role?: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: Partial<UserRole>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json };
      generate_slug: { Args: { text_param: string }; Returns: string };
      has_role: {
        Args: { required_role: Database['public']['Enums']['app_role'] };
        Returns: boolean;
      };
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

// ============================================================================
// UTILITY TYPES (Exported for type inference)
// ============================================================================

export type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

export type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  T extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof DatabaseWithoutInternals },
  TableName extends T extends { schema: keyof DatabaseWithoutInternals } ? keyof (DatabaseWithoutInternals[T['schema']]['Tables'] & DatabaseWithoutInternals[T['schema']]['Views']) : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[T['schema']]['Tables'] & DatabaseWithoutInternals[T['schema']]['Views'])[TableName] extends { Row: infer R }
    ? R
    : never
  : T extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[T] extends { Row: infer R }
      ? R
      : never
    : never;

export type TablesInsert<
  T extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends T extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[T['schema']]['Tables'] : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T['schema']]['Tables'][TableName] extends { Insert: infer I }
    ? I
    : never
  : T extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][T] extends { Insert: infer I }
      ? I
      : never
    : never;

export type TablesUpdate<
  T extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends T extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[T['schema']]['Tables'] : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T['schema']]['Tables'][TableName] extends { Update: infer U }
    ? U
    : never
  : T extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][T] extends { Update: infer U }
      ? U
      : never
    : never;

export type Enums<
  T extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends T extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[T['schema']]['Enums'] : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals } ? DatabaseWithoutInternals[T['schema']]['Enums'][EnumName] : T extends keyof DefaultSchema['Enums'] ? DefaultSchema['Enums'][T] : never;

export type CompositeTypes<
  T extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends T extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[T['schema']]['CompositeTypes'] : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T['schema']]['CompositeTypes'][CompositeTypeName]
  : T extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][T]
    : never;

// ============================================================================
// CONSTANTS
// ============================================================================

export const Constants = {
  graphql_public: {
    Enums: {} as const,
  },
  public: {
    Enums: {
      app_role: ['admin', 'agent', 'customer'] as const,
      property_status_enum: ['available', 'sold', 'reserved', 'off_plan'] as const,
    },
  },
} as const;
