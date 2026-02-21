import { createClient } from '@/lib/supabase/client';
import { Review, ReviewRating, ReviewItem } from '@/lib/database/types';
import { srsSystem } from '@/lib/utils/srs';

export class ReviewService {
  private supabase = createClient();

  async getDueReviews(userId: string): Promise<Review[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_at', now)
      .order('next_review_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getReviewItem(review: Review): Promise<ReviewItem | null> {
    const table = review.item_type === 'kanji' ? 'kanji' :
                  review.item_type === 'word' ? 'words' : 'phrases';

    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .eq('id', review.item_id)
      .single();

    if (error) {
      console.error('Error fetching review item:', error);
      return null;
    }

    return data;
  }

  async submitReview(
    userId: string,
    reviewId: number,
    rating: ReviewRating
  ): Promise<{ xpEarned: number; nextReview: Date }> {
    const { data: review, error: fetchError } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !review) throw new Error('Review not found');

    const srsResult = srsSystem.calculateNextReview(
      review.srs_level,
      review.interval,
      review.ease_factor,
      rating
    );

    const now = new Date();
    const nextReviewAt = new Date(now.getTime() + srsResult.interval * 24 * 60 * 60 * 1000);

    const { error: updateError } = await this.supabase
      .from('reviews')
      .update({
        srs_level: srsResult.srsLevel,
        interval: srsResult.interval,
        ease_factor: srsResult.easeFactor,
        next_review_at: nextReviewAt.toISOString(),
        last_reviewed_at: now.toISOString(),
        review_count: review.review_count + 1,
        correct_count: review.correct_count + (rating !== 'error' ? 1 : 0)
      })
      .eq('id', reviewId);

    if (updateError) throw updateError;

    const isFirstReview = review.review_count === 0;
    const xpEarned = srsSystem.calculateXP(rating, isFirstReview);

    if (xpEarned > 0) {
      await this.addXP(userId, xpEarned, `Review: ${review.item_type}`);
    }

    await this.updateStreak(userId);

    return { xpEarned, nextReview: nextReviewAt };
  }

  async addXP(userId: string, amount: number, reason: string): Promise<void> {
    const { error } = await this.supabase.rpc('add_xp', {
      user_id: userId,
      xp_amount: amount
    });

    if (error) throw error;
  }

  async updateStreak(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayActivity } = await this.supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .single();

    if (!todayActivity) {
      await this.supabase
        .from('daily_activities')
        .insert({
          user_id: userId,
          activity_date: today,
          reviews_completed: 1,
          xp_earned: 0
        });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: yesterdayActivity } = await this.supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_date', yesterdayStr)
        .single();

      const newStreak = yesterdayActivity ? { streak_days: 1 } : { streak_days: 1 };
      
      await this.supabase
        .from('profiles')
        .update(newStreak)
        .eq('id', userId);
    } else {
      await this.supabase
        .from('daily_activities')
        .update({
          reviews_completed: todayActivity.reviews_completed + 1
        })
        .eq('id', todayActivity.id);
    }
  }
}

export const reviewService = new ReviewService();