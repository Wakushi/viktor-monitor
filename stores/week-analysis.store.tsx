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
  isLoadingAll: boolean
  error: Error | null
  fetchAnalyses: () => Promise<void>
  getTokenSet: () => MobulaExtendedToken[]
  loadMore: () => void
  page: number
  fetchedAll: boolean
}

const WeekAnalysisContext = createContext<WeekAnalysisContextProps>({
  weekAnalysesRecords: [],
  isLoading: false,
  isLoadingAll: false,
  error: null,
  fetchAnalyses: async () => {},
  getTokenSet: () => [],
  loadMore: () => {},
  page: 1,
  fetchedAll: false,
})

export default function WeekAnalysisContextProvider(
  props: WeekAnalysisContextProviderProps
) {
  const [weekAnalysesRecords, setWeekAnalysesRecords] = useState<
    WeekAnalysisRecord[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState<number>(1)
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [fetchedAll, setFetchedAll] = useState<boolean>(false)

  useEffect(() => {
    fetchAllAnalyses()
  }, [])

  useEffect(() => {
    fetchAnalyses()
  }, [page])

  async function fetchAnalyses(): Promise<void> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/analysis?page=${page}&limit=10`)
      const { data } = await response.json()

      if (fetchedAll) return

      setWeekAnalysesRecords((prevData) => [...prevData, ...data])
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analyses")
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchAllAnalyses(): Promise<void> {
    setIsLoadingAll(true)

    try {
      const response = await fetch(`/api/analysis?page=1&limit=${999}`)
      const { data } = await response.json()

      setFetchedAll(true)
      setWeekAnalysesRecords(data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analyses")
      )
    } finally {
      setIsLoadingAll(false)
    }
  }

  function loadMore(): void {
    setPage((prevPage) => prevPage + 1)
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
    loadMore,
    page,
    fetchedAll,
    isLoadingAll,
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
