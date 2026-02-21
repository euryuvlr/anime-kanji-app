import { useState, useEffect } from 'react';
import { reviewService } from '@/services/reviewService';
import { Review, ReviewItem, ReviewRating } from '@/lib/database/types';
import { useAuth } from './useAuth';

export const useReviews = () => {
  const [dueReviews, setDueReviews] = useState<Review[]>([]);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [currentItem, setCurrentItem] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const loadDueReviews = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const reviews = await reviewService.getDueReviews(user.id);
      setDueReviews(reviews);
      
      if (reviews.length > 0 && !currentReview) {
        await loadReviewItem(reviews[0]);
      }
    } catch (error) {
      console.error('Error loading due reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviewItem = async (review: Review) => {
    setCurrentReview(review);
    const item = await reviewService.getReviewItem(review);
    setCurrentItem(item);
  };

  const submitReview = async (rating: ReviewRating) => {
    if (!user || !currentReview) return;

    setSubmitting(true);
    try {
      const result = await reviewService.submitReview(
        user.id,
        currentReview.id,
        rating
      );

      const remainingReviews = dueReviews.filter(r => r.id !== currentReview.id);
      setDueReviews(remainingReviews);

      if (remainingReviews.length > 0) {
        await loadReviewItem(remainingReviews[0]);
      } else {
        setCurrentReview(null);
        setCurrentItem(null);
      }

      return result;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadDueReviews();
  }, [user]);

  return {
    dueReviews,
    currentReview,
    currentItem,
    loading,
    submitting,
    submitReview,
    refresh: loadDueReviews
  };
};