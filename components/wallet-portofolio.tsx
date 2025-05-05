"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Loader2 } from "lucide-react"
import clsx from "clsx"

const API_URL = `https://api.mobula.io/api/1/wallet/portfolio?wallet=0x82e931E5958234331c21D155331eE6C3048a3935`

export function WalletPortfolio() {
  const [assets, setAssets] = useState<MobulaAssetEntry[]>([])
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: MobulaPortfolioResponse) => {
        setAssets(
          data.data.assets
            .filter((asset) => asset.token_balance)
            .sort((a, b) => b.allocation - a.allocation)
        )
        setTotalBalance(data.data.total_wallet_balance)
      })
      .catch((err) => console.error("Failed to load wallet portfolio:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-full h-full p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-md space-y-4">
      <div className="text-lg font-semibold text-zinc-700 dark:text-zinc-100">
        Wallet Portfolio
      </div>
      <div className="text-sm text-muted-foreground">
        Total Balance: ${totalBalance.toFixed(2)}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-auto max-h-[70vh] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((token) => {
                const muted = token.estimated_balance === 0
                return (
                  <TableRow
                    key={token.asset.id}
                    className={clsx({
                      "opacity-40": muted,
                    })}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage
                            src={token.asset.logo}
                            alt={token.asset.symbol}
                          />
                        </Avatar>
                        <div>
                          <div className="font-medium">{token.asset.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {token.asset.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {token.token_balance.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      ${token.price.toFixed(8)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${token.estimated_balance.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {token.allocation.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
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
    decimals: string[] // Usually ["18"]
    contracts: string[]
    blockchains: string[]
  }
  price: number
  price_change_24h: number
  estimated_balance: number
  token_balance: number
  allocation: number
}
