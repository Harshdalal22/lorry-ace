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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      lr_details: {
        Row: {
          actual_weight_mt: number | null
          address_of_delivery: string | null
          agent: string | null
          billing_party: string | null
          billing_to_address: string | null
          billing_to_city: string | null
          billing_to_contact: string | null
          billing_to_gst: string | null
          billing_to_name: string | null
          billing_to_pan: string | null
          charged_weight: number | null
          consignee_address: string | null
          consignee_city: string | null
          consignee_contact: string | null
          consignee_gst: string | null
          consignee_name: string | null
          consignee_pan: string | null
          consignor_address: string | null
          consignor_city: string | null
          consignor_contact: string | null
          consignor_gst: string | null
          consignor_name: string | null
          consignor_pan: string | null
          created_at: string
          created_by: string | null
          custom_logo_url: string | null
          date: string
          employee: string | null
          eway_bill_date: string | null
          eway_bill_no: string | null
          eway_ex_date: string | null
          extra_height: number | null
          freight: number | null
          from_place: string
          gst_paid_by: string | null
          height: number | null
          id: string
          invoice: string | null
          invoice_amount: number | null
          invoice_date: string | null
          items: Json | null
          lorry_type: string | null
          lr_no: string
          lr_type: string
          method_of_packing: string | null
          po_date: string | null
          po_no: string | null
          rate: number | null
          rate_on: string | null
          remark: string | null
          template_design: string | null
          to_place: string
          truck_driver_no: string | null
          truck_no: string
          updated_at: string
          weight_mt: number | null
        }
        Insert: {
          actual_weight_mt?: number | null
          address_of_delivery?: string | null
          agent?: string | null
          billing_party?: string | null
          billing_to_address?: string | null
          billing_to_city?: string | null
          billing_to_contact?: string | null
          billing_to_gst?: string | null
          billing_to_name?: string | null
          billing_to_pan?: string | null
          charged_weight?: number | null
          consignee_address?: string | null
          consignee_city?: string | null
          consignee_contact?: string | null
          consignee_gst?: string | null
          consignee_name?: string | null
          consignee_pan?: string | null
          consignor_address?: string | null
          consignor_city?: string | null
          consignor_contact?: string | null
          consignor_gst?: string | null
          consignor_name?: string | null
          consignor_pan?: string | null
          created_at?: string
          created_by?: string | null
          custom_logo_url?: string | null
          date: string
          employee?: string | null
          eway_bill_date?: string | null
          eway_bill_no?: string | null
          eway_ex_date?: string | null
          extra_height?: number | null
          freight?: number | null
          from_place: string
          gst_paid_by?: string | null
          height?: number | null
          id?: string
          invoice?: string | null
          invoice_amount?: number | null
          invoice_date?: string | null
          items?: Json | null
          lorry_type?: string | null
          lr_no: string
          lr_type: string
          method_of_packing?: string | null
          po_date?: string | null
          po_no?: string | null
          rate?: number | null
          rate_on?: string | null
          remark?: string | null
          template_design?: string | null
          to_place: string
          truck_driver_no?: string | null
          truck_no: string
          updated_at?: string
          weight_mt?: number | null
        }
        Update: {
          actual_weight_mt?: number | null
          address_of_delivery?: string | null
          agent?: string | null
          billing_party?: string | null
          billing_to_address?: string | null
          billing_to_city?: string | null
          billing_to_contact?: string | null
          billing_to_gst?: string | null
          billing_to_name?: string | null
          billing_to_pan?: string | null
          charged_weight?: number | null
          consignee_address?: string | null
          consignee_city?: string | null
          consignee_contact?: string | null
          consignee_gst?: string | null
          consignee_name?: string | null
          consignee_pan?: string | null
          consignor_address?: string | null
          consignor_city?: string | null
          consignor_contact?: string | null
          consignor_gst?: string | null
          consignor_name?: string | null
          consignor_pan?: string | null
          created_at?: string
          created_by?: string | null
          custom_logo_url?: string | null
          date?: string
          employee?: string | null
          eway_bill_date?: string | null
          eway_bill_no?: string | null
          eway_ex_date?: string | null
          extra_height?: number | null
          freight?: number | null
          from_place?: string
          gst_paid_by?: string | null
          height?: number | null
          id?: string
          invoice?: string | null
          invoice_amount?: number | null
          invoice_date?: string | null
          items?: Json | null
          lorry_type?: string | null
          lr_no?: string
          lr_type?: string
          method_of_packing?: string | null
          po_date?: string | null
          po_no?: string | null
          rate?: number | null
          rate_on?: string | null
          remark?: string | null
          template_design?: string | null
          to_place?: string
          truck_driver_no?: string | null
          truck_no?: string
          updated_at?: string
          weight_mt?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
