'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Marrakech Maze — un jeu de style Pac-Man avec un design original.
 *
 * Thème : nuit dorée de Marrakech. Le joueur est un orbe doré (« le Voyageur »)
 * qui collecte des pièces de safran et des lanternes, tout en évitant les
 * gardiens du souk. Manger une lanterne rend les gardiens vulnérables.
 *
 * Le moteur est entièrement basé sur canvas + requestAnimationFrame, avec un
 * déplacement par grille (style arcade classique), un mode chasse/dispersion et
 * un mode effrayé pour les ennemis.
 */

// ---- Configuration de la grille --------------------------------------------

// Légende :
//  # mur
//  . pièce (safran)
//  o lanterne (power-up)
//  - porte de la maison des gardiens
//    (espace) couloir vide
//  P position de départ du joueur
//  G position de départ d'un gardien
const RAW_MAZE = [
  '############################',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#o####.#####.##.#####.####o#',
  '#.####.#####.##.#####.####.#',
  '#..........................#',
  '#.####.##.########.##.####.#',
  '#.####.##.########.##.####.#',
  '#......##....##....##......#',
  '######.##### ## #####.######',
  '######.##### ## #####.######',
  '######.##          ##.######',
  '######.## ###--### ##.######',
  '######.## #GGGGGG# ##.######',
  '      .   #GGGGGG#   .      ',
  '######.## #GGGGGG# ##.######',
  '######.## ######## ##.######',
  '######.##          ##.######',
  '######.## ######## ##.######',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#.####.#####.##.#####.####.#',
  '#o..##.......P .......##..o#',
  '###.##.##.########.##.##.###',
  '###.##.##.########.##.##.###',
  '#......##....##....##......#',
  '#.##########.##.##########.#',
  '#.##########.##.##########.#',
  '#..........................#',
  '############################',
]

const COLS = RAW_MAZE[0].length
const ROWS = RAW_MAZE.length
const TILE = 22 // taille d'une case en pixels

// ---- Palette « Marrakech Nights » ------------------------------------------

const COLORS = {
  bg: '#0d0a1f',
  wall: '#5b3b8c',
  wallGlow: '#9b6bd6',
  pellet: '#f5c518',
  power: '#ff7a3d',
  player: '#ffd34d',
  playerGlow: '#ffae00',
  guardColors: ['#ff5e7e', '#3dd6c4', '#ffa94d', '#b388ff'],
  frightened: '#2b6cff',
  frightenedFlash: '#dfe8ff',
  text: '#f5e9c8',
}

// ---- Types -----------------------------------------------------------------

type Vec = { x: number; y: number }
type Dir = { x: number; y: number }

interface Entity {
  pos: Vec // en coordonnées de grille (peut être fractionnaire)
  dir: Dir
  nextDir: Dir
  speed: number
  spawn: Vec
}

interface Guard extends Entity {
  color: string
  scatterTarget: Vec
  frightened: boolean
  eaten: boolean
}

type GameState = 'ready' | 'playing' | 'dead' | 'won' | 'gameover'

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
}

// ---- Composant -------------------------------------------------------------

