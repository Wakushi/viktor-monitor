"use client"
import HistoricalAnalysisSkeleton from "@/components/historical-analysis-skeleton"
import { TokenSearchTable } from "@/components/token-list"
import { useWeekAnalysis } from "@/stores/week-analysis.store"

export default function TokenPage() {
  const { isLoading, getTokenSet } = useWeekAnalysis()

  if (isLoading) {
    return <HistoricalAnalysisSkeleton />
  }

  const tokens = getTokenSet()

  return (
    <div className="py-6 px-20">
      <TokenSearchTable tokens={tokens} />
    </div>
  )
}
