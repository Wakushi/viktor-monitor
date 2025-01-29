import React, { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import type { Analyse, Token } from "@/types/analysis.type"
import type { DateRange } from "react-day-picker"
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { columns, TokenStats } from "./columns"
import { CoinCodexBaseTokenData } from "@/types/coin-codex.type"

interface TokenSummaryProps {
  analyses: Analyse[]
}

export default function TokenSummaryTable({ analyses }: TokenSummaryProps) {
  const [tokensInfo, setTokenInfo] = useState<CoinCodexBaseTokenData[]>([])
  const [topCount, setTopCount] = useState<number>(10)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: "averageConfidence", desc: true },
  ])

  useEffect(() => {
    if (!analyses || !analyses.length) return

    fetchTokensInfo()
  }, [analyses])

  const tokenStats = useMemo(() => {
    const filteredAnalyses = analyses.filter((analysis) => {
      if (!dateRange?.from || !dateRange?.to) return true
      const analysisDate = new Date(analysis.created_at)
      return analysisDate >= dateRange.from && analysisDate <= dateRange.to
    })

    const statsMap = new Map<string, TokenStats>()
    const tokenInfoMap = new Map<string, Token>()

    filteredAnalyses.forEach((analysis) => {
      analysis.analysis.analysis.forEach((a) => {
        if (!tokenInfoMap.get(a.token.metadata.name)) {
          tokenInfoMap.set(a.token.metadata.name, a.token)
        }
      })

      analysis.analysis.formattedResults.forEach((result) => {
        const existing = statsMap.get(result.token)
        const confidence = parseFloat(result.buyingConfidence.replace("%", ""))

        if (existing) {
          existing.occurrences += 1
          existing.averageConfidence =
            (existing.averageConfidence * (existing.occurrences - 1) +
              confidence) /
            existing.occurrences
          existing.latestPrice = result.price
          existing.lastSeen = analysis.created_at
        } else {
          const token = tokenInfoMap.get(result.token)

          if (!token) return

          // const performance = checkTokenPerformance(token)

          statsMap.set(result.token, {
            token,
            occurrences: 1,
            averageConfidence: confidence,
            latestPrice: result.price,
            firstSeen: analysis.created_at,
            lastSeen: analysis.created_at,
          })
        }
      })
    })

    return Array.from(statsMap.values()).slice(0, topCount)
  }, [analyses, topCount, dateRange])

  const table = useReactTable({
    data: tokenStats,
    columns: columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  async function fetchTokensInfo() {
    const response = await fetch("/api/tokens")

    if (!response.ok) return

    const { data } = await response.json()

    setTokenInfo(data)
  }

  // function checkTokenPerformance(token: Token) {
  //   const lowercasedName = token.metadata.name.toLowerCase()
  //   const lowercasedNameVariant = lowercasedName.replaceAll(" ", "-")
  //   const lowercasedId = token.metadata.id.toLowerCase()
  //   const lowercasedIdVariant = lowercasedId.replaceAll(" ", "-")

  //   const matchingToken = tokensInfo.find((tokenInfo) => {
  //     const possibleMatches = [
  //       tokenInfo.ccu_slug.toLowerCase(),
  //       tokenInfo.name.toLowerCase(),
  //       tokenInfo.shortname.toLowerCase(),
  //       tokenInfo.symbol.toLowerCase(),
  //       tokenInfo.display_symbol.toLowerCase(),
  //       tokenInfo.aliases.toLowerCase(),
  //       tokenInfo.name.toLowerCase(),
  //     ]

  //     return (
  //       possibleMatches.includes(lowercasedId) ||
  //       possibleMatches.includes(lowercasedIdVariant) ||
  //       possibleMatches.includes(lowercasedName) ||
  //       possibleMatches.includes(lowercasedNameVariant)
  //     )
  //   })

  //   const initialPrice = token.market.price_usd
  //   const currentPrice = matchingToken?.last_price_usd || 0
  //   const priceChange = currentPrice - initialPrice

  //   const performance = {
  //     token: token.metadata.name,
  //     initialPrice: token.market.price_usd,
  //     currentPrice: matchingToken?.last_price_usd || 0,
  //     priceChange: currentPrice - initialPrice,
  //     percentageChange: (priceChange / initialPrice) * 100,
  //   }

  //   return performance
  // }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <CardTitle className="text-2xl">Token Performance Summary</CardTitle>
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Top
              </span>
              <Input
                type="number"
                min={1}
                max={100}
                value={topCount}
                onChange={(e) => setTopCount(parseInt(e.target.value) || 10)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                tokens
              </span>
            </div>
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
