"use client"
import HistoricalAnalysisSkeleton from "@/components/historical-analysis-skeleton"
import { TokenSearchTable } from "@/components/token-list"
import { useWeekAnalysis } from "@/stores/week-analysis.store"

export default function TokenPage() {
  const { getTokenSet, isLoadingAll } = useWeekAnalysis()

  if (isLoadingAll) {
    return <HistoricalAnalysisSkeleton />
  }

  const tokens = getTokenSet()

  return (
    <div className="py-6 md:px-20">
      <TokenSearchTable tokens={tokens} />
    </div>
  )
}
