"use client"

import {
  MobulaExtendedToken,
  WeekAnalysisRecord,
} from "@/types/week-analysis.type"
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
  fetchAnalyses: () => Promise<void>
  getTokenSet: () => MobulaExtendedToken[]
}

const WeekAnalysisContext = createContext<WeekAnalysisContextProps>({
  weekAnalysesRecords: [],
  isLoading: false,
  error: null,
  fetchAnalyses: async () => {},
  getTokenSet: () => [],
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

  async function fetchAnalyses(): Promise<void> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/analysis`)
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

  function getTokenSet(): MobulaExtendedToken[] {
    if (!weekAnalysesRecords.length) return []

    const tokenById: Map<number, MobulaExtendedToken> = new Map()

    weekAnalysesRecords.forEach((record) => {
      record.analysis.results.forEach(({ token }) => {
        const tokenId = Number(token.token_id)

        if (!tokenById.has(tokenId)) {
          tokenById.set(tokenId, token)
        }
      })
    })

    return Array.from(tokenById.values()).sort(
      (a, b) => b.market_cap - a.market_cap
    )
  }

  const context: WeekAnalysisContextProps = {
    weekAnalysesRecords,
    isLoading,
    error,
    fetchAnalyses,
    getTokenSet,
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
