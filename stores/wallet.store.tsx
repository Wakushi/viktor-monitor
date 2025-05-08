"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface WalletContextProviderProps {
  children: ReactNode
}

export interface MobulaPortfolioResponse {
  data: {
    total_wallet_balance: number
    wallets: string[]
    assets: MobulaAssetEntry[]
    balances_length: number
  }
}

export interface MobulaAssetEntry {
  asset: {
    id: number
    name: string
    symbol: string
    logo: string
    decimals: string[] 
    contracts: string[]
    blockchains: string[]
  }
  price: number
  price_change_24h: number
  estimated_balance: number
  token_balance: number
  allocation: number
}

interface WalletContextProps {
  portfolioAssets: MobulaAssetEntry[]
  totalBalance: number
  balanceData: any
  swapHistory: any
  loadingPortfolio: boolean
  loadingBalance: boolean
  loadingSwaps: boolean
  refreshPortfolio: () => Promise<void>
  refreshBalance: () => Promise<void>
  refreshSwaps: () => Promise<void>
}

const WalletContext = createContext<WalletContextProps>({
  portfolioAssets: [],
  totalBalance: 0,
  balanceData: null,
  swapHistory: null,
  loadingPortfolio: true,
  loadingBalance: true,
  loadingSwaps: true,
  refreshPortfolio: async () => {},
  refreshBalance: async () => {},
  refreshSwaps: async () => {},
})

export function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  const [portfolioAssets, setPortfolioAssets] = useState<MobulaAssetEntry[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [balanceData, setBalanceData] = useState<any>(null)
  const [swapHistory, setSwapHistory] = useState<any>(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)
  const [loadingBalance, setLoadingBalance] = useState(true)
  const [loadingSwaps, setLoadingSwaps] = useState(true)

  const WALLET_ADDRESS = "0x82e931E5958234331c21D155331eE6C3048a3935"
  const PORTFOLIO_API = `https://api.mobula.io/api/1/wallet/portfolio?wallet=${WALLET_ADDRESS}`

  useEffect(() => {
    refreshPortfolio()
    refreshBalance()
    refreshSwaps()
  }, [])

  async function refreshPortfolio() {
    try {
      setLoadingPortfolio(true)
      const res = await fetch(PORTFOLIO_API)
      const data: MobulaPortfolioResponse = await res.json()

      setPortfolioAssets(
        data.data.assets
          .filter((asset) => asset.token_balance)
          .sort((a, b) => b.allocation - a.allocation)
      )
      setTotalBalance(data.data.total_wallet_balance)
    } catch (err) {
      console.error("Failed to load wallet portfolio:", err)
    } finally {
      setLoadingPortfolio(false)
    }
  }

  async function refreshBalance() {
    const WALLET_CREATION = 1746432138000

    try {
      setLoadingBalance(true)
      const response = await fetch(
        `/api/wallet/balance?from=${WALLET_CREATION}`
      )
      const data = await response.json()
      setBalanceData(data)
    } catch (error) {
      console.error("Failed to fetch balance data:", error)
    } finally {
      setLoadingBalance(false)
    }
  }

  async function refreshSwaps() {
    try {
      setLoadingSwaps(true)
      const response = await fetch(`/api/wallet/swaps?wallet=${WALLET_ADDRESS}`)
      const data = await response.json()
      setSwapHistory(data)
    } catch (error) {
      console.error("Failed to fetch swap history:", error)
    } finally {
      setLoadingSwaps(false)
    }
  }

  const context: WalletContextProps = {
    portfolioAssets,
    totalBalance,
    balanceData,
    swapHistory,
    loadingPortfolio,
    loadingBalance,
    loadingSwaps,
    refreshPortfolio,
    refreshBalance,
    refreshSwaps,
  }

  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
