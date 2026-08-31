import type { Metadata } from 'next'
import MarrakechMaze from '@/components/game/MarrakechMaze'

export const metadata: Metadata = {
  title: 'Marrakech Maze — Jeu',
  description:
    'Un jeu de style Pac-Man au design original : collectez le safran doré et fuyez les gardiens du souk.',
  robots: { index: false, follow: false },
}

export default function GamePage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, #1c1340 0%, #0d0a1f 60%, #07050f 100%)',
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="font-serif text-4xl tracking-wide text-[#ffd34d] sm:text-5xl">
          Marrakech Maze
        </h1>
        <p className="mt-2 text-sm text-[#f5e9c8]/70">
          Un labyrinthe doré sous les étoiles de la médina
        </p>
      </div>

      <MarrakechMaze />
    </main>
  )
}