export default function MarrakechMaze() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [best, setBest] = useState(0)
  const [state, setState] = useState<GameState>('ready')
  const [level, setLevel] = useState(1)

  // Refs mutables pour la boucle de jeu (évite les re-renders à chaque frame)
  const gridRef = useRef<string[][]>([])
  const playerRef = useRef<Entity | null>(null)
  const guardsRef = useRef<Guard[]>([])
  const pelletsLeftRef = useRef(0)
  const frightenedTimerRef = useRef(0)
  const modeTimerRef = useRef(0)
  const stateRef = useRef<GameState>('ready')
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const levelRef = useRef(1)
  const rafRef = useRef<number>()
  const lastTimeRef = useRef(0)
  const mouthRef = useRef(0)

  // Charge le meilleur score sauvegardé
  useEffect(() => {
    try {
      const saved = localStorage.getItem('marrakech-maze-best')
      if (saved) setBest(parseInt(saved, 10) || 0)
    } catch {
      /* localStorage indisponible */
    }
  }, [])

  // ---- Initialisation d'un niveau -----------------------------------------

  const buildGrid = useCallback(() => {
    const grid: string[][] = RAW_MAZE.map((row) => row.split(''))
    const guards: Guard[] = []
    let player: Entity | null = null
    let pellets = 0
    const guardSpawns: Vec[] = []

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const ch = grid[y][x]
        if (ch === 'P') {
          player = {
            pos: { x, y },
            dir: DIRS.none,
            nextDir: DIRS.none,
            speed: 5.4,
            spawn: { x, y },
          }
          grid[y][x] = ' '
        } else if (ch === 'G') {
          guardSpawns.push({ x, y })
          grid[y][x] = ' '
        } else if (ch === '.' || ch === 'o') {
          pellets++
        }
      }
    }

    // Quatre gardiens depuis le centre de la maison
    const houseCenters: Vec[] = [
      { x: 13, y: 14 },
      { x: 14, y: 14 },
      { x: 12, y: 13 },
      { x: 15, y: 13 },
    ]
    const scatterTargets: Vec[] = [
      { x: COLS - 2, y: 0 },
      { x: 1, y: 0 },
      { x: COLS - 2, y: ROWS - 1 },
      { x: 1, y: ROWS - 1 },
    ]
    for (let i = 0; i < 4; i++) {
      const spawn = houseCenters[i] || guardSpawns[i] || { x: 13, y: 14 }
      guards.push({
        pos: { ...spawn },
        dir: DIRS.up,
        nextDir: DIRS.up,
        speed: 4.6 + levelRef.current * 0.25,
        spawn: { ...spawn },
        color: COLORS.guardColors[i],
        scatterTarget: scatterTargets[i],
        frightened: false,
        eaten: false,
      })
    }

    gridRef.current = grid
    playerRef.current = player
    guardsRef.current = guards
    pelletsLeftRef.current = pellets
    frightenedTimerRef.current = 0
    modeTimerRef.current = 0
  }, [])

  // ---- Aides géométriques --------------------------------------------------

  const isWall = (x: number, y: number): boolean => {
    // Téléportation horizontale (tunnel)
    if (y < 0 || y >= ROWS) return true
    let gx = x
    if (gx < 0) gx = COLS - 1
    if (gx >= COLS) gx = 0
    const ch = gridRef.current[y]?.[gx]
    return ch === '#'
  }

  const isGuardDoor = (x: number, y: number): boolean => {
    return gridRef.current[y]?.[x] === '-'
  }

  // Une entité est-elle alignée sur une case (centre) ?
  const atTileCenter = (e: Entity): boolean => {
    return (
      Math.abs(e.pos.x - Math.round(e.pos.x)) < 0.08 &&
      Math.abs(e.pos.y - Math.round(e.pos.y)) < 0.08
    )
  }

  const canMove = (
    pos: Vec,
    dir: Dir,
    allowDoor: boolean
  ): boolean => {
    if (dir.x === 0 && dir.y === 0) return false
    const tx = Math.round(pos.x) + dir.x
    const ty = Math.round(pos.y) + dir.y
    if (isWall(tx, ty)) return false
    if (!allowDoor && isGuardDoor(tx, ty)) return false
    return true
  }

  // ---- Mouvement du joueur -------------------------------------------------

  const moveEntity = (e: Entity, dt: number, allowDoor: boolean) => {
    // Au centre d'une case : on peut changer de direction
    if (atTileCenter(e)) {
      e.pos.x = Math.round(e.pos.x)
      e.pos.y = Math.round(e.pos.y)

      // Tente la direction demandée
      if (
        (e.nextDir.x !== 0 || e.nextDir.y !== 0) &&
        canMove(e.pos, e.nextDir, allowDoor)
      ) {
        e.dir = e.nextDir
      }
      // Bloqué devant un mur : on s'arrête
      if (!canMove(e.pos, e.dir, allowDoor)) {
        e.dir = DIRS.none
      }
    }

    e.pos.x += e.dir.x * e.speed * dt
    e.pos.y += e.dir.y * e.speed * dt

    // Tunnel (téléportation horizontale)
    if (e.pos.x < -0.5) e.pos.x = COLS - 0.5
    if (e.pos.x > COLS - 0.5) e.pos.x = -0.5
  }

  // ---- IA des gardiens -----------------------------------------------------

  const guardChooseDir = (g: Guard, target: Vec) => {
    if (!atTileCenter(g)) return
    g.pos.x = Math.round(g.pos.x)
    g.pos.y = Math.round(g.pos.y)

    const options: Dir[] = [DIRS.up, DIRS.left, DIRS.down, DIRS.right]
    const allowDoor = g.eaten || isInHouse(g.pos)
    const valid = options.filter((d) => {
      // Pas de demi-tour (sauf cul-de-sac)
      if (d.x === -g.dir.x && d.y === -g.dir.y) return false
      return canMove(g.pos, d, allowDoor)
    })

    let choices = valid
    if (choices.length === 0) {
      // Cul-de-sac : demi-tour autorisé
      choices = options.filter((d) => canMove(g.pos, d, allowDoor))
    }
    if (choices.length === 0) return

    if (g.frightened) {
      // Mouvement aléatoire en mode effrayé
      g.dir = choices[Math.floor(Math.random() * choices.length)]
      return
    }

    // Choisit la direction qui minimise la distance à la cible
    let bestDir = choices[0]
    let bestDist = Infinity
    for (const d of choices) {
      const nx = g.pos.x + d.x
      const ny = g.pos.y + d.y
      const dist = (nx - target.x) ** 2 + (ny - target.y) ** 2
      if (dist < bestDist) {
        bestDist = dist
        bestDir = d
      }
    }
    g.dir = bestDir
  }

  const isInHouse = (pos: Vec): boolean => {
    const x = Math.round(pos.x)
    const y = Math.round(pos.y)
    return x >= 10 && x <= 17 && y >= 12 && y <= 16
  }

  // ---- Mort / réinitialisation des positions -------------------------------

  const resetPositions = () => {
    const p = playerRef.current
    if (p) {
      p.pos = { ...p.spawn }
      p.dir = DIRS.none
      p.nextDir = DIRS.none
    }
    guardsRef.current.forEach((g) => {
      g.pos = { ...g.spawn }
      g.dir = DIRS.up
      g.nextDir = DIRS.up
      g.frightened = false
      g.eaten = false
    })
    frightenedTimerRef.current = 0
    modeTimerRef.current = 0
  }

  // ---- Boucle principale ---------------------------------------------------

  const tick = useCallback(
    (time: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = time

      if (stateRef.current === 'playing') {
        update(dt)
      }
      draw(ctx)

      rafRef.current = requestAnimationFrame(tick)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const update = (dt: number) => {
    const player = playerRef.current
    if (!player) return

    mouthRef.current += dt * 10

    // --- Déplacement joueur ---
    moveEntity(player, dt, false)

    // --- Collecte ---
    const px = Math.round(player.pos.x)
    const py = Math.round(player.pos.y)
    const cell = gridRef.current[py]?.[px]
    if (cell === '.') {
      gridRef.current[py][px] = ' '
      pelletsLeftRef.current--
      addScore(10)
    } else if (cell === 'o') {
      gridRef.current[py][px] = ' '
      pelletsLeftRef.current--
      addScore(50)
      // Active le mode effrayé
      frightenedTimerRef.current = Math.max(2, 7 - levelRef.current * 0.5)
      guardsRef.current.forEach((g) => {
        if (!g.eaten) {
          g.frightened = true
          // Demi-tour à l'activation
          g.dir = { x: -g.dir.x, y: -g.dir.y }
        }
      })
    }

    // --- Victoire ---
    if (pelletsLeftRef.current <= 0) {
      setState('won')
      stateRef.current = 'won'
      return
    }

    // --- Timers de mode ---
    if (frightenedTimerRef.current > 0) {
      frightenedTimerRef.current -= dt
      if (frightenedTimerRef.current <= 0) {
        guardsRef.current.forEach((g) => (g.frightened = false))
      }
    }
    modeTimerRef.current += dt

    // --- Déplacement des gardiens ---
    const inChase = Math.floor(modeTimerRef.current / 7) % 2 === 0
    guardsRef.current.forEach((g, i) => {
      let target: Vec
      if (g.eaten) {
        target = { x: 13, y: 14 } // retour à la maison
        if (isInHouse(g.pos) && atTileCenter(g)) {
          g.eaten = false
          g.frightened = false
        }
      } else if (g.frightened) {
        target = g.pos
      } else if (!inChase) {
        target = g.scatterTarget
      } else {
        // Cible de chasse propre à chaque gardien (personnalités)
        target = chaseTarget(i, player)
      }

      const speed = g.eaten
        ? 9
        : g.frightened
          ? 3.2
          : 4.6 + levelRef.current * 0.25
      g.speed = speed
      guardChooseDir(g, target)
      moveEntity(g, dt, g.eaten || isInHouse(g.pos))
    })

    // --- Collisions joueur / gardiens ---
    for (const g of guardsRef.current) {
      const dist = Math.hypot(g.pos.x - player.pos.x, g.pos.y - player.pos.y)
      if (dist < 0.7) {
        if (g.eaten) continue
        if (g.frightened) {
          g.eaten = true
          g.frightened = false
          addScore(200)
        } else {
          loseLife()
          return
        }
      }
    }
  }

  const chaseTarget = (index: number, player: Entity): Vec => {
    const ahead = (n: number): Vec => ({
      x: player.pos.x + player.dir.x * n,
      y: player.pos.y + player.dir.y * n,
    })
    switch (index) {
      case 0:
        return { x: player.pos.x, y: player.pos.y } // poursuite directe
      case 1:
        return ahead(4) // embuscade devant
      case 2:
        return ahead(2) // flanc
      default: {
        // Patrouilleur : poursuit de loin, sinon disperse
        const d = Math.hypot(
          guardsRef.current[3].pos.x - player.pos.x,
          guardsRef.current[3].pos.y - player.pos.y
        )
        return d > 8
          ? { x: player.pos.x, y: player.pos.y }
          : { x: 1, y: ROWS - 1 }
      }
    }
  }

  const addScore = (n: number) => {
    scoreRef.current += n
    setScore(scoreRef.current)
  }

  const loseLife = () => {
    livesRef.current -= 1
    setLives(livesRef.current)
    if (livesRef.current <= 0) {
      stateRef.current = 'gameover'
      setState('gameover')
      // Sauvegarde du meilleur score
      if (scoreRef.current > best) {
        setBest(scoreRef.current)
        try {
          localStorage.setItem(
            'marrakech-maze-best',
            String(scoreRef.current)
          )
        } catch {
          /* ignore */
        }
      }
    } else {
      stateRef.current = 'dead'
      setState('dead')
      setTimeout(() => {
        resetPositions()
        stateRef.current = 'playing'
        setState('playing')
      }, 1200)
    }
  }

  // ---- Rendu ---------------------------------------------------------------

  const draw = (ctx: CanvasRenderingContext2D) => {
    const W = COLS * TILE
    const H = ROWS * TILE

    // Fond dégradé nocturne
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#15102e')
    grad.addColorStop(1, COLORS.bg)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Murs et pièces
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const ch = gridRef.current[y]?.[x]
        const cx = x * TILE
        const cy = y * TILE
        if (ch === '#') {
          drawWall(ctx, cx, cy)
        } else if (ch === '-') {
          ctx.fillStyle = COLORS.power
          ctx.fillRect(cx + 3, cy + TILE / 2 - 2, TILE - 6, 4)
        } else if (ch === '.') {
          ctx.fillStyle = COLORS.pellet
          ctx.beginPath()
          ctx.arc(cx + TILE / 2, cy + TILE / 2, 2.5, 0, Math.PI * 2)
          ctx.fill()
        } else if (ch === 'o') {
          // Lanterne pulsante
          const pulse = 4 + Math.sin(Date.now() / 200) * 1.5
          ctx.fillStyle = COLORS.power
          ctx.shadowColor = COLORS.power
          ctx.shadowBlur = 12
          ctx.beginPath()
          ctx.arc(cx + TILE / 2, cy + TILE / 2, pulse, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }
    }

    // Gardiens
    guardsRef.current.forEach((g) => drawGuard(ctx, g))

    // Joueur
    const p = playerRef.current
    if (p) drawPlayer(ctx, p)
  }

  const drawWall = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number
  ) => {
    ctx.fillStyle = COLORS.wall
    ctx.strokeStyle = COLORS.wallGlow
    ctx.lineWidth = 2
    const r = 6
    roundRect(ctx, cx + 1, cy + 1, TILE - 2, TILE - 2, r)
    ctx.fill()
    ctx.stroke()
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D, p: Entity) => {
    const cx = p.pos.x * TILE + TILE / 2
    const cy = p.pos.y * TILE + TILE / 2
    const r = TILE / 2 - 1

    // Angle de la bouche selon la direction
    let base = 0
    if (p.dir.x === 1) base = 0
    else if (p.dir.x === -1) base = Math.PI
    else if (p.dir.y === -1) base = -Math.PI / 2
    else if (p.dir.y === 1) base = Math.PI / 2

    const open = (Math.sin(mouthRef.current) * 0.5 + 0.5) * 0.32 * Math.PI

    ctx.save()
    ctx.shadowColor = COLORS.playerGlow
    ctx.shadowBlur = 16
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r)
    g.addColorStop(0, '#fff4c2')
    g.addColorStop(1, COLORS.player)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, base + open, base + Math.PI * 2 - open)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  const drawGuard = (ctx: CanvasRenderingContext2D, g: Guard) => {
    const cx = g.pos.x * TILE + TILE / 2
    const cy = g.pos.y * TILE + TILE / 2
    const r = TILE / 2 - 1

    let color = g.color
    if (g.eaten) color = 'rgba(255,255,255,0.25)'
    else if (g.frightened) {
      const flashing = frightenedTimerRef.current < 2
      color =
        flashing && Math.floor(Date.now() / 200) % 2 === 0
          ? COLORS.frightenedFlash
          : COLORS.frightened
    }

    ctx.save()
    if (!g.eaten) {
      ctx.shadowColor = color
      ctx.shadowBlur = 10
    }
    ctx.fillStyle = color

    // Corps en forme de « fantôme » losangé (design différent : tête en goutte)
    ctx.beginPath()
    ctx.arc(cx, cy - 1, r, Math.PI, 0)
    ctx.lineTo(cx + r, cy + r - 2)
    // Bas festonné
    const waves = 3
    for (let i = 0; i < waves; i++) {
      const wx = cx + r - ((i * 2 + 1) * r) / waves
      ctx.lineTo(wx, cy + r - 5)
      const wx2 = cx + r - ((i * 2 + 2) * r) / waves
      ctx.lineTo(wx2, cy + r - 2)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // Yeux
    if (!g.frightened || g.eaten) {
      const ex = g.dir.x * 1.6
      const ey = g.dir.y * 1.6
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(cx - 3.5, cy - 2, 3, 0, Math.PI * 2)
      ctx.arc(cx + 3.5, cy - 2, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#16123a'
      ctx.beginPath()
      ctx.arc(cx - 3.5 + ex, cy - 2 + ey, 1.5, 0, Math.PI * 2)
      ctx.arc(cx + 3.5 + ex, cy - 2 + ey, 1.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Visage effrayé
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(cx - 3.5, cy - 2, 1.8, 0, Math.PI * 2)
      ctx.arc(cx + 3.5, cy - 2, 1.8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // ---- Entrées clavier / tactile -------------------------------------------

  const setDirection = useCallback((dir: Dir) => {
    const p = playerRef.current
    if (!p) return
    p.nextDir = dir
    // Premier mouvement : lance la partie
    if (stateRef.current === 'ready') {
      stateRef.current = 'playing'
      setState('playing')
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'z':
        case 'w':
          e.preventDefault()
          setDirection(DIRS.up)
          break
        case 'ArrowDown':
        case 's':
          e.preventDefault()
          setDirection(DIRS.down)
          break
        case 'ArrowLeft':
        case 'q':
        case 'a':
          e.preventDefault()
          setDirection(DIRS.left)
          break
        case 'ArrowRight':
        case 'd':
          e.preventDefault()
          setDirection(DIRS.right)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setDirection])

  // ---- Démarrage / cycle de vie -------------------------------------------

  const startGame = useCallback(
    (resetAll: boolean) => {
      if (resetAll) {
        scoreRef.current = 0
        setScore(0)
        livesRef.current = 3
        setLives(3)
        levelRef.current = 1
        setLevel(1)
      }
      buildGrid()
      stateRef.current = 'ready'
      setState('ready')
    },
    [buildGrid]
  )

  const nextLevel = useCallback(() => {
    levelRef.current += 1
    setLevel(levelRef.current)
    buildGrid()
    stateRef.current = 'ready'
    setState('ready')
  }, [buildGrid])

  // Initialise la grille au montage et lance la boucle de rendu
  useEffect(() => {
    buildGrid()
    stateRef.current = 'ready'
    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [buildGrid, tick])

  // ---- Rendu UI ------------------------------------------------------------

  const W = COLS * TILE
  const H = ROWS * TILE

  return (
    <div className="flex flex-col items-center gap-4 text-[#f5e9c8]">
      {/* En-tête / score */}
      <div
        className="flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-3"
        style={{
          maxWidth: W,
          borderColor: 'rgba(155,107,214,0.35)',
          background: 'rgba(20,14,42,0.6)',
        }}
      >
        <Stat label="Score" value={score} />
        <Stat label="Niveau" value={level} />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest opacity-60">
            Vies
          </span>
          <div className="flex gap-1 pt-1">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span
                key={i}
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  background: COLORS.player,
                  boxShadow: `0 0 6px ${COLORS.playerGlow}`,
                }}
              />
            ))}
          </div>
        </div>
        <Stat label="Record" value={best} />
      </div>

      {/* Plateau */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          boxShadow:
            '0 0 0 1px rgba(155,107,214,0.4), 0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        />

        {/* Superpositions d'état */}
        {state !== 'playing' && state !== 'dead' && (
          <Overlay>
            {state === 'ready' && (
              <>
                <h2 className="font-serif text-3xl text-[#ffd34d]">
                  Marrakech Maze
                </h2>
                <p className="max-w-xs text-center text-sm opacity-80">
                  Collectez le safran doré, attrapez les lanternes et fuyez les
                  gardiens du souk.
                </p>
                <p className="text-xs opacity-60">
                  Flèches ou WASD/ZQSD pour jouer
                </p>
                <PulseHint />
              </>
            )}
            {state === 'won' && (
              <>
                <h2 className="font-serif text-3xl text-[#3dd6c4]">
                  Niveau terminé !
                </h2>
                <p className="text-sm opacity-80">Score : {score}</p>
                <GameButton onClick={nextLevel}>Niveau suivant →</GameButton>
              </>
            )}
            {state === 'gameover' && (
              <>
                <h2 className="font-serif text-3xl text-[#ff5e7e]">
                  Partie terminée
                </h2>
                <p className="text-sm opacity-80">
                  Score : {score} · Record : {best}
                </p>
                <GameButton onClick={() => startGame(true)}>Rejouer</GameButton>
              </>
            )}
          </Overlay>
        )}
        {state === 'dead' && (
          <Overlay>
            <p className="font-serif text-2xl text-[#ff5e7e]">Attrapé !</p>
          </Overlay>
        )}
      </div>

      {/* Contrôles tactiles (mobile) */}
      <div className="grid grid-cols-3 gap-2 sm:hidden" style={{ maxWidth: 200 }}>
        <span />
        <PadButton onPress={() => setDirection(DIRS.up)}>▲</PadButton>
        <span />
        <PadButton onPress={() => setDirection(DIRS.left)}>◀</PadButton>
        <PadButton onPress={() => setDirection(DIRS.down)}>▼</PadButton>
        <PadButton onPress={() => setDirection(DIRS.right)}>▶</PadButton>
      </div>

      <button
        onClick={() => startGame(true)}
        className="rounded-full border px-5 py-2 text-sm transition hover:bg-white/10"
        style={{ borderColor: 'rgba(155,107,214,0.5)' }}
      >
        Recommencer
      </button>
    </div>
  )
}

// ---- Sous-composants UI ----------------------------------------------------

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs uppercase tracking-widest opacity-60">
        {label}
      </span>
      <span className="font-serif text-2xl text-[#ffd34d]">{value}</span>
    </div>
  )
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-sm"
      style={{ background: 'rgba(13,10,31,0.78)' }}
    >
      {children}
    </div>
  )
}

function GameButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mt-2 rounded-full px-6 py-2.5 font-medium text-[#1a1233] transition hover:scale-105"
      style={{
        background: 'linear-gradient(135deg,#ffd34d,#ffae00)',
        boxShadow: '0 8px 24px rgba(255,174,0,0.35)',
      }}
    >
      {children}
    </button>
  )
}

function PadButton({
  children,
  onPress,
}: {
  children: React.ReactNode
  onPress: () => void
}) {
  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault()
        onPress()
      }}
      onMouseDown={onPress}
      className="flex h-14 w-full items-center justify-center rounded-2xl border text-xl active:scale-95"
      style={{
        borderColor: 'rgba(155,107,214,0.5)',
        background: 'rgba(91,59,140,0.25)',
      }}
    >
      {children}
    </button>
  )
}

function PulseHint() {
  return (
    <div className="mt-2 animate-pulse text-xs uppercase tracking-[0.3em] text-[#ffd34d]">
      Appuyez sur une touche pour commencer
    </div>
  )
}

// ---- Utilitaire canvas -----------------------------------------------------

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
