"use client"

import { Analyse } from "@/types/analysis.type"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface AnalysisContextProviderProps {
  children: ReactNode
}

interface AnalysisContextProps {
  analyses: Analyse[]
  isLoading: boolean
  error: Error | null
}

const AnalysisContext = createContext<AnalysisContextProps>({
  analyses: [],
  isLoading: false,
  error: null,
})

export default function AnalysisContextProvider(
  props: AnalysisContextProviderProps
) {
  const [analyses, setAnalyses] = useState<Analyse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/analysis")
      const { data } = await response.json()
      setAnalyses(data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analyses")
      )
    } finally {
      setIsLoading(false)
    }
  }

  const context: AnalysisContextProps = {
    analyses,
    isLoading,
    error,
  }

  return (
    <AnalysisContext.Provider value={context}>
      {props.children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  return useContext(AnalysisContext)
}
