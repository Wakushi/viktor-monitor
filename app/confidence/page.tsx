"use client"
import React, { useState, useEffect } from "react"
import {
  AverageMetrics,
  ScatterDataPoint,
} from "@/components/confidence-metrics/confidence-metrics.types"
import { processAnalysisData } from "@/components/confidence-metrics/utils"
import MetricsCards from "@/components/confidence-metrics/metrics-card"
import PerformanceScatterPlot from "@/components/confidence-metrics/performance-scatter-plot"
import ConfidenceBracketChart from "@/components/confidence-metrics/confidence-bracket-chart"
import HistoricalAnalysisSkeleton from "@/components/historical-analysis-skeleton"
import { useAnalysis } from "@/stores/analysis.store"

export default function CryptoPerformanceDashboard() {
  const [scatterData, setScatterData] = useState<ScatterDataPoint[]>([])
  const [averageMetrics, setAverageMetrics] = useState<AverageMetrics | null>(
    null
  )
  const { analyses, isLoading } = useAnalysis()

  useEffect(() => {
    if (!analyses || analyses.length === 0) return

    const { processedScatterData, calculatedMetrics } =
      processAnalysisData(analyses)

    setScatterData(processedScatterData)
    setAverageMetrics(calculatedMetrics)
  }, [analyses])

  if (isLoading) {
    return <HistoricalAnalysisSkeleton />
  }

  return (
    <div className="w-full space-y-6 p-4">
      <MetricsCards averageMetrics={averageMetrics} />

      <PerformanceScatterPlot scatterData={scatterData} />

      <ConfidenceBracketChart scatterData={scatterData} />
    </div>
  )
}
