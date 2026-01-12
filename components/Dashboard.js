'use client'

import { useState, useEffect } from 'react'
import {
    useAccount,
    useBalance,
    useDisconnect,
    useSignMessage
} from 'wagmi'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export function Dashboard() {
    const { address, chain, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: balance } = useBalance({ address })
    const { signMessageAsync } = useSignMessage()

    const [lastLogin, setLastLogin] = useState(null)
    const [loginCount, setLoginCount] = useState(0)
    const [isVerified, setIsVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Wait for client-side mount
    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch previous login data
    const fetchLoginData = async () => {
        if (!address || !isSupabaseConfigured()) return

        const { data, error } = await supabase
            .from('wallet_logins')
            .select('*')
            .eq('wallet_address', address.toLowerCase())
            .single()

        if (data) {
            setLastLogin(data.last_login)
            setLoginCount(data.login_count || 0)
        }
    }

    // Verify wallet ownership with signature
    const verifyWallet = async () => {
        if (!address) return

        setIsLoading(true)
        try {
            const message = `Sign in to Wallet Dashboard\n\nWallet: ${address}\nTimestamp: ${Date.now()}`

            const signature = await signMessageAsync({ message })

            // Save to Supabase if configured
            if (isSupabaseConfigured()) {
                const { data, error } = await supabase
                    .from('wallet_logins')
                    .upsert(
                        {
                            wallet_address: address.toLowerCase(),
                            last_login: new Date().toISOString(),
                            login_count: loginCount + 1
                        },
                        {
                            onConflict: 'wallet_address',
                            ignoreDuplicates: false
                        }
                    )
                    .select()

                if (!error) {
                    fetchLoginData()
                }
            }

            setIsVerified(true)
        } catch (error) {
            console.error('Verification failed:', error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (address && mounted) {
            fetchLoginData()
            setIsVerified(false)
        }
    }, [address, mounted])

    // Don't render until mounted
    if (!mounted) {
        return null
    }

    if (!isConnected) {
        return null
    }

    // Format address for display
    const shortAddress = `${address?.slice(0, 6)}...${address?.slice(-4)}`

    // Format balance
    const formattedBalance = balance
        ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
        : 'Loading...'

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>🎉 Wallet Connected!</h1>
                {!isVerified && (
                    <button
                        onClick={verifyWallet}
                        disabled={isLoading}
                        className="verify-btn"
                    >
                        {isLoading ? 'Signing...' : '✍️ Sign to Verify'}
                    </button>
                )}
                {isVerified && <span className="verified-badge">✅ Verified</span>}
            </div>

            {!isSupabaseConfigured() && (
                <div className="warning-banner">
                    ⚠️ Supabase not configured - Login history disabled
                </div>
            )}

            <div className="profile-card">
                <div className="info-row">
                    <span className="label">📍 Address</span>
                    <span className="value">{shortAddress}</span>
                    <button
                        onClick={() => navigator.clipboard.writeText(address)}
                        className="copy-btn"
                    >
                        📋
                    </button>
                </div>

                <div className="info-row">
                    <span className="label">🌐 Network</span>
                    <span className="value network-badge">
                        {chain?.name || 'Unknown'}
                    </span>
                </div>

                <div className="info-row">
                    <span className="label">💰 Balance</span>
                    <span className="value balance">{formattedBalance}</span>
                </div>

                {lastLogin && (
                    <div className="info-row">
                        <span className="label">🕐 Last Login</span>
                        <span className="value">
                            {new Date(lastLogin).toLocaleString()}
                        </span>
                    </div>
                )}

                {loginCount > 0 && (
                    <div className="info-row">
                        <span className="label">🔢 Total Logins</span>
                        <span className="value">{loginCount}</span>
                    </div>
                )}
            </div>

            <button onClick={() => disconnect()} className="disconnect-btn">
                🚪 Disconnect Wallet
            </button>
        </div>
    )
}