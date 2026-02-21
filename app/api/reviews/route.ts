import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('id')
    const action = searchParams.get('action')

    // Get due reviews
    if (!action) {
      const { data: reviews, error } = await (supabase
        .from('reviews') as any)
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true })

      if (error) throw error
      return NextResponse.json({ reviews: reviews || [] })
    }

    // Submit review
    if (action === 'submit' && reviewId) {
      const body = await request.json()
      const { rating } = body
      
      const { data: review, error: fetchError } = await (supabase
        .from('reviews') as any)
        .select('*')
        .eq('id', parseInt(reviewId))
        .eq('user_id', user.id)
        .single()

      if (fetchError || !review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }

      // Calculate next review
      const now = new Date()
      let interval = 1
      let easeFactor = 2.5
      let srsLevel = 1

      switch (rating) {
        case 'error':
          interval = 0.17 // 4 hours in days
          easeFactor = 2.3
          srsLevel = 0
          break
        case 'hard':
          interval = (review.interval || 1) * 1.2
          easeFactor = Math.max(1.3, (review.ease_factor || 2.5) - 0.15)
          srsLevel = (review.srs_level || 0) + 1
          break
        case 'medium':
          interval = (review.interval || 1) * 1.5
          easeFactor = review.ease_factor || 2.5
          srsLevel = (review.srs_level || 0) + 1
          break
        case 'easy':
          interval = (review.interval || 1) * 2 * (review.ease_factor || 2.5)
          easeFactor = Math.min(3.0, (review.ease_factor || 2.5) + 0.15)
          srsLevel = (review.srs_level || 0) + 1
          break
      }

      const nextReviewAt = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)

      // Update review - usando any em toda a chamada
      const { error: updateError } = await (supabase
        .from('reviews') as any)
        .update({
          srs_level: srsLevel,
          interval: Math.round(interval * 10) / 10,
          ease_factor: Math.round(easeFactor * 100) / 100,
          next_review_at: nextReviewAt.toISOString(),
          last_reviewed_at: now.toISOString(),
          review_count: (review.review_count || 0) + 1,
          correct_count: (review.correct_count || 0) + (rating !== 'error' ? 1 : 0)
        })
        .eq('id', review.id)

      if (updateError) throw updateError

      // Add XP
      let xpEarned = 0
      if (rating !== 'error') {
        xpEarned = rating === 'easy' ? 15 : rating === 'medium' ? 10 : 5
        if ((review.review_count || 0) === 0) xpEarned += 5

        // Get current XP
        const { data: profile } = await (supabase
          .from('profiles') as any)
          .select('xp')
          .eq('id', user.id)
          .single()

        if (profile) {
          const newXp = (profile.xp || 0) + xpEarned
          await (supabase
            .from('profiles') as any)
            .update({ xp: newXp })
            .eq('id', user.id)
        }
      }

      return NextResponse.json({ 
        success: true, 
        xpEarned,
        nextReview: nextReviewAt 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return GET(request)
}