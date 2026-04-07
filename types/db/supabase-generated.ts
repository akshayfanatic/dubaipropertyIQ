export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          logo_url: Json | null;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      areas: {
        Row: {
          city_id: string;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          photos: string[] | null;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          city_id: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          photos?: string[] | null;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          city_id?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          photos?: string[] | null;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_city_id_fkey';
            columns: ['city_id'];
            isOneToOne: false;
            referencedRelation: 'cities';
            referencedColumns: ['id'];
          },
        ];
      };
      areas_amenities: {
        Row: {
          amenity_id: string;
          area_id: string;
          id: string;
        };
        Insert: {
          amenity_id: string;
          area_id: string;
          id?: string;
        };
        Update: {
          amenity_id?: string;
          area_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_amenities_amenity_id_fkey';
            columns: ['amenity_id'];
            isOneToOne: false;
            referencedRelation: 'amenities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'areas_amenities_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      areas_amenities_faqs: {
        Row: {
          answer: string;
          area_id: string;
          created_at: string | null;
          id: string;
          question: string;
        };
        Insert: {
          answer: string;
          area_id: string;
          created_at?: string | null;
          id?: string;
          question: string;
        };
        Update: {
          answer?: string;
          area_id?: string;
          created_at?: string | null;
          id?: string;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_amenities_faqs_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      areas_faqs: {
        Row: {
          answer: string;
          area_id: string;
          created_at: string | null;
          id: string;
          question: string;
        };
        Insert: {
          answer: string;
          area_id: string;
          created_at?: string | null;
          id?: string;
          question: string;
        };
        Update: {
          answer?: string;
          area_id?: string;
          created_at?: string | null;
          id?: string;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_faqs_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      areas_properties: {
        Row: {
          area_id: string;
          id: string;
          property_id: string;
        };
        Insert: {
          area_id: string;
          id?: string;
          property_id: string;
        };
        Update: {
          area_id?: string;
          id?: string;
          property_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_properties_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'areas_properties_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          logo_url: Json | null;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          logo_url: Json | null;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      developers: {
        Row: {
          after_sales_score: number | null;
          build_quality_score: number | null;
          completed_projects: number | null;
          created_at: string | null;
          delivery_timeliness_score: number | null;
          description: string | null;
          id: string;
          logo_url: Json | null;
          name: string;
          ongoing_projects: number | null;
          service_charge_score: number | null;
          slug: string;
          total_projects: number | null;
          updated_at: string | null;
          website_url: string | null;
          years_active: number | null;
        };
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
        Update: {
          after_sales_score?: number | null;
          build_quality_score?: number | null;
          completed_projects?: number | null;
          created_at?: string | null;
          delivery_timeliness_score?: number | null;
          description?: string | null;
          id?: string;
          logo_url?: Json | null;
          name?: string;
          ongoing_projects?: number | null;
          service_charge_score?: number | null;
          slug?: string;
          total_projects?: number | null;
          updated_at?: string | null;
          website_url?: string | null;
          years_active?: number | null;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          bathrooms: number;
          bedrooms: number;
          category_id: string | null;
          created_at: string | null;
          description: string;
          developer_id: string | null;
          features: string[] | null;
          floor_plan: string | null;
          golden_visa_eligible: boolean | null;
          id: string;
          photos: Json | null;
          price_aed: number;
          size_sqft: number;
          slug: string;
          status: Database['public']['Enums']['property_status_enum'];
          title: string;
          updated_at: string | null;
        };
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
          photos?: Json | null;
          price_aed: number;
          size_sqft: number;
          slug: string;
          status?: Database['public']['Enums']['property_status_enum'];
          title: string;
          updated_at?: string | null;
        };
        Update: {
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
          photos?: Json | null;
          price_aed?: number;
          size_sqft?: number;
          slug?: string;
          status?: Database['public']['Enums']['property_status_enum'];
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'properties_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'properties_developer_id_fkey';
            columns: ['developer_id'];
            isOneToOne: false;
            referencedRelation: 'developers';
            referencedColumns: ['id'];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: number;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          role?: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
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
      app_role: 'admin' | 'agent' | 'customer';
      property_status_enum: 'available' | 'sold' | 'reserved' | 'off_plan';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ['admin', 'agent', 'customer'],
      property_status_enum: ['available', 'sold', 'reserved', 'off_plan'],
    },
  },
} as const;
