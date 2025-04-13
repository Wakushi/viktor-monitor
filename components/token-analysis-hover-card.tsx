"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Card, CardContent } from "@/components/ui/card"
import { TokenAnalysis } from "@/types/analysis.type"
import { Avatar, AvatarImage } from "./ui/avatar"
import { ReactNode } from "react"
import { ExternalLink } from "lucide-react"

interface TokenHoverCardProps {
  analysis?: TokenAnalysis
  children: ReactNode
}

export default function TokenHoverCard({
  analysis,
  children,
}: TokenHoverCardProps) {
  if (!analysis) return

  const { token, buyingConfidence, similarDecisionsAmount, decisionTypeRatio } =
    analysis

  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <span className="text-primary">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] p-4 shadow-xl border rounded-2xl">
        <Card className="border-none shadow-none">
          <CardContent className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={token.logo} alt={token.name} />
              </Avatar>
              <div>
                <p className="text-lg font-semibold">
                  {token.name} ({token.symbol.toUpperCase()})
                </p>
                <p className="text-sm text-muted-foreground">
                  Rank #{token.rank ?? "N/A"} · ${token.price.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Buy/Sell Ratio</p>
                <p className="font-medium">
                  {decisionTypeRatio.buyCount} / {decisionTypeRatio.sellCount}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg. Profit</p>
                <p className="font-medium">
                  {decisionTypeRatio.averageProfitPercent.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Confidence Score</p>
                <p className="font-medium">
                  {(buyingConfidence.score * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Similar Cases</p>
                <p className="font-medium">{similarDecisionsAmount}</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Sample Confidence:{" "}
              {(buyingConfidence.sampleSizeConfidence * 100).toFixed(1)}%
            </div>

            {(token.contracts.length > 0 || token.extra) && (
              <div className="mt-2 space-y-2 text-sm">
                {token.contracts.length > 0 && (
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">
                      Contracts:
                    </p>
                    <ul className="list-inside space-y-1">
                      {token.contracts.map((c, i) => (
                        <li key={i} className="truncate">
                          <a
                            href={`https://etherscan.io/address/${c.address}`}
                            className="text-primary underline flex items-center space-x-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>
                              {c.address.slice(0, 6)}...{c.address.slice(-4)}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {token.extra && (
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">
                      Socials:
                    </p>
                    <ul className="space-y-1">
                      {token.extra.website && (
                        <li>
                          <a
                            href={token.extra.website}
                            className="text-primary underline flex items-center space-x-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      )}
                      {token.extra.twitter && (
                        <li>
                          <a
                            href={`https://twitter.com/${token.extra.twitter}`}
                            className="text-primary underline flex items-center space-x-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Twitter</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  )
}
