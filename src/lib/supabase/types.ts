/**
 * Hand-written database types matching supabase/migrations.
 * In Phase 2, regenerate with `supabase gen types typescript` against the live project.
 */

export type VehicleStatus = "available" | "on_order" | "landed";

export type VehicleRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  exterior_color: string;
  interior_color: string;
  mileage: number;
  features: string[];
  status: VehicleStatus;
  customer_price_kobo: number;
  public_arrival_note: string | null;
  created_at: string;
  updated_at: string;
};

export type VehicleFinanceRow = {
  vehicle_id: string;
  purchase_price_kobo: number;
  usa_trucking_cost_kobo: number;
  shipping_cost_kobo: number;
  clearing_cost_kobo: number;
  nigeria_trucking_cost_kobo: number;
  full_tank_cost_kobo: number | null;
  internal_notes: string | null;
  sourcing_contact: string | null;
  created_at: string;
  updated_at: string;
};

export type VehicleImageRow = {
  id: string;
  vehicle_id: string;
  storage_path: string;
  display_order: number;
  is_cover: boolean;
  created_at: string;
};

export type AdminActivityLogRow = {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
};

export type SiteSettingsRow = {
  id: number; // singleton row, always 1
  whatsapp_number: string;
  site_tagline: string;
  default_full_tank_cost_kobo: number;
  updated_at: string;
};

export type AdminUserRow = {
  user_id: string;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: VehicleRow;
        Insert: Partial<VehicleRow>;
        Update: Partial<VehicleRow>;
        Relationships: [];
      };
      vehicle_finances: {
        Row: VehicleFinanceRow;
        Insert: Partial<VehicleFinanceRow>;
        Update: Partial<VehicleFinanceRow>;
        Relationships: [];
      };
      vehicle_images: {
        Row: VehicleImageRow;
        Insert: Partial<VehicleImageRow>;
        Update: Partial<VehicleImageRow>;
        Relationships: [];
      };
      admin_activity_logs: {
        Row: AdminActivityLogRow;
        Insert: Partial<AdminActivityLogRow>;
        Update: Partial<AdminActivityLogRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow>;
        Update: Partial<SiteSettingsRow>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: Partial<AdminUserRow>;
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
