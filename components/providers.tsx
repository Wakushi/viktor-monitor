import AnalysisContextProvider from "@/stores/analysis.store"
import { ReactNode } from "react"

export default function Providers({ children }: { children: ReactNode }) {
  return <AnalysisContextProvider>{children}</AnalysisContextProvider>
}
