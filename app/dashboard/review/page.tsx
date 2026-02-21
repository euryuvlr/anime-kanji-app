'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useReviews } from '@/hooks/useReviews'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ReviewRating } from '@/lib/database/types'
import { CheckCircle, XCircle, AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react'

export default function ReviewPage() {
  const router = useRouter()
  const {
    dueReviews,
    currentReview,
    currentItem,
    loading,
    submitting,
    submitReview
  } = useReviews()

  const [showAnswer, setShowAnswer] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [lastRating, setLastRating] = useState<ReviewRating | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (dueReviews.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Sem revisões pendentes! 🎉</h2>
        <p className="text-gray-600 mb-6">Você completou todas as revisões de hoje.</p>
        <Button onClick={() => router.push('/dashboard')}>
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  if (!currentItem || !currentReview) {
    return null
  }

  const totalReviews = dueReviews.length
  const currentIndex = dueReviews.findIndex(r => r.id === currentReview.id) + 1

  const getItemContent = () => {
    switch (currentReview.item_type) {
      case 'kanji':
        return {
          question: (currentItem as any).character,
          reading: (currentItem as any).onyomi || (currentItem as any).kunyomi,
          meaning: (currentItem as any).meaning,
          context: (currentItem as any).anime_context
        }
      case 'word':
        return {
          question: (currentItem as any).word,
          reading: (currentItem as any).reading,
          meaning: (currentItem as any).meaning,
          context: (currentItem as any).anime_context
        }
      case 'phrase':
        return {
          question: (currentItem as any).japanese,
          reading: (currentItem as any).reading,
          meaning: (currentItem as any).meaning,
          context: (currentItem as any).anime_source
        }
    }
  }

  const content = getItemContent()

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleRating = async (rating: ReviewRating) => {
    try {
      const result = await submitReview(rating)
      setLastRating(rating)
      setXpEarned(result?.xpEarned || 0)
      setShowResult(true)

      // Reset for next review after a delay
      setTimeout(() => {
        setShowAnswer(false)
        setShowResult(false)
        setLastRating(null)
        setXpEarned(0)
      }, 2000)
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const getRatingButtonClass = (rating: string) => {
    const baseClass = "flex-1 py-4 px-2 rounded-lg font-medium transition-all"
    switch (rating) {
      case 'error':
        return `${baseClass} bg-red-100 text-red-700 hover:bg-red-200`
      case 'hard':
        return `${baseClass} bg-orange-100 text-orange-700 hover:bg-orange-200`
      case 'medium':
        return `${baseClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`
      case 'easy':
        return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200`
      default:
        return baseClass
    }
  }

  if (showResult && lastRating) {
    const messages = {
      error: 'Não desanime! Você vai pegar na próxima! 💪',
      hard: 'Bom esforço! Continue praticando! 📚',
      medium: 'Muito bem! Está no caminho certo! 🌟',
      easy: 'Excelente! Você dominou isso! 🎉'
    }

    const icons = {
      error: <XCircle className="w-12 h-12 text-red-500" />,
      hard: <AlertCircle className="w-12 h-12 text-orange-500" />,
      medium: <HelpCircle className="w-12 h-12 text-yellow-500" />,
      easy: <CheckCircle className="w-12 h-12 text-green-500" />
    }

    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-4">
              {icons[lastRating]}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {lastRating === 'easy' ? 'Perfeito!' :
               lastRating === 'medium' ? 'Bom trabalho!' :
               lastRating === 'hard' ? 'Quase lá!' : 'Continue tentando!'}
            </h2>
            <p className="text-gray-600 mb-4">{messages[lastRating]}</p>
            {xpEarned > 0 && (
              <p className="text-lg font-bold text-anime-purple">
                +{xpEarned} XP
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso da sessão</span>
          <span>{currentIndex} de {totalReviews}</span>
        </div>
        <ProgressBar value={(currentIndex / totalReviews) * 100} size="md" />
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar ao Dashboard
      </button>

      {/* Review card */}
      <Card className="mb-6">
        <CardContent className="pt-8 pb-8">
          {/* Item type badge */}
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {currentReview.item_type === 'kanji' ? 'Kanji' :
               currentReview.item_type === 'word' ? 'Palavra' : 'Frase'}
            </span>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-6xl font-bold mb-4 font-[Noto Sans JP]">
              {content.question}
            </h2>
            {!showAnswer && (
              <p className="text-gray-500">
                {currentReview.item_type === 'kanji' ? 'Clique para ver o significado' :
                 'O que significa isso?'}
              </p>
            )}
          </div>

          {/* Answer section */}
          {showAnswer && (
            <div className="space-y-4 border-t pt-6">
              <div className="text-center">
                <p className="text-2xl mb-2">
                  <span className="font-medium">Leitura:</span> {content.reading || 'N/A'}
                </p>
                <p className="text-xl text-gray-700 mb-4">
                  <span className="font-medium">Significado:</span> {content.meaning}
                </p>
                {content.context && (
                  <p className="text-sm text-gray-500 italic">
                    Contexto: {content.context}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action buttons */}
      {!showAnswer ? (
        <Button
          variant="anime"
          size="lg"
          className="w-full"
          onClick={handleShowAnswer}
        >
          Ver Resposta
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            Como foi sua resposta?
          </p>
          <div className="flex gap-2">
            <button
              className={getRatingButtonClass('error')}
              onClick={() => handleRating('error')}
              disabled={submitting}
            >
              Errei
            </button>
            <button
              className={getRatingButtonClass('hard')}
              onClick={() => handleRating('hard')}
              disabled={submitting}
            >
              Difícil
            </button>
            <button
              className={getRatingButtonClass('medium')}
              onClick={() => handleRating('medium')}
              disabled={submitting}
            >
              Médio
            </button>
            <button
              className={getRatingButtonClass('easy')}
              onClick={() => handleRating('easy')}
              disabled={submitting}
            >
              Fácil
            </button>
          </div>
        </div>
      )}
    </div>
  )
}