"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Clock,
  RefreshCcw,
} from "lucide-react"
import { AlertDescription } from "@/components/ui/alert"
import type { Analyse } from "@/types/analysis.type"

export default function HistoricalAnalysis() {
  const [analyses, setAnalyses] = useState<Analyse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHistoricalAnalyses()
  }, [])

  async function fetchHistoricalAnalyses() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/analysis")
      const { data } = await response.json()

      const twelveHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000)

      const filteredAnalyses = data.filter(
        (analysis: Analyse) => new Date(analysis.created_at) < twelveHoursAgo
      )

      setAnalyses(filteredAnalyses)
    } catch (error) {
      console.error("Failed to fetch historical analyses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function getElapsedTime(analysis: Analyse) {
    const elapsedTime = Date.now() - new Date(analysis.created_at).getTime()
    return Math.floor(elapsedTime / (60 * 60 * 1000))
  }

  if (isLoading) {
    return <HistoricalAnalysisSkeleton />
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historical Analysis Performance</h1>
        <Button onClick={fetchHistoricalAnalyses}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {analyses.length === 0 ? (
        <div className="flex items-center gap-2 border rounded-md p-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No historical analyses found that are older than 12 hours.
          </AlertDescription>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="h-[400px] overflow-scroll">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  Analysis from {new Date(analysis.created_at).toLocaleString()}{" "}
                  ({getElapsedTime(analysis)}h ago)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="space-y-4">
                    {analysis.analysis.formattedResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{result.token}</p>
                            <p className="text-sm text-muted-foreground">
                              Initial Price: {result.price}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            Confidence: {result.buyingConfidence}
                          </Badge>
                        </div>

                        {analysis.performance && (
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">
                                Current: $
                                {analysis.performance[
                                  index
                                ].currentPrice?.toFixed(6)}
                              </p>
                              <div className="flex items-center justify-end">
                                {analysis.performance[index].percentageChange >=
                                0 ? (
                                  <>
                                    <ArrowUp className="h-4 w-4 text-green-500" />
                                    <span className="text-green-500">
                                      +
                                      {analysis.performance[
                                        index
                                      ].percentageChange?.toFixed(2)}
                                      %
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowDown className="h-4 w-4 text-red-500" />
                                    <span className="text-red-500">
                                      {analysis.performance[
                                        index
                                      ].percentageChange?.toFixed(2)}
                                      %
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function HistoricalAnalysisSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
