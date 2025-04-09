"use client"

import AnalysisTimeline from "@/components/analysis-timeline"
import TokenSummary from "@/components/token-summary-table/token-summary-table"
import { TokenSummarySkeleton } from "@/components/token-summary-table/token-summary-skeleton"
import { AnalysisTimelineSkeleton } from "@/components/analysis-timeline-skeleton"
import { useAnalysis } from "@/stores/analysis.store"

export default function Home() {
  const { analyses, isLoading, fromCloud } = useAnalysis()

  return (
    <div className="p-4 space-y-8">
      {isLoading ? (
        <>
          {!fromCloud && <TokenSummarySkeleton />}
          <AnalysisTimelineSkeleton />
        </>
      ) : (
        <>
          {!fromCloud && <TokenSummary analyses={analyses} />}
          <AnalysisTimeline analyses={analyses} />
        </>
      )}
    </div>
  )
}
