export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          logo_url: string | null
          max_leads: number | null
          max_visits: number | null
          name: string
          plan: string | null
          primary_domain: string | null
          slug: string
          updated_at: string | null
          webhook_secret: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          logo_url?: string | null
          max_leads?: number | null
          max_visits?: number | null
          name: string
          plan?: string | null
          primary_domain?: string | null
          slug: string
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          logo_url?: string | null
          max_leads?: number | null
          max_visits?: number | null
          name?: string
          plan?: string | null
          primary_domain?: string | null
          slug?: string
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          company_id: number
          created_at: string | null
          element_class: string | null
          element_href: string | null
          element_id: string | null
          element_text: string | null
          event_datetime: string
          event_name: string | null
          event_timestamp: number
          event_type: string
          event_value: string | null
          id: number
          lead_id: number
          metadata: Json | null
          page_path: string | null
          page_url: string | null
          scroll_position: number | null
          visit_id: number | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          element_class?: string | null
          element_href?: string | null
          element_id?: string | null
          element_text?: string | null
          event_datetime: string
          event_name?: string | null
          event_timestamp: number
          event_type: string
          event_value?: string | null
          id?: number
          lead_id: number
          metadata?: Json | null
          page_path?: string | null
          page_url?: string | null
          scroll_position?: number | null
          visit_id?: number | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          element_class?: string | null
          element_href?: string | null
          element_id?: string | null
          element_text?: string | null
          event_datetime?: string
          event_name?: string | null
          event_timestamp?: number
          event_type?: string
          event_value?: string | null
          id?: number
          lead_id?: number
          metadata?: Json | null
          page_path?: string | null
          page_url?: string | null
          scroll_position?: number | null
          visit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_lead_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_id: number
          created_at: string | null
          customer_since: string | null
          email: string | null
          external_user_id: string
          first_city: string | null
          first_country: string | null
          first_ip_address: string | null
          first_page: string | null
          first_referrer: string | null
          first_state: string | null
          first_utm_campaign: string | null
          first_utm_content: string | null
          first_utm_medium: string | null
          first_utm_source: string | null
          first_utm_term: string | null
          first_visit_at: string | null
          id: number
          is_customer: boolean | null
          is_identified: boolean | null
          last_city: string | null
          last_country: string | null
          last_ip_address: string | null
          last_page: string | null
          last_referrer: string | null
          last_state: string | null
          last_utm_campaign: string | null
          last_utm_medium: string | null
          last_utm_source: string | null
          last_visit_at: string | null
          name: string | null
          phone: string | null
          total_events: number | null
          total_visits: number | null
          updated_at: string | null
          user_agent: string | null
          whatsapp: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          customer_since?: string | null
          email?: string | null
          external_user_id: string
          first_city?: string | null
          first_country?: string | null
          first_ip_address?: string | null
          first_page?: string | null
          first_referrer?: string | null
          first_state?: string | null
          first_utm_campaign?: string | null
          first_utm_content?: string | null
          first_utm_medium?: string | null
          first_utm_source?: string | null
          first_utm_term?: string | null
          first_visit_at?: string | null
          id?: number
          is_customer?: boolean | null
          is_identified?: boolean | null
          last_city?: string | null
          last_country?: string | null
          last_ip_address?: string | null
          last_page?: string | null
          last_referrer?: string | null
          last_state?: string | null
          last_utm_campaign?: string | null
          last_utm_medium?: string | null
          last_utm_source?: string | null
          last_visit_at?: string | null
          name?: string | null
          phone?: string | null
          total_events?: number | null
          total_visits?: number | null
          updated_at?: string | null
          user_agent?: string | null
          whatsapp?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          customer_since?: string | null
          email?: string | null
          external_user_id?: string
          first_city?: string | null
          first_country?: string | null
          first_ip_address?: string | null
          first_page?: string | null
          first_referrer?: string | null
          first_state?: string | null
          first_utm_campaign?: string | null
          first_utm_content?: string | null
          first_utm_medium?: string | null
          first_utm_source?: string | null
          first_utm_term?: string | null
          first_visit_at?: string | null
          id?: number
          is_customer?: boolean | null
          is_identified?: boolean | null
          last_city?: string | null
          last_country?: string | null
          last_ip_address?: string | null
          last_page?: string | null
          last_referrer?: string | null
          last_state?: string | null
          last_utm_campaign?: string | null
          last_utm_medium?: string | null
          last_utm_source?: string | null
          last_visit_at?: string | null
          name?: string | null
          phone?: string | null
          total_events?: number | null
          total_visits?: number | null
          updated_at?: string | null
          user_agent?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          role: string | null
          user_id: string
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: number
          role?: string | null
          user_id: string
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          city: string | null
          company_id: number
          cookie_domain: string | null
          cookie_page: string | null
          country: string | null
          created_at: string | null
          external_user_id: string
          id: number
          ip_address: string | null
          language: string | null
          lead_id: number
          page_path: string | null
          page_title: string | null
          page_url: string | null
          referrer: string | null
          screen_height: number | null
          screen_width: number | null
          session_id: string | null
          state: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visit_date: string | null
          visit_datetime: string
          visit_timestamp: number
        }
        Insert: {
          city?: string | null
          company_id: number
          cookie_domain?: string | null
          cookie_page?: string | null
          country?: string | null
          created_at?: string | null
          external_user_id: string
          id?: number
          ip_address?: string | null
          language?: string | null
          lead_id: number
          page_path?: string | null
          page_title?: string | null
          page_url?: string | null
          referrer?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id?: string | null
          state?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visit_date?: string | null
          visit_datetime: string
          visit_timestamp: number
        }
        Update: {
          city?: string | null
          company_id?: number
          cookie_domain?: string | null
          cookie_page?: string | null
          country?: string | null
          created_at?: string | null
          external_user_id?: string
          id?: number
          ip_address?: string | null
          language?: string | null
          lead_id?: number
          page_path?: string | null
          page_title?: string | null
          page_url?: string | null
          referrer?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id?: string | null
          state?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visit_date?: string | null
          visit_datetime?: string
          visit_timestamp?: number
        }
        Relationships: [
          {
            foreignKeyName: "visits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_lead_stats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_funnel: {
        Row: {
          company_id: number | null
          overall_conversion_rate: number | null
          total_customers: number | null
          total_engaged: number | null
          total_interested: number | null
          total_leads: number | null
          total_visitors: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      v_geo_analysis: {
        Row: {
          city: string | null
          company_id: number | null
          country: string | null
          state: string | null
          total_customers: number | null
          total_visits: number | null
          unique_leads: number | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      v_lead_stats: {
        Row: {
          cities_visited: number | null
          company_id: number | null
          customer_since: string | null
          days_since_first_visit: number | null
          days_since_last_visit: number | null
          email: string | null
          event_types_count: number | null
          events_count: number | null
          external_user_id: string | null
          first_city: string | null
          first_country: string | null
          first_utm_source: string | null
          first_visit_at: string | null
          id: number | null
          is_customer: boolean | null
          is_identified: boolean | null
          last_city: string | null
          last_country: string | null
          last_event_at: string | null
          last_utm_source: string | null
          last_visit_at: string | null
          name: string | null
          pages_visited: number | null
          total_events: number | null
          total_visits: number | null
          utm_sources_count: number | null
          visits_count: number | null
          whatsapp: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      v_utm_analysis: {
        Row: {
          company_id: number | null
          conversion_rate: number | null
          first_seen: string | null
          last_seen: string | null
          total_customers: number | null
          total_visits: number | null
          unique_leads: number | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_company_ids: { Args: never; Returns: number[] }
      identify_lead: {
        Args: {
          p_company_id: number
          p_email?: string
          p_external_user_id: string
          p_name?: string
          p_phone?: string
          p_whatsapp?: string
        }
        Returns: number
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      upsert_visit: {
        Args: {
          p_city: string
          p_company_id: number
          p_cookie_domain: string
          p_cookie_page: string
          p_country: string
          p_event_type: string
          p_external_user_id: string
          p_ip_address: string
          p_language?: string
          p_page_path: string
          p_page_title: string
          p_page_url: string
          p_referrer: string
          p_screen_height?: number
          p_screen_width?: number
          p_session_id: string
          p_state: string
          p_user_agent: string
          p_utm_campaign: string
          p_utm_content: string
          p_utm_medium: string
          p_utm_source: string
          p_utm_term: string
          p_visit_timestamp: number
        }
        Returns: {
          is_new_lead: boolean
          lead_id: number
          visit_id: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
