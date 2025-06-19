export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Card: {
        Row: {
          birthday_date: string
          birthday_person: string
          descriptive_title: string | null
          id: string
          one_good_friend_id: string
          single_word_traits: string[] | null
          sourced_summary: Json | null
          text_summary: string | null
        }
        Insert: {
          birthday_date?: string
          birthday_person: string
          descriptive_title?: string | null
          id?: string
          one_good_friend_id?: string
          single_word_traits?: string[] | null
          sourced_summary?: Json | null
          text_summary?: string | null
        }
        Update: {
          birthday_date?: string
          birthday_person?: string
          descriptive_title?: string | null
          id?: string
          one_good_friend_id?: string
          single_word_traits?: string[] | null
          sourced_summary?: Json | null
          text_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Card_one_good_friend_id_fkey"
            columns: ["one_good_friend_id"]
            isOneToOne: false
            referencedRelation: "Good_Friend"
            referencedColumns: ["id"]
          },
        ]
      }
      Card_Form_Response: {
        Row: {
          card_id: string | null
          created_at: string
          description_response: string | null
          final_message_response: string | null
          id: string
          image_url: string | null
          image_urls: string[]
          memory_response: string | null
          responder_name: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          description_response?: string | null
          final_message_response?: string | null
          id: string
          image_url?: string | null
          image_urls?: string[]
          memory_response?: string | null
          responder_name?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string
          description_response?: string | null
          final_message_response?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[]
          memory_response?: string | null
          responder_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Card_Form_Response_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "Card"
            referencedColumns: ["id"]
          },
        ]
      }
      Friends_To_Notify: {
        Row: {
          card_id: string
          email: string | null
          id: string
        }
        Insert: {
          card_id?: string
          email?: string | null
          id?: string
        }
        Update: {
          card_id?: string
          email?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Friends_To_Notify_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "Card"
            referencedColumns: ["id"]
          },
        ]
      }
      Good_Friend: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      Waitlist: {
        Row: {
          email: string
          id: number
          submitted_at: string
        }
        Insert: {
          email: string
          id?: number
          submitted_at?: string
        }
        Update: {
          email?: string
          id?: number
          submitted_at?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
