export type Profile = {
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

export type Level = {
  id: number
  name: string
  description: string | null
  order_number: number
  xp_required: number
  created_at: string
}

export type Kanji = {
  id: number
  level_id: number
  character: string
  meaning: string
  onyomi: string | null
  kunyomi: string | null
  strokes: number | null
  examples: string[] | null
  anime_context: string | null
  created_at: string
}

export type Word = {
  id: number
  level_id: number
  kanji_id: number | null
  word: string
  reading: string
  meaning: string
  examples: string[] | null
  anime_context: string | null
  created_at: string
}

export type Phrase = {
  id: number
  level_id: number
  japanese: string
  reading: string
  meaning: string
  anime_source: string | null
  anime_context: string | null
  created_at: string
}

export type Review = {
  id: number
  user_id: string
  item_type: 'kanji' | 'word' | 'phrase'
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

export type DailyActivity = {
  id: number
  user_id: string
  activity_date: string
  reviews_completed: number
  xp_earned: number
  created_at: string
}

export type ReviewRating = 'error' | 'hard' | 'medium' | 'easy'

export type ReviewItem = Kanji | Word | Phrase