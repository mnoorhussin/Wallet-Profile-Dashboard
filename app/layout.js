import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'

export const metadata = {
  title: 'Wallet Dashboard',
  description: 'Connect your wallet and view your profile',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}