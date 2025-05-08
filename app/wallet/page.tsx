"use client"
import { BalanceChart } from "@/components/balance-chart"
import { SwapHistory } from "@/components/swap-history"
import Loader from "@/components/ui/loader"
import { WalletPortfolio } from "@/components/wallet-portofolio"
import { useWallet } from "@/stores/wallet.store"

export default function WalletPage() {
  const {
    swapHistory,
    balanceData,
    portfolioAssets,
    loadingSwaps,
    loadingBalance,
    loadingPortfolio,
  } = useWallet()

  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Smart Wallet</h1>

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

      <div className="min-h-[300px] flex items-center justify-center">
        {loadingBalance ? (
          <Loader />
        ) : balanceData?.balance_usd && balanceData?.balance_history ? (
          <BalanceChart
            balanceUsd={balanceData.balance_usd}
            balanceHistory={balanceData.balance_history}
          />
        ) : (
          <div>No balance data found</div>
        )}
      </div>
    </div>
  )
}
