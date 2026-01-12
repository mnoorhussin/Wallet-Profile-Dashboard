'use client'

import { useState, useEffect } from 'react'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check for saved preference or default to dark mode
    const saved = localStorage.getItem('darkMode')
    const prefersDark = saved === null ? true : saved === 'true'
    setIsDark(prefersDark)
    document.documentElement.classList.toggle('light', !prefersDark)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    document.documentElement.classList.toggle('light', !newMode)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600"
      aria-label="Toggle dark mode"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
