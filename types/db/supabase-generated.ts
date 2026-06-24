export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      agent_application_details: {
        Row: {
          agency_name: string | null;
          application_id: string;
          areas_of_focus: string | null;
          broker_id: string | null;
          company_name: string | null;
          created_at: string;
          experience_years: number | null;
          logo_url: Json | null;
          message: string | null;
          rera_number: string;
          updated_at: string;
        };
        Insert: {
          agency_name?: string | null;
          application_id: string;
          areas_of_focus?: string | null;
          broker_id?: string | null;
          company_name?: string | null;
          created_at?: string;
          experience_years?: number | null;
          logo_url?: Json | null;
          message?: string | null;
          rera_number: string;
          updated_at?: string;
        };
        Update: {
          agency_name?: string | null;
          application_id?: string;
          areas_of_focus?: string | null;
          broker_id?: string | null;
          company_name?: string | null;
          created_at?: string;
          experience_years?: number | null;
          logo_url?: Json | null;
          message?: string | null;
          rera_number?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'agent_application_details_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'partner_applications';
            referencedColumns: ['id'];
          },
        ];
      };
      agent_profiles: {
        Row: {
          agency_name: string | null;
          application_id: string | null;
          broker_id: string | null;
          company_name: string | null;
          contact_name: string | null;
          created_at: string;
          email: string;
          id: string;
          logo_url: Json | null;
          phone: string | null;
          rera_number: string;
          status: Database['public']['Enums']['partner_account_status'];
          updated_at: string;
          user_id: string;
          whatsapp: string | null;
        };
        Insert: {
          agency_name?: string | null;
          application_id?: string | null;
          broker_id?: string | null;
          company_name?: string | null;
          contact_name?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          logo_url?: Json | null;
          phone?: string | null;
          rera_number: string;
          status?: Database['public']['Enums']['partner_account_status'];
          updated_at?: string;
          user_id: string;
          whatsapp?: string | null;
        };
        Update: {
          agency_name?: string | null;
          application_id?: string | null;
          broker_id?: string | null;
          company_name?: string | null;
          contact_name?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          logo_url?: Json | null;
          phone?: string | null;
          rera_number?: string;
          status?: Database['public']['Enums']['partner_account_status'];
          updated_at?: string;
          user_id?: string;
          whatsapp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'agent_profiles_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'partner_applications';
            referencedColumns: ['id'];
          },
        ];
      };
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
          location: Json | null;
          name: string;
          photos: Json | null;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          city_id: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          location?: Json | null;
          name: string;
          photos?: Json | null;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          city_id?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          location?: Json | null;
          name?: string;
          photos?: Json | null;
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
      areas_seo: {
        Row: {
          area_id: string;
          canonical_url: string | null;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
        };
        Insert: {
          area_id: string;
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          area_id?: string;
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_seo_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: true;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      blog_categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_post_tags: {
        Row: {
          blog_id: string;
          created_at: string;
          tag_id: string;
        };
        Insert: {
          blog_id: string;
          created_at?: string;
          tag_id: string;
        };
        Update: {
          blog_id?: string;
          created_at?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_post_tags_blog_id_fkey';
            columns: ['blog_id'];
            isOneToOne: false;
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_post_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'blog_tags';
            referencedColumns: ['id'];
          },
        ];
      };
      blog_tags: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          category_id: string | null;
          content: Json;
          created_at: string | null;
          excerpt: string | null;
          feature_image_url: Json | null;
          id: string;
          is_published: boolean | null;
          slug: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          category_id?: string | null;
          content?: Json;
          created_at?: string | null;
          excerpt?: string | null;
          feature_image_url?: Json | null;
          id?: string;
          is_published?: boolean | null;
          slug: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          category_id?: string | null;
          content?: Json;
          created_at?: string | null;
          excerpt?: string | null;
          feature_image_url?: Json | null;
          id?: string;
          is_published?: boolean | null;
          slug?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blogs_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'blog_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      blogs_seo: {
        Row: {
          blog_id: string;
          canonical_url: string | null;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
        };
        Insert: {
          blog_id: string;
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          blog_id?: string;
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blogs_seo_blog_id_fkey';
            columns: ['blog_id'];
            isOneToOne: true;
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
        ];
      };
      buildings: {
        Row: {
          address: string | null;
          amenities: Json | null;
          area_avg_price_per_sqft: number | null;
          area_id: string;
          avg_price_per_sqft: number | null;
          building_type: string | null;
          capital_growth_score: number | null;
          city_id: string;
          completion_year: number | null;
          cons: Json | null;
          created_at: string | null;
          demand_level: string | null;
          description: string | null;
          developer_id: string | null;
          id: string;
          lifestyle_score: number | null;
          liquidity_score: number | null;
          location: Json | null;
          name: string;
          nearby_places: Json | null;
          overall_score: number | null;
          ownership_type: string | null;
          photos: Json | null;
          property_types: Json | null;
          pros: Json | null;
          rental_ranges: Json | null;
          rental_yield: number | null;
          service_charge_aed_per_sqft: number | null;
          short_term_rental_potential: string | null;
          slug: string;
          total_floors: number | null;
          total_units: number | null;
          transaction_summary: Json | null;
          unit_price_ranges: Json | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          amenities?: Json | null;
          area_avg_price_per_sqft?: number | null;
          area_id: string;
          avg_price_per_sqft?: number | null;
          building_type?: string | null;
          capital_growth_score?: number | null;
          city_id: string;
          completion_year?: number | null;
          cons?: Json | null;
          created_at?: string | null;
          demand_level?: string | null;
          description?: string | null;
          developer_id?: string | null;
          id?: string;
          lifestyle_score?: number | null;
          liquidity_score?: number | null;
          location?: Json | null;
          name: string;
          nearby_places?: Json | null;
          overall_score?: number | null;
          ownership_type?: string | null;
          photos?: Json | null;
          property_types?: Json | null;
          pros?: Json | null;
          rental_ranges?: Json | null;
          rental_yield?: number | null;
          service_charge_aed_per_sqft?: number | null;
          short_term_rental_potential?: string | null;
          slug: string;
          total_floors?: number | null;
          total_units?: number | null;
          transaction_summary?: Json | null;
          unit_price_ranges?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          amenities?: Json | null;
          area_avg_price_per_sqft?: number | null;
          area_id?: string;
          avg_price_per_sqft?: number | null;
          building_type?: string | null;
          capital_growth_score?: number | null;
          city_id?: string;
          completion_year?: number | null;
          cons?: Json | null;
          created_at?: string | null;
          demand_level?: string | null;
          description?: string | null;
          developer_id?: string | null;
          id?: string;
          lifestyle_score?: number | null;
          liquidity_score?: number | null;
          location?: Json | null;
          name?: string;
          nearby_places?: Json | null;
          overall_score?: number | null;
          ownership_type?: string | null;
          photos?: Json | null;
          property_types?: Json | null;
          pros?: Json | null;
          rental_ranges?: Json | null;
          rental_yield?: number | null;
          service_charge_aed_per_sqft?: number | null;
          short_term_rental_potential?: string | null;
          slug?: string;
          total_floors?: number | null;
          total_units?: number | null;
          transaction_summary?: Json | null;
          unit_price_ranges?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'buildings_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'buildings_city_id_fkey';
            columns: ['city_id'];
            isOneToOne: false;
            referencedRelation: 'cities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'buildings_developer_id_fkey';
            columns: ['developer_id'];
            isOneToOne: false;
            referencedRelation: 'developers';
            referencedColumns: ['id'];
          },
        ];
      };
      buildings_seo: {
        Row: {
          building_id: string;
          canonical_url: string | null;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
        };
        Insert: {
          building_id: string;
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          building_id?: string;
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'buildings_seo_building_id_fkey';
            columns: ['building_id'];
            isOneToOne: true;
            referencedRelation: 'buildings';
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
      cities_seo: {
        Row: {
          canonical_url: string | null;
          city_id: string;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
        };
        Insert: {
          canonical_url?: string | null;
          city_id: string;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          canonical_url?: string | null;
          city_id?: string;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cities_seo_city_id_fkey';
            columns: ['city_id'];
            isOneToOne: true;
            referencedRelation: 'cities';
            referencedColumns: ['id'];
          },
        ];
      };
      customer_saved_properties: {
        Row: {
          created_at: string;
          id: string;
          property_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          property_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          property_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'customer_saved_properties_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      developer_accounts: {
        Row: {
          application_id: string | null;
          authorized_contact_name: string | null;
          company_name: string;
          created_at: string;
          developer_id: string | null;
          email: string;
          id: string;
          logo_url: Json | null;
          phone: string | null;
          status: Database['public']['Enums']['partner_account_status'];
          trade_license_number: string | null;
          updated_at: string;
          user_id: string;
          website_url: string | null;
        };
        Insert: {
          application_id?: string | null;
          authorized_contact_name?: string | null;
          company_name: string;
          created_at?: string;
          developer_id?: string | null;
          email: string;
          id?: string;
          logo_url?: Json | null;
          phone?: string | null;
          status?: Database['public']['Enums']['partner_account_status'];
          trade_license_number?: string | null;
          updated_at?: string;
          user_id: string;
          website_url?: string | null;
        };
        Update: {
          application_id?: string | null;
          authorized_contact_name?: string | null;
          company_name?: string;
          created_at?: string;
          developer_id?: string | null;
          email?: string;
          id?: string;
          logo_url?: Json | null;
          phone?: string | null;
          status?: Database['public']['Enums']['partner_account_status'];
          trade_license_number?: string | null;
          updated_at?: string;
          user_id?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'developer_accounts_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'partner_applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'developer_accounts_developer_id_fkey';
            columns: ['developer_id'];
            isOneToOne: false;
            referencedRelation: 'developers';
            referencedColumns: ['id'];
          },
        ];
      };
      developer_application_details: {
        Row: {
          active_project_details: string | null;
          application_id: string;
          authorized_contact_name: string | null;
          bulk_upload_required: boolean;
          company_name: string;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          logo_url: Json | null;
          message: string | null;
          trade_license_number: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          active_project_details?: string | null;
          application_id: string;
          authorized_contact_name?: string | null;
          bulk_upload_required?: boolean;
          company_name: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          logo_url?: Json | null;
          message?: string | null;
          trade_license_number?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          active_project_details?: string | null;
          application_id?: string;
          authorized_contact_name?: string | null;
          bulk_upload_required?: boolean;
          company_name?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          logo_url?: Json | null;
          message?: string | null;
          trade_license_number?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'developer_application_details_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'partner_applications';
            referencedColumns: ['id'];
          },
        ];
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
      developers_seo: {
        Row: {
          canonical_url: string | null;
          developer_id: string;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
        };
        Insert: {
          canonical_url?: string | null;
          developer_id: string;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          canonical_url?: string | null;
          developer_id?: string;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'developers_seo_developer_id_fkey';
            columns: ['developer_id'];
            isOneToOne: true;
            referencedRelation: 'developers';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          area_of_interest: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string | null;
          name: string;
          nationality: string | null;
          phone: string | null;
          source_page: string;
          source_type: string;
          status: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          area_of_interest?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message?: string | null;
          name: string;
          nationality?: string | null;
          phone?: string | null;
          source_page: string;
          source_type: string;
          status?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          area_of_interest?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string | null;
          name?: string;
          nationality?: string | null;
          phone?: string | null;
          source_page?: string;
          source_type?: string;
          status?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          content: Json;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          is_published: boolean | null;
          slug: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content?: Json;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean | null;
          slug: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: Json;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean | null;
          slug?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      pages_seo: {
        Row: {
          canonical_url: string | null;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
          page_id: string;
        };
        Insert: {
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          page_id: string;
        };
        Update: {
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          page_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pages_seo_page_id_fkey';
            columns: ['page_id'];
            isOneToOne: true;
            referencedRelation: 'pages';
            referencedColumns: ['id'];
          },
        ];
      };
      partner_applications: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: Database['public']['Enums']['partner_application_status'];
          target_role: Database['public']['Enums']['app_role'];
          updated_at: string;
          user_id: string;
          whatsapp: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          phone?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: Database['public']['Enums']['partner_application_status'];
          target_role: Database['public']['Enums']['app_role'];
          updated_at?: string;
          user_id: string;
          whatsapp?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: Database['public']['Enums']['partner_application_status'];
          target_role?: Database['public']['Enums']['app_role'];
          updated_at?: string;
          user_id?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          bathrooms: number;
          bedrooms: number;
          category_id: string | null;
          city_id: string | null;
          created_at: string | null;
          description: string;
          developer_id: string | null;
          features: string[] | null;
          floor_plan: string | null;
          golden_visa_eligible: boolean | null;
          id: string;
          is_featured: boolean;
          location: Json | null;
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
          city_id?: string | null;
          created_at?: string | null;
          description?: string;
          developer_id?: string | null;
          features?: string[] | null;
          floor_plan?: string | null;
          golden_visa_eligible?: boolean | null;
          id?: string;
          is_featured?: boolean;
          location?: Json | null;
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
          city_id?: string | null;
          created_at?: string | null;
          description?: string;
          developer_id?: string | null;
          features?: string[] | null;
          floor_plan?: string | null;
          golden_visa_eligible?: boolean | null;
          id?: string;
          is_featured?: boolean;
          location?: Json | null;
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
            foreignKeyName: 'properties_city_id_fkey';
            columns: ['city_id'];
            isOneToOne: false;
            referencedRelation: 'cities';
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
      properties_amenities: {
        Row: {
          amenity_id: string;
          created_at: string | null;
          id: string;
          property_id: string;
        };
        Insert: {
          amenity_id: string;
          created_at?: string | null;
          id?: string;
          property_id: string;
        };
        Update: {
          amenity_id?: string;
          created_at?: string | null;
          id?: string;
          property_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'properties_amenities_amenity_id_fkey';
            columns: ['amenity_id'];
            isOneToOne: false;
            referencedRelation: 'amenities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'properties_amenities_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      properties_faqs: {
        Row: {
          answer: string;
          created_at: string | null;
          id: string;
          property_id: string;
          question: string;
        };
        Insert: {
          answer: string;
          created_at?: string | null;
          id?: string;
          property_id: string;
          question: string;
        };
        Update: {
          answer?: string;
          created_at?: string | null;
          id?: string;
          property_id?: string;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'properties_faqs_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      properties_seo: {
        Row: {
          canonical_url: string | null;
          id: string;
          keywords: string | null;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
          property_id: string;
        };
        Insert: {
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          property_id: string;
        };
        Update: {
          canonical_url?: string | null;
          id?: string;
          keywords?: string | null;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          property_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'properties_seo_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: true;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      site_settings: {
        Row: {
          group: string;
          id: string;
          key: string;
          label: string;
          type: string;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          group: string;
          id?: string;
          key: string;
          label: string;
          type: string;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          group?: string;
          id?: string;
          key?: string;
          label?: string;
          type?: string;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
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
      get_user_count: { Args: never; Returns: number };
      has_role: {
        Args: { required_role: Database['public']['Enums']['app_role'] };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'admin' | 'agent' | 'customer' | 'developer';
      partner_account_status: 'pending' | 'active' | 'suspended' | 'rejected';
      partner_application_status: 'pending' | 'reviewing' | 'approved' | 'rejected';
      property_status_enum: 'available' | 'sold' | 'reserved' | 'off_plan' | 'draft';
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
  public: {
    Enums: {
      app_role: ['admin', 'agent', 'customer', 'developer'],
      partner_account_status: ['pending', 'active', 'suspended', 'rejected'],
      partner_application_status: ['pending', 'reviewing', 'approved', 'rejected'],
      property_status_enum: ['available', 'sold', 'reserved', 'off_plan', 'draft'],
    },
  },
} as const;
