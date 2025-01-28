import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Clock } from "lucide-react"
import { Analyse } from "@/types/analysis.type"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return "bg-green-500/10 text-green-500"
  if (confidence >= 70) return "bg-yellow-500/10 text-yellow-500"
  return "bg-blue-500/10 text-blue-500"
}

export default function AnalysisTimeline({
  analyses,
}: {
  analyses: Analyse[]
}) {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Viktor Analysis History</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Last Update:{" "}
          {formatDate(analyses[0]?.created_at || new Date().toISOString())}
        </Badge>
      </div>

      <div className="space-y-6">
        {analyses.map((analysis) => (
          <Card key={analysis.id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Analysis Run - {formatDate(analysis.created_at)}
                </CardTitle>
                <Badge variant="outline">
                  {analysis.analysis.formattedResults.length} Tokens Selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 p-1">
                  {analysis.analysis.formattedResults.map((result, index) => {
                    const confidence = parseFloat(
                      result.buyingConfidence.replace("%", "")
                    )
                    return (
                      <Card key={index} className="w-[200px] flex-shrink-0">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span
                                className="font-medium truncate"
                                title={result.token}
                              >
                                {result.token}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Price:
                              </span>
                              <span className="font-mono">{result.price}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Confidence:
                              </span>
                              <Badge
                                variant="secondary"
                                className={`flex items-center gap-1 ${getConfidenceColor(
                                  confidence
                                )}`}
                              >
                                <TrendingUp className="h-3 w-3" />
                                {result.buyingConfidence}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
