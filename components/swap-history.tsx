"use client"

import { format } from "date-fns"
import { ArrowRight, ExternalLink } from "lucide-react"

type SwapTx = {
  id: number
  chain: string
  token_in: string
  token_out: string
  amount_in: string
  amount_out: string
  transaction_hash: string
  created_at: string
}

type Props = {
  swaps: SwapTx[]
}

function formatTokenAmount(amount: string) {
  if (!amount) return "-"
  const num = BigInt(amount)
  if (num > 10n ** 18n) return `${(Number(num) / 1e18).toFixed(4)} ETH`
  if (num > 10n ** 9n) return `${(Number(num) / 1e9).toFixed(2)} Gwei`
  return num.toString()
}

function explorerUrl(chain: string, txHash: string) {
  switch (chain.toLowerCase()) {
    case "base":
      return `https://basescan.org/tx/${txHash}`
    default:
      return "#"
  }
}

export function SwapHistory({ swaps }: Props) {
  return (
    <div className="rounded-xl shadow-md bg-white dark:bg-zinc-900 p-4">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
        Swap History
      </h2>
      <ul className="space-y-4">
        {swaps.map((swap) => (
          <li
            key={swap.id}
            className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-500">
                  #{swap.id}
                </span>
                <span className="text-zinc-800 dark:text-zinc-100 font-medium">
                  {formatTokenAmount(swap.amount_in)}
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-800 dark:text-zinc-100 font-medium">
                  {formatTokenAmount(swap.amount_out)}
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                {format(new Date(swap.created_at), "yyyy-MM-dd HH:mm:ss")}
              </div>
            </div>
            <a
              href={explorerUrl(swap.chain, swap.transaction_hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
