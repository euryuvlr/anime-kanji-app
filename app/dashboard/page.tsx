'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useReviews } from '@/hooks/useReviews'
import { progressService } from '@/services/progressService'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StreakCounter } from '@/components/ui/StreakCounter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BookOpen, Award, TrendingUp, Zap } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { dueReviews, loading: reviewsLoading } = useReviews()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalReviews: 0,
    accuracy: 0,
    streakDays: 0,
    totalXP: 0
  })
  const [level, setLevel] = useState<{ name: string; progress: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        const [userStats, currentLevel] = await Promise.all([
          progressService.getStats(user.id),
          progressService.getCurrentLevel(user.id)
        ])

        setStats(userStats)
        if (currentLevel) {
          setLevel({
            name: currentLevel.level.name,
            progress: currentLevel.progress
          })
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  if (loading || reviewsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  const pendingCount = dueReviews.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <StreakCounter days={stats.streakDays} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões Pendentes</CardTitle>
            <BookOpen className="h-4 w-4 text-anime-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingCount === 0 ? 'Tudo em dia! 🎉' : 'Prontas para revisar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Revisões</CardTitle>
            <TrendingUp className="h-4 w-4 text-anime-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Desde o início
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de acertos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Total</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalXP}</div>
            <p className="text-xs text-muted-foreground">
              Pontos de experiência
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      {level && (
        <Card>
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{level.name}</span>
              <span className="text-sm text-gray-600">{level.progress}%</span>
            </div>
            <ProgressBar value={level.progress} variant="success" size="lg" />
          </CardContent>
        </Card>
      )}

      {/* Start Review Button */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-anime-purple to-anime-pink p-8 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Hora de Estudar! 📚</h2>
          <p className="mb-6">
            Você tem {pendingCount} {pendingCount === 1 ? 'revisão pendente' : 'revisões pendentes'}
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push('/dashboard/review')}
          >
            Começar Revisão
          </Button>
        </div>
      )}

      {/* All Done */}
      {pendingCount === 0 && (
        <div className="bg-green-50 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Parabéns! 🎉
          </h2>
          <p className="text-green-600">
            Você completou todas as revisões de hoje. Volte mais tarde para mais!
          </p>
        </div>
      )}
    </div>
  )
}