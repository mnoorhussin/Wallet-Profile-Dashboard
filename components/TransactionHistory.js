'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

const MOCK_TRANSACTIONS = [
  {
    hash: '0x1234...5678',
    type: 'Send',
    to: '0xabcd...efgh',
    value: '0.5 ETH',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'confirmed'
  },
  {
    hash: '0x5678...9abc',
    type: 'Receive',
    from: '0xijkl...mnop',
    value: '1.2 ETH',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'confirmed'
  },
  {
    hash: '0x9abc...def0',
    type: 'Contract Interaction',
    to: '0xqrst...uvwx',
    value: '0 ETH',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'pending'
  }
]

export function TransactionHistory() {
  const { address, chain } = useAccount()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchTransactions = async () => {
      setLoading(true)
      // In a real app, you'd fetch from an API like Etherscan
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTransactions(MOCK_TRANSACTIONS)
      setLoading(false)
    }

    if (address) {
      fetchTransactions()
    }
  }, [address])

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Send': return 'text-red-400'
      case 'Receive': return 'text-green-400'
      default: return 'text-blue-400'
    }
  }

  const getStatusBadge = (status) => {
    return status === 'confirmed' 
      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No transactions found</p>
        </div>
      ) : (
        transactions.map((tx, index) => (
          <div key={index} className="transaction-item">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${getTypeColor(tx.type)}`}>
                  {tx.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {formatTime(tx.timestamp)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                {tx.type === 'Receive' ? (
                  <span>From: <span className="text-gray-300">{formatAddress(tx.from || 'Unknown')}</span></span>
                ) : (
                  <span>To: <span className="text-gray-300">{formatAddress(tx.to)}</span></span>
                )}
              </div>
              <div className="font-semibold">
                {tx.value}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Hash: {formatAddress(tx.hash)}
            </div>
          </div>
        ))
      )}
      
      <button className="w-full py-2 text-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
        View more transactions
      </button>
    </div>
  )
}
