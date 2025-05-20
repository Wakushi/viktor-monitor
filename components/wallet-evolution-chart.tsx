"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts"
import { Button } from "./ui/button"
import { RefreshCcw } from "lucide-react"
import { useWallet, WalletSnapshot } from "@/stores/wallet.store"
import { format } from "date-fns"

export function WalletEvolutionChart({
  walletSnapshots,
}: {
  walletSnapshots: WalletSnapshot[]
}) {
  const { refreshSnapshots } = useWallet()

  const filteredSnapshots = walletSnapshots.filter(
    (snapshot) => snapshot.state === "after_sell"
  )

  const chartData = filteredSnapshots.map((snapshot) => {
    const totalValue = snapshot.balances.reduce((sum, b) => sum + b.value, 0)

    const beforeSaleSnapshot = getBeforeSaleStateByDate(snapshot.created_at)
    const beforeSaleTotalValue = beforeSaleSnapshot.balances.reduce(
      (sum, b) => sum + b.value,
      0
    )

    const saleFeeLost = beforeSaleTotalValue - totalValue

    return {
      date: new Date(snapshot.created_at).toISOString(),
      totalValue,
      saleFeeLost,
      tokens: snapshot.balances.map((b) => ({
        symbol: b.token.symbol,
        name: b.token.name,
        price: b.price,
        value: b.value,
        logo: b.token.logo,
      })),
    }
  })

  function getBeforeSaleStateByDate(dateString: string | Date): WalletSnapshot {
    const date = new Date(dateString)
    date.setHours(0, 0, 0, 0)

    const match = walletSnapshots.find((snapshot) => {
      const snapshotDate = new Date(snapshot.created_at)
      snapshotDate.setHours(0, 0, 0, 0)

      return snapshotDate.getTime() === date.getTime()
    })

    if (!match) {
      throw new Error("No before sale snapshot on date " + dateString)
    }

    return match
  }

  return (
    <div className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-md">
      <div className="flex items-center gap-2">
        <div className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-100">
          Wallet evolution
        </div>
        <Button
          className="hover:bg-transparent bg-zinc-800"
          onClick={refreshSnapshots}
        >
          <RefreshCcw className="text-white" />
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MM/dd")}
          />
          <YAxis
            tickFormatter={(value) =>
              `$${value >= 1000 ? (value / 1000).toFixed(1) + "k" : value}`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="totalValue"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={false}
          />
          <Brush dataKey="date" height={20} stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any
  label?: string
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded shadow-md max-w-xs">
        {label && (
          <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {format(new Date(label), "yyyy-MM-dd")}
          </div>
        )}
        <div className="flex flex-col mb-2">
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            Total value: ${data.totalValue.toFixed(2)}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            Swap fees: ${data.saleFeeLost.toFixed(2)}
          </div>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {data.tokens
            .sort((a: any, b: any) => b.value - a.value)
            .map((token: any) => (
              <div key={token.symbol} className="flex items-center gap-2">
                {token.logo && (
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-4 h-4 rounded-full"
                  />
                )}
                <div className="text-xs text-zinc-600 dark:text-zinc-200">
                  <strong>{token.symbol}</strong>: ${token.value.toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }
}
