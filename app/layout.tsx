import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anime Kanji - Aprenda Japonês com Animes',
  description: 'Sistema de aprendizado de japonês inspirado em animes com SRS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {children}
        </main>
      </body>
    </html>
  )
}