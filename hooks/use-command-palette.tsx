"use client"

import { useState, useEffect } from "react"

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Cmd+/ or Ctrl+/ for help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const openCommandPalette = () => setIsOpen(true)
  const closeCommandPalette = () => setIsOpen(false)

  return {
    isOpen,
    openCommandPalette,
    closeCommandPalette
  }
}