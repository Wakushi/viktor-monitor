import WeekAnalysisContextProvider from "@/stores/week-analysis.store"
import { ReactNode } from "react"

export default function Providers({ children }: { children: ReactNode }) {
  return <WeekAnalysisContextProvider>{children} </WeekAnalysisContextProvider>
}
