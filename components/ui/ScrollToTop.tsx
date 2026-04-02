'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollTop}
          aria-label="Retour en haut"
          className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950 shadow-lg flex items-center justify-center hover:bg-gold-500 dark:hover:bg-gold-400 dark:hover:text-white transition-colors duration-200"
        >
          <ChevronUp size={18} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
