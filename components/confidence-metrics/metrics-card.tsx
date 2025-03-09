import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AverageMetrics } from "./confidence-metrics.types"

interface MetricsCardsProps {
  averageMetrics: AverageMetrics | null
}

export default function MetricsCards({ averageMetrics }: MetricsCardsProps) {
  if (!averageMetrics) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Average Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageMetrics.avgConfidence.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Average Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              averageMetrics.avgPerformance > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {averageMetrics.avgPerformance.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Positive Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageMetrics.positiveRate.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Confidence-Performance Correlation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              averageMetrics.correlation > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {averageMetrics.correlation.toFixed(4)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
