"use client"

import { useWeekAnalysis } from "@/stores/week-analysis.store"
import HistoricalAnalysisSkeleton from "@/components/historical-analysis-skeleton"
import WeeklyAnalysisCard from "@/components/week-analysis-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function WeeklyPage() {
  const { isLoading, weekAnalysesRecords, loadMore, page, fetchedAll } =
    useWeekAnalysis()

  if (isLoading && page === 1) {
    return <HistoricalAnalysisSkeleton />
  }

  return (
    <div className="py-8 px-4 sm:px-6 md:px-10 lg:px-20 space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold">Analyses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {weekAnalysesRecords
          .filter((analyse) => !analyse.test)
          .map((record) => (
            <WeeklyAnalysisCard key={record.id} record={record} />
          ))}
      </div>
      {!fetchedAll && (
        <div className="w-full flex justify-center">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
