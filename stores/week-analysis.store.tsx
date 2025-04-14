"use client"

import { WeekAnalysisRecord } from "@/types/week-analysis.type"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface WeekAnalysisContextProviderProps {
  children: ReactNode
}

interface WeekAnalysisContextProps {
  weekAnalysesRecords: WeekAnalysisRecord[]
  isLoading: boolean
  error: Error | null
}

const WeekAnalysisContext = createContext<WeekAnalysisContextProps>({
  weekAnalysesRecords: [],
  isLoading: false,
  error: null,
})

export default function WeekAnalysisContextProvider(
  props: WeekAnalysisContextProviderProps
) {
  const [weekAnalysesRecords, setWeekAnalysesRecords] = useState<
    WeekAnalysisRecord[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/week-analysis`)
      const { data } = await response.json()

      setWeekAnalysesRecords(data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analyses")
      )
    } finally {
      setIsLoading(false)
    }
  }

  const context: WeekAnalysisContextProps = {
    weekAnalysesRecords,
    isLoading,
    error,
  }

  return (
    <WeekAnalysisContext.Provider value={context}>
      {props.children}
    </WeekAnalysisContext.Provider>
  )
}

export function useWeekAnalysis() {
  return useContext(WeekAnalysisContext)
}
