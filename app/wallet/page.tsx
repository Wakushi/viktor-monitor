"use client"
import { SwapHistory } from "@/components/swap-history"
import Loader from "@/components/ui/loader"
import { WalletEvolutionChart } from "@/components/wallet-evolution-chart"
import { WalletPortfolio } from "@/components/wallet-portofolio"
import { useWallet } from "@/stores/wallet.store"

export default function WalletPage() {
  const {
    swapHistory,
    snapshots,
    portfolioAssets,
    loadingSwaps,
    loadingSnapshots,
    loadingPortfolio,
  } = useWallet()

  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Smart Wallet</h1>

      {/* PORTFOLIO */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-h-[300px] flex items-center justify-center">
          {loadingPortfolio ? (
            <Loader />
          ) : portfolioAssets?.length ? (
            <WalletPortfolio assets={portfolioAssets} />
          ) : (
            <div>No portfolio assets found</div>
          )}
        </div>

        {/* SWAPS */}
        <div className="flex-1 min-h-[300px] flex items-center justify-center">
          {loadingSwaps ? (
            <Loader />
          ) : swapHistory?.length ? (
            <SwapHistory swaps={swapHistory} />
          ) : (
            <div>No swap history found</div>
          )}
        </div>
      </div>

      {/* HISTORY */}
      <div className="min-h-[300px] flex items-center justify-center">
        {loadingSnapshots ? (
          <Loader />
        ) : snapshots?.length ? (
          <WalletEvolutionChart walletSnapshots={snapshots} />
        ) : (
          <div>No balance data found</div>
        )}
      </div>
    </div>
  )
}
