'use client'

import { useState, useEffect } from 'react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'

export function ConnectButton() {
    const { connectors, connect, isPending } = useConnect()
    const { isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    if (isConnected) {
        return (
            <button
                onClick={() => disconnect()}
                className="disconnect-btn"
            >
                Disconnect Wallet
            </button>
        )
    }

    return (
        <div className="connect-options">
            <h2>Connect Your Wallet</h2>
            <div className="connector-buttons">
                {connectors.map((connector) => (
                    <button
                        key={connector.uid}
                        onClick={() => connect({ connector })}
                        disabled={isPending}
                        className="connect-btn"
                    >
                        {isPending ? 'Connecting...' : connector.name}
                    </button>
                ))}
            </div>
        </div>
    )
}