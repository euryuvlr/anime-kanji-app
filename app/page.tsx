'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Flame, BookOpen, Target, Zap } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-anime-purple to-anime-pink bg-clip-text text-transparent mb-6">
          Anime Kanji
        </h1>
        
        <p className="text-xl text-gray-600 mb-12">
          Aprenda japonês através dos seus animes favoritos com sistema SRS
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <BookOpen className="w-12 h-12 text-anime-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kanji + Palavras</h3>
            <p className="text-gray-600">Aprenda no contexto real dos animes</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Target className="w-12 h-12 text-anime-pink mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">SRS Inteligente</h3>
            <p className="text-gray-600">Sistema de repetição espaçada</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Streak Diário</h3>
            <p className="text-gray-600">Mantenha sua consistência</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            variant="anime"
            onClick={() => router.push('/register')}
          >
            Começar Agora
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/login')}
          >
            Já tenho conta
          </Button>
        </div>
      </div>
    </div>
  )
}