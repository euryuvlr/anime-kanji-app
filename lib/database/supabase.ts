export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          xp: number
          level_id: number
          streak_days: number
          last_review_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          xp?: number
          level_id?: number
          streak_days?: number
          last_review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          xp?: number
          level_id?: number
          streak_days?: number
          last_review_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          user_id: string
          item_type: string
          item_id: number
          srs_level: number
          interval: number
          ease_factor: number
          next_review_at: string
          last_reviewed_at: string | null
          review_count: number
          correct_count: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          item_type: string
          item_id: number
          srs_level?: number
          interval?: number
          ease_factor?: number
          next_review_at: string
          last_reviewed_at?: string | null
          review_count?: number
          correct_count?: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          item_type?: string
          item_id?: number
          srs_level?: number
          interval?: number
          ease_factor?: number
          next_review_at?: string
          last_reviewed_at?: string | null
          review_count?: number
          correct_count?: number
          created_at?: string
        }
      }
    }
  }
}