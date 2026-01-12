'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo'

const config = createConfig({
    chains: [mainnet, polygon, sepolia],
    connectors: [
        injected(),
        walletConnect({ projectId }),
    ],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [sepolia.id]: http(),
    },
})

const queryClient = new QueryClient()

export function WalletProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}