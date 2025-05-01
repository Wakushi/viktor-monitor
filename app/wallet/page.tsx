export const dynamic = "force-dynamic"

import { BalanceChart } from "@/components/balance-chart"
import { SwapHistory } from "@/components/swap-history"

export default async function WalletPage() {
  async function getBalanceData() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/wallet`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_SECRET}`,
          },
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async function getSwapHistory() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET}`,
        },
      }
    )
    const data = await response.json()
    return data
  }

  const balanceData = await getBalanceData()
  // const swapHistory = await getSwapHistory()

  return (
    <div className="p-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Smart Wallet</h1>
      {balanceData ? (
        <BalanceChart
          balanceUsd={balanceData.balance_usd}
          balanceHistory={balanceData.balance_history}
        />
      ) : (
        <div>No balance data found</div>
      )}
      {/* {swapHistory ? (
        <SwapHistory swaps={swapHistory} />
      ) : (
        <div>No swap history found</div>
      )} */}
    </div>
  )
}
