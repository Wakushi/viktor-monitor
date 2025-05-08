"use client"

import { useWeekAnalysis } from "@/stores/week-analysis.store"
import { format } from "date-fns"
import { ArrowRight, ExternalLink, RefreshCcw } from "lucide-react"

import { MobulaChain, MobulaExtendedToken } from "@/types/week-analysis.type"
import { getBlockExplorerTxUrl } from "@/lib/helpers"
import { Avatar, AvatarImage } from "./ui/avatar"
import { USDC_BASE } from "@/lib/constants"
import { useState } from "react"
import { Input } from "./ui/input"
import Loader from "./ui/loader"
import { useWallet } from "@/stores/wallet.store"
import { Button } from "./ui/button"

type SwapTx = {
  id: number
  chain: MobulaChain
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

function formatTokenAmount(amount: string, decimals: number) {
  if (!amount) return "-"
  const value = Number(BigInt(amount)) / 10 ** decimals
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
}

export function SwapHistory({ swaps }: Props) {
  const { getTokenSet, isLoading } = useWeekAnalysis()
  const { refreshSwaps } = useWallet()
  const [search, setSearch] = useState<string>("")

  const tokens: MobulaExtendedToken[] = getTokenSet()
  tokens.push(USDC_BASE)

  const tokenByAddress: Record<string, MobulaExtendedToken> = {}
  for (const token of tokens) {
    for (const contract of token.contracts) {
      tokenByAddress[contract.address.toLowerCase()] = token
    }
  }

  const filteredSwaps = swaps.filter((swap) => {
    const tokenIn = tokenByAddress[swap.token_in.toLowerCase()]
    const tokenOut = tokenByAddress[swap.token_out.toLowerCase()]
    const term = search.toLowerCase()

    return (
      tokenIn?.name?.toLowerCase().includes(term) ||
      tokenIn?.symbol?.toLowerCase().includes(term) ||
      tokenOut?.name?.toLowerCase().includes(term) ||
      tokenOut?.symbol?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="rounded-xl shadow-md bg-white dark:bg-zinc-900 p-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            Swap History
          </h2>
          <Button
            className="hover:bg-transparent bg-zinc-800"
            onClick={refreshSwaps}
          >
            <RefreshCcw className="text-white" />
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
      </div>
      <ul className="space-y-4 max-h-[300px] overflow-auto">
        {filteredSwaps.map((swap) => {
          const tokenIn = tokenByAddress[swap.token_in.toLowerCase()]
          const tokenOut = tokenByAddress[swap.token_out.toLowerCase()]
          const decimalsIn = tokenIn?.decimals ?? 18
          const decimalsOut = tokenOut?.decimals ?? 18

          return (
            <li
              key={swap.id}
              className="p-4 md:p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex flex-col gap-4 shadow-sm"
            >
              {/* Token swap row */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6">
                {/* Token In */}
                {isLoading ? (
                  <Loader />
                ) : (
                  <div className="flex items-center gap-3">
                    {tokenIn?.logo && (
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage src={tokenIn.logo} alt={tokenIn.symbol} />
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span className="text-base md:text-xl font-bold text-zinc-900 dark:text-white">
                        {formatTokenAmount(swap.amount_in, decimalsIn)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tokenIn?.symbol ?? "Unknown"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Arrow */}
                <div className="flex justify-center text-zinc-400 dark:text-zinc-500">
                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                </div>

                {/* Token Out */}
                {isLoading ? (
                  <Loader />
                ) : (
                  <div className="flex items-center gap-3 justify-end">
                    <div className="flex flex-col text-right">
                      <span className="text-base md:text-xl font-bold text-zinc-900 dark:text-white">
                        {formatTokenAmount(swap.amount_out, decimalsOut)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tokenOut?.symbol ?? "Unknown"}
                      </span>
                    </div>
                    {tokenOut?.logo && (
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage
                          src={tokenOut.logo}
                          alt={tokenOut.symbol}
                        />
                      </Avatar>
                    )}
                  </div>
                )}
              </div>

              {/* Footer row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-muted-foreground gap-2 md:gap-0">
                <span className="whitespace-nowrap">
                  {format(new Date(swap.created_at), "yyyy-MM-dd HH:mm:ss")}
                </span>
                <a
                  href={getBlockExplorerTxUrl(
                    swap.chain,
                    swap.transaction_hash
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on explorer
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
