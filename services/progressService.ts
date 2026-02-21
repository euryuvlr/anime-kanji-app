import { createClient } from '@/lib/supabase/client'
import { Profile, Level } from '@/lib/database/types'

export class ProgressService {
  private supabase = createClient()

  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data
  }

  async getCurrentLevel(userId: string): Promise<{ level: Level; progress: number } | null> {
    const profile = await this.getUserProfile(userId)
    if (!profile) return null

    // Get current level
    const { data: currentLevel, error: levelError } = await this.supabase
      .from('levels')
      .select('*')
      .eq('id', profile.level_id)
      .single()

    if (levelError || !currentLevel) return null

    // Get next level
    const { data: nextLevel, error: nextError } = await this.supabase
      .from('levels')
      .select('xp_required')
      .eq('order_number', currentLevel.order_number + 1)
      .single()

    if (nextError || !nextLevel) {
      // Max level reached
      return {
        level: currentLevel,
        progress: 100
      }
    }

    // Calculate progress to next level
    const xpInCurrentLevel = profile.xp - currentLevel.xp_required
    const xpNeededForNext = nextLevel.xp_required - currentLevel.xp_required
    const progress = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))

    return {
      level: currentLevel,
      progress
    }
  }

  async getPendingReviewsCount(userId: string): Promise<number> {
    const now = new Date().toISOString()
    
    const { count, error } = await this.supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('next_review_at', now)

    if (error) return 0
    return count || 0
  }

  async getStats(userId: string): Promise<{
    totalReviews: number
    totalCorrect: number
    accuracy: number
    streakDays: number
    totalXP: number
  }> {
    // Get review stats
    const { data: reviews, error: reviewError } = await this.supabase
      .from('reviews')
      .select('review_count, correct_count')
      .eq('user_id', userId)

    if (reviewError) throw reviewError

    const totalReviews = reviews?.reduce((sum, r) => sum + r.review_count, 0) || 0
    const totalCorrect = reviews?.reduce((sum, r) => sum + r.correct_count, 0) || 0
    const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

    // Get profile for streak and XP
    const profile = await this.getUserProfile(userId)

    return {
      totalReviews,
      totalCorrect,
      accuracy,
      streakDays: profile?.streak_days || 0,
      totalXP: profile?.xp || 0
    }
  }

  async getRecentActivity(userId: string, days: number = 7): Promise<any[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await this.supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: false })

    if (error) return []
    return data || []
  }
}

export const progressService = new ProgressService()