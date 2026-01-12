'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@/components/ConnectButton'
import { Dashboard } from '@/components/Dashboard'

export default function Home() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading until mounted
  if (!mounted) {
    return (
      <main className="container">
        <div className="hero">
          <h1>🔐 Wallet Dashboard</h1>
          <p>Connect your wallet to view your profile</p>
        </div>
        <div className="loading">Loading...</div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="hero">
        <h1>🔐 Wallet Dashboard</h1>
        <p>Connect your wallet to view your profile</p>
      </div>

      {!isConnected ? (
        <ConnectButton />
      ) : (
        <Dashboard />
      )}
    </main>
  )
}