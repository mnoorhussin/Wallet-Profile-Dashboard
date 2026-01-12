'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'

const MOCK_TOKENS = [
  { symbol: 'ETH', balance: '2.5', value: 5000, change: 2.5 },
  { symbol: 'USDC', balance: '1500', value: 1500, change: 0.1 },
  { symbol: 'WBTC', balance: '0.1', value: 4300, change: -1.2 },
  { symbol: 'LINK', balance: '50', value: 750, change: 5.8 },
]

const MOCK_NFTS = [
  { name: 'Bored Ape #1234', collection: 'BAYC', value: 150000, image: '/api/placeholder/200/200' },
  { name: 'CryptoPunk #5678', collection: 'CryptoPunks', value: 250000, image: '/api/placeholder/200/200' },
  { name: 'Azuki #9012', collection: 'Azuki', value: 45000, image: '/api/placeholder/200/200' },
]

export function PortfolioTracker() {
  const { address } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  const [tokens, setTokens] = useState([])
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true)
      // In a real app, fetch from Coingecko API, DeBank, Zapper, etc.
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTokens(MOCK_TOKENS)
      setNfts(MOCK_NFTS)
      
      const tokenValue = MOCK_TOKENS.reduce((sum, token) => sum + token.value, 0)
      const nftValue = MOCK_NFTS.reduce((sum, nft) => sum + nft.value, 0)
      setTotalValue(tokenValue + nftValue)
      setLoading(false)
    }

    if (address) {
      fetchPortfolio()
    }
  }, [address])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeIcon = (change) => {
    return change >= 0 ? '↗' : '↘'
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="portfolio-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Total Portfolio Value</h3>
          <span className="text-xs text-gray-400">Last updated: Just now</span>
        </div>
        <div className="text-3xl font-bold text-cyan-400 mb-2">
          {formatCurrency(totalValue)}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className={getChangeColor(3.2)}>
            {getChangeIcon(3.2)} 3.2% ($420)
          </span>
          <span className="text-gray-400">24h</span>
        </div>
      </div>

      {/* Assets Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span>🪙</span> Tokens ({tokens.length})
          </h4>
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{token.balance}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(token.value)}</div>
                  <div className={`text-sm ${getChangeColor(token.change)}`}>
                    {getChangeIcon(token.change)} {Math.abs(token.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span>🎨</span> NFTs ({nfts.length})
          </h4>
          <div className="space-y-3">
            {nfts.map((nft, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{nft.name}</div>
                  <div className="text-xs text-gray-400">{nft.collection}</div>
                </div>
                <div className="font-medium text-sm">
                  {formatCurrency(nft.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-center transition-colors">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xs">Swap</div>
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-center transition-colors">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-xs">Stake</div>
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-center transition-colors">
          <div className="text-2xl mb-1">🏦</div>
          <div className="text-xs">Lend</div>
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-center transition-colors">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xs">More</div>
        </button>
      </div>
    </div>
  )
}
