import { createConfig, http } from 'wagmi'
import { walletConnect, metaMask, injected } from 'wagmi/connectors'
import { mainnet, polygon, arbitrum, base, optimism, bsc, sepolia } from 'wagmi/chains'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
if (!projectId) throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')

export const chains = [mainnet, polygon, arbitrum, base, optimism, bsc, sepolia]

const transports = {
  [mainnet.id]: http(),
  [polygon.id]: http(),
  [arbitrum.id]: http(),
  [base.id]: http(),
  [optimism.id]: http(),
  [bsc.id]: http(),
  [sepolia.id]: http()
}

export const metadata = {
  name: 'MyDApp',
  description: 'Web3 app that works on Desktop, Mobile & Telegram',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://example.com',
  icons: [process.env.NEXT_PUBLIC_APP_ICON || 'https://example.com/icon.png']
}

export const config = createConfig({
  chains,
  transports,
  connectors: [
    injected({ shimDisconnect: true }), // Browser wallets like Brave
    metaMask({ shimDisconnect: true }), // Explicit MetaMask support
    walletConnect({ projectId, metadata, showQrModal: true }) // WalletConnect v2
    // 🚫 no coinbaseWallet connector, so no Coinbase telemetry
  ]
})
