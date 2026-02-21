import { ReviewRating } from '@/lib/database/types'

export interface SRSResult {
  interval: number
  easeFactor: number
  srsLevel: number
}

export class SRSSystem {
  private readonly INITIAL_INTERVAL = 1 // days
  private readonly INITIAL_EASE_FACTOR = 2.5
  private readonly HARD_INTERVAL_FACTOR = 1.2
  private readonly EASY_INTERVAL_FACTOR = 2
  private readonly MEDIUM_INTERVAL_FACTOR = 1.5
  private readonly MINIMUM_EASE_FACTOR = 1.3
  private readonly MAXIMUM_EASE_FACTOR = 3.0

  calculateNextReview(
    currentSRSLevel: number,
    currentInterval: number,
    currentEaseFactor: number,
    rating: ReviewRating
  ): SRSResult {
    let newInterval = currentInterval
    let newEaseFactor = currentEaseFactor
    let newSRSLevel = currentSRSLevel

    switch (rating) {
      case 'error':
        // Reset on error
        newInterval = 4 / 24 // 4 hours in days
        newEaseFactor = Math.max(this.INITIAL_EASE_FACTOR, currentEaseFactor - 0.2)
        newSRSLevel = Math.max(0, currentSRSLevel - 1)
        break

      case 'hard':
        newInterval = currentInterval * this.HARD_INTERVAL_FACTOR
        newEaseFactor = Math.max(this.MINIMUM_EASE_FACTOR, currentEaseFactor - 0.15)
        newSRSLevel = currentSRSLevel + 1
        break

      case 'medium':
        newInterval = currentInterval * this.MEDIUM_INTERVAL_FACTOR
        newEaseFactor = currentEaseFactor
        newSRSLevel = currentSRSLevel + 1
        break

      case 'easy':
        newInterval = currentInterval * this.EASY_INTERVAL_FACTOR * currentEaseFactor
        newEaseFactor = Math.min(this.MAXIMUM_EASE_FACTOR, currentEaseFactor + 0.15)
        newSRSLevel = currentSRSLevel + 1
        break
    }

    // Ensure minimum interval of 4 hours
    if (newInterval < 4 / 24) {
      newInterval = 4 / 24
    }

    // Round to nearest hour for intervals less than a day
    if (newInterval < 1) {
      newInterval = Math.round(newInterval * 24) / 24
    } else {
      newInterval = Math.round(newInterval * 10) / 10
    }

    return {
      interval: newInterval,
      easeFactor: Number(newEaseFactor.toFixed(2)),
      srsLevel: newSRSLevel
    }
  }

  getNextReviewDate(nextReviewAt: Date | null): Date {
    const now = new Date()
    if (!nextReviewAt) {
      return new Date(now.getTime() + 4 * 60 * 60 * 1000) // 4 hours from now
    }
    return new Date(Math.max(now.getTime(), nextReviewAt.getTime()))
  }

  calculateXP(rating: ReviewRating, isFirstReview: boolean = false): number {
    const baseXP = 10
    const firstReviewBonus = 5

    let ratingMultiplier = 1
    switch (rating) {
      case 'error':
        return 0
      case 'hard':
        ratingMultiplier = 0.5
        break
      case 'medium':
        ratingMultiplier = 1
        break
      case 'easy':
        ratingMultiplier = 1.5
        break
    }

    let xp = Math.round(baseXP * ratingMultiplier)
    if (isFirstReview) {
      xp += firstReviewBonus
    }

    return xp
  }

  getNextReviewTimeCategory(nextReviewAt: string): 'now' | 'soon' | 'later' {
    const now = new Date()
    const reviewDate = new Date(nextReviewAt)
    const diffHours = (reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffHours <= 0) return 'now'
    if (diffHours <= 24) return 'soon'
    return 'later'
  }
}

export const srsSystem = new SRSSystem()