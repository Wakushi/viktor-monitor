import WeekAnalysisContextProvider from "@/stores/week-analysis.store"
import { WalletContextProvider } from "@/stores/wallet.store"
import { ReactNode } from "react"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WeekAnalysisContextProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </WeekAnalysisContextProvider>
  )
}
