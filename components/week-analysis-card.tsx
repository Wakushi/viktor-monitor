"use client"

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowUp, ArrowDown, Globe, Copy, Blocks } from "lucide-react"
import {
  TokenPerformance,
  WeekAnalysisRecord,
} from "@/types/week-analysis.type"
import { FaXTwitter } from "react-icons/fa6"
import FearGreedBadge from "./fear-and-greed-badge"
import { getBlockExplorerUrl } from "@/lib/helpers"

export default function WeeklyAnalysisCard({
  record,
}: {
  record: WeekAnalysisRecord
}) {
  function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
  }

  function getPerformance(tokenName: string): TokenPerformance | null {
    if (!record.performance) return null

    const performance = record.performance.find((t) => t.token === tokenName)

    return performance ?? null
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>
              Analysis record ({record.analysis.formattedResults.length}{" "}
              results)
            </CardTitle>
            <CardDescription className="mt-1">
              {new Date(record.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </div>
          {record.fear_and_greed_index && (
            <FearGreedBadge
              fearAndGreedIndex={Number(record.fear_and_greed_index)}
            />
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-6 space-y-6 max-h-[700px] overflow-scroll">
        {record.analysis.results.map((res, i) => (
          <Card key={res.token.key + i} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={res.token.logo} alt={res.token.name} />
                  <AvatarFallback>
                    {res.token.symbol.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {res.token.name}
                    <span className="text-muted-foreground ml-2">
                      {res.token.symbol}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Initial Price
                    </p>
                    <p className="text-lg font-semibold">
                      ${res.token.price.toFixed(10)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-lg font-semibold">
                      ${Math.round(res.token.market_cap).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {getPerformance(res.token.name) && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        24h Change
                      </p>
                      <div className="flex items-center gap-1">
                        {getPerformance(res.token.name)?.percentageChange! >=
                        0 ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-lg font-semibold ${
                            getPerformance(res.token.name)?.percentageChange! >=
                            0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {getPerformance(
                            res.token.name
                          )?.percentageChange.toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Volume (24h)
                    </p>
                    <p className="text-lg font-semibold">
                      ${Math.round(res.token.volume).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {getPerformance(res.token.name) && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Price at T+24h
                      </p>
                      <div className="flex items-center gap-1">
                        {getPerformance(res.token.name)?.percentageChange! >=
                        0 ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-lg font-semibold ${
                            getPerformance(res.token.name)?.percentageChange! >=
                            0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {getPerformance(
                            res.token.name
                          )?.currentPrice!.toFixed(10)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-lg font-semibold text-blue-500">
                      {(res.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-4">
                  {res.token.extra?.website && (
                    <a
                      href={res.token.extra.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-white hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {res.token.extra?.twitter && (
                    <a
                      href={res.token.extra.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-white hover:underline"
                    >
                      <FaXTwitter className="h-4 w-4" />
                      <span>@{res.token.extra.twitter.split("/")[3]}</span>
                    </a>
                  )}
                </div>

                {res.token.contracts?.length && (
                  <div className="text-sm flex flex-col gap-2">
                    {res.token.contracts.map(
                      ({ address, blockchain }, index) => (
                        <div
                          key={address + index}
                          className="flex items-center gap-2 justify-between"
                        >
                          <a
                            href={getBlockExplorerUrl(blockchain, address)}
                            target="_blank"
                            className="flex items-center gap-1 hover:underline"
                          >
                            <Blocks size={18} />
                            <span>{blockchain}</span>
                          </a>
                          <div className="bg-muted flex items-center gap-2 px-3 py-2 rounded-md overflow-x-auto">
                            <code className="text-xs break-all">{address}</code>
                            <Copy
                              size={12}
                              onClick={() => copyToClipboard(address)}
                              className="cursor-pointer opacity-70 hover:opacity-100"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
