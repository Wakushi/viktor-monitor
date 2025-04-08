import TokenAnalyticsDashboard from "@/components/mobula/srg20-chart"
import HistoricPriceChart from "@/components/mobula/surge-history"

export default async function HistoryPage() {
  const token = "0xCD2eaFb04B464aF21D141D76647A28F6F298842f"

  const ETH_CHAIN = "ETHEREUM"
  const BSC_CHAIN = "BSC"

  const srgResponse = await fetch(
    `http://localhost:3001/token/srg/${ETH_CHAIN}`
  )
  const srgData = await srgResponse.json()

  const srg20Response = await fetch(`http://localhost:3001/token/${token}`)
  const srg20Data = await srg20Response.json()

  return (
    <div>
      <HistoricPriceChart data={srgData} />
      <TokenAnalyticsDashboard data={srg20Data} />
    </div>
  )
}

export const SRG20_ETH_CONTRACTS = [
  "0x4E6908fC4Fb8E97222f694Dc92B71743f615B2e9",
  "0x4ceaCF951294f78bde6B51863aF8fDC03d54728e",
  "0xCD2eaFb04B464aF21D141D76647A28F6F298842f",
  "0xF654d4C3CC334324ad474A0d5d3708dCA4c1CB25",
  "0x14385F19f3fBA81A4F8186e2d1e146AAE3150dF4",
  "0x2225c9764fE39001C7cb1CBdE25a3443D5cAED7B",
]
