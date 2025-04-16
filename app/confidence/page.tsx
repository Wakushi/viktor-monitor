"use client"
import ConfidenceBracketChart from "@/components/confidence-metrics/confidence-bracket-chart"
import MetricsCards from "@/components/confidence-metrics/metrics-card"
import PerformanceScatterPlot from "@/components/confidence-metrics/performance-scatter-plot"
import { processAnalysisData } from "@/components/confidence-metrics/utils"
import HistoricalAnalysisSkeleton from "@/components/historical-analysis-skeleton"
import { useWeekAnalysis } from "@/stores/week-analysis.store"
import { useState } from "react"

export default function ConfidencePage() {
  const { isLoading, weekAnalysesRecords } = useWeekAnalysis()
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(50)

  const { processedScatterData, calculatedMetrics } = processAnalysisData(
    weekAnalysesRecords,
    minConfidenceFilter
  )

  if (isLoading) return <HistoricalAnalysisSkeleton />

  return (
    <div>
      <MetricsCards
        averageMetrics={calculatedMetrics}
        minConfidenceFilter={minConfidenceFilter}
        setMinConfidenceFilter={setMinConfidenceFilter}
      />
      <PerformanceScatterPlot scatterData={processedScatterData} />
      <ConfidenceBracketChart scatterData={processedScatterData} />
    </div>
  )
}
