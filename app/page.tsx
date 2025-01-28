"use client"

import AnalysisTimeline from "@/components/analysis-timeline"
import TokenSummary from "@/components/token-summary-table/token-summary-table"
import { TokenSummarySkeleton } from "@/components/token-summary-table/token-summary-skeleton"
import { AnalysisTimelineSkeleton } from "@/components/analysis-timeline-skeleton"
import { Analyse } from "@/types/analysis.type"
import { useEffect, useState } from "react"

export default function Home() {
  const [analyses, setAnalyses] = useState<Analyse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/analysis")

        if (!response.ok) return

        const { data } = await response.json()
        setAnalyses(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  return (
    <div className="p-4 space-y-8">
      {isLoading ? (
        <>
          <TokenSummarySkeleton />
          <AnalysisTimelineSkeleton />
        </>
      ) : (
        <>
          <TokenSummary analyses={analyses} />
          <AnalysisTimeline analyses={analyses} />
        </>
      )}
    </div>
  )
}
