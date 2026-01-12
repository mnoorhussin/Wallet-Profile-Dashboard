import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
    try {
        const { address, signature, message } = await request.json()

        // Here you could verify the signature server-side
        // using viem's verifyMessage if needed

        const { data, error } = await supabase
            .from('wallet_logins')
            .upsert(
                {
                    wallet_address: address.toLowerCase(),
                    last_login: new Date().toISOString(),
                },
                { onConflict: 'wallet_address' }
            )
            .select()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
        return NextResponse.json(
            { error: 'Address required' },
            { status: 400 }
        )
    }

    const { data, error } = await supabase
        .from('wallet_logins')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single()

    return NextResponse.json({ data, error })
}