"use client"

import { useWeekAnalysis } from "@/stores/week-analysis.store"
import HistoricalAnalysisSkeleton from "@/components/historical-analysis-skeleton"
import WeeklyAnalysisCard from "@/components/week-analysis-card"

export default function WeeklyPage() {
  const { isLoading, weekAnalysesRecords } = useWeekAnalysis()

  if (isLoading) {
    return <HistoricalAnalysisSkeleton />
  }

  return (
    <div className="py-6 px-4 sm:px-6 md:px-10 lg:px-20 space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold">Analyses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {weekAnalysesRecords.map((record) => (
          <WeeklyAnalysisCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}
