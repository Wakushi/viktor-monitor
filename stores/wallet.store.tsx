"use client"

import { MobulaExtendedToken } from "@/types/week-analysis.type"
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

export type Balance = {
  balance: number
  price: number
  value: number
  allocation: number
  token: MobulaExtendedToken
}

export type WalletSnapshotState = "before_sell" | "after_sell"

export type WalletSnapshot = {
  id: number
  state: WalletSnapshotState
  balances: Balance[]
  created_at: Date | string
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
  portfolioAssets: Balance[]
  snapshots: any
  swapHistory: any
  loadingPortfolio: boolean
  loadingSnapshots: boolean
  loadingSwaps: boolean
  refreshPortfolio: () => Promise<void>
  refreshSnapshots: () => Promise<void>
  refreshSwaps: () => Promise<void>
}

const WalletContext = createContext<WalletContextProps>({
  portfolioAssets: [],
  snapshots: null,
  swapHistory: null,
  loadingPortfolio: true,
  loadingSnapshots: true,
  loadingSwaps: true,
  refreshPortfolio: async () => {},
  refreshSnapshots: async () => {},
  refreshSwaps: async () => {},
})

export function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  const [portfolioAssets, setPortfolioAssets] = useState<Balance[]>([])
  const [snapshots, setSnapshots] = useState<WalletSnapshot[]>([])
  const [swapHistory, setSwapHistory] = useState<any>(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)
  const [loadingSnapshots, setLoadingSnapshots] = useState(true)
  const [loadingSwaps, setLoadingSwaps] = useState(true)

  const WALLET_ADDRESS = "0x82e931E5958234331c21D155331eE6C3048a3935"

  useEffect(() => {
    refreshPortfolio()
    refreshSnapshots()
    refreshSwaps()
  }, [])

  async function refreshPortfolio() {
    try {
      setLoadingPortfolio(true)
      const res = await fetch("api/wallet")
      const data: Balance[] = await res.json()

      setPortfolioAssets(data)
    } catch (err) {
      console.error("Failed to load wallet portfolio:", err)
    } finally {
      setLoadingPortfolio(false)
    }
  }

  async function refreshSnapshots() {
    try {
      setLoadingSnapshots(true)
      const response = await fetch(`/api/wallet/snapshots`)
      const data = await response.json()
      setSnapshots(data)
    } catch (error) {
      console.error("Failed to fetch balance data:", error)
    } finally {
      setLoadingSnapshots(false)
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
    snapshots,
    swapHistory,
    loadingPortfolio,
    loadingSnapshots,
    loadingSwaps,
    refreshPortfolio,
    refreshSnapshots,
    refreshSwaps,
  }

  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
