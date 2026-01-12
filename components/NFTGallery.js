'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

const MOCK_NFTS = [
  {
    id: 1,
    name: 'Bored Ape #1234',
    collection: 'Bored Ape Yacht Club',
    image: 'https://picsum.photos/seed/bayc1234/300/300',
    floorPrice: 85000,
    lastSale: 92000,
    traits: [
      { trait: 'Background', value: 'Blue', rarity: '15%' },
      { trait: 'Fur', value: 'Golden', rarity: '5%' },
      { trait: 'Eyes', value: 'Laser', rarity: '2%' }
    ]
  },
  {
    id: 2,
    name: 'CryptoPunk #5678',
    collection: 'CryptoPunks',
    image: 'https://picsum.photos/seed/punk5678/300/300',
    floorPrice: 120000,
    lastSale: 145000,
    traits: [
      { trait: 'Type', value: 'Alien', rarity: '0.1%' },
      { trait: 'Accessory', value: '3D Glasses', rarity: '8%' }
    ]
  },
  {
    id: 3,
    name: 'Azuki #9012',
    collection: 'Azuki',
    image: 'https://picsum.photos/seed/azuki9012/300/300',
    floorPrice: 18000,
    lastSale: 22000,
    traits: [
      { trait: 'Hair', value: 'Pink', rarity: '12%' },
      { trait: 'Clothing', value: 'Hoodie', rarity: '25%' },
      { trait: 'Eyes', value: 'Red', rarity: '18%' }
    ]
  },
  {
    id: 4,
    name: 'Doodle #3456',
    collection: 'Doodles',
    image: 'https://picsum.photos/seed/doodle3456/300/300',
    floorPrice: 3500,
    lastSale: 4200,
    traits: [
      { trait: 'Face', value: 'Happy', rarity: '30%' },
      { trait: 'Hair', value: 'Purple', rarity: '20%' }
    ]
  }
]

export function NFTGallery() {
  const { address } = useAccount()
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true)
      // In a real app, fetch from OpenSea API, SimpleHash, etc.
      await new Promise(resolve => setTimeout(resolve, 1200))
      setNfts(MOCK_NFTS)
      setLoading(false)
    }

    if (address) {
      fetchNFTs()
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

  const getRarityColor = (rarity) => {
    const num = parseFloat(rarity)
    if (num <= 1) return 'text-yellow-400 bg-yellow-400/10'
    if (num <= 5) return 'text-purple-400 bg-purple-400/10'
    if (num <= 10) return 'text-blue-400 bg-blue-400/10'
    return 'text-gray-400 bg-gray-400/10'
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div>
      {/* View Controls */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">NFT Collection ({nfts.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              viewMode === 'grid' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-gray-800 text-gray-400 border border-gray-600'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              viewMode === 'list' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-gray-800 text-gray-400 border border-gray-600'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* NFT Grid/List */}
      {viewMode === 'grid' ? (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              onClick={() => setSelectedNFT(nft)}
              className="nft-card cursor-pointer"
            >
              <div className="aspect-square bg-gray-700 relative overflow-hidden">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <div className="font-medium text-sm mb-1 truncate">{nft.name}</div>
                <div className="text-xs text-gray-400 mb-2">{nft.collection}</div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-400">Floor</div>
                    <div className="text-sm font-medium">{formatCurrency(nft.floorPrice)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Last Sale</div>
                    <div className="text-sm font-medium">{formatCurrency(nft.lastSale)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              onClick={() => setSelectedNFT(nft)}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-400 transition-colors cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{nft.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{nft.collection}</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Floor: </span>
                      <span className="font-medium">{formatCurrency(nft.floorPrice)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last: </span>
                      <span className="font-medium">{formatCurrency(nft.lastSale)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNFT(null)}
        >
          <div
            className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedNFT.name}</h3>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Collection</div>
                    <div className="font-medium">{selectedNFT.collection}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Floor Price</div>
                      <div className="font-medium">{formatCurrency(selectedNFT.floorPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Last Sale</div>
                      <div className="font-medium">{formatCurrency(selectedNFT.lastSale)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-3">Traits</div>
                    <div className="space-y-2">
                      {selectedNFT.traits.map((trait, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{trait.trait}: {trait.value}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(trait.rarity)}`}>
                            {trait.rarity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg transition-colors">
                      List for Sale
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
                      Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
