"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import clsx from "clsx"
import { Balance, useWallet } from "@/stores/wallet.store"
import { Button } from "./ui/button"
import { RefreshCcw } from "lucide-react"

interface WalletPortfolioProps {
  assets: Balance[]
}

export function WalletPortfolio({ assets }: WalletPortfolioProps) {
  const { refreshPortfolio } = useWallet()

  const totalBalance = assets.reduce((prev, curr) => prev + curr.value, 0)

  return (
    <div className="w-full h-full p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-md space-y-4">
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold text-zinc-700 dark:text-zinc-100">
          Wallet Portfolio
        </div>
        <Button
          className="hover:bg-transparent bg-zinc-800"
          onClick={refreshPortfolio}
        >
          <RefreshCcw className="text-white" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Total Balance: ${totalBalance.toFixed(2)}
      </div>

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
            {assets.map(({ token, balance, allocation, price, value }) => {
              const muted = balance === 0
              return (
                <TableRow
                  key={token.token_id}
                  className={clsx({
                    "opacity-40": muted,
                  })}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={token.logo} alt={token.symbol} />
                      </Avatar>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {balance.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(price ?? 0).toFixed(8)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(value ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {(allocation ?? 0).toFixed(2)}%
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
