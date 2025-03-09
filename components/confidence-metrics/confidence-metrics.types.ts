export interface ScatterDataPoint {
  token: string
  buyingConfidence: number
  percentageChange: number
  date: string
  price: number
  currentPrice: number
  priceChange: number
}

export interface AverageMetrics {
  avgConfidence: number
  avgPerformance: number
  positiveRate: number
  correlation: number
}

export interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: any
}

export const darkThemeTooltipStyle = {
  backgroundColor: "#1e1e1e",
  color: "#ffffff",
  border: "1px solid #333333",
  borderRadius: "4px",
  padding: "8px",
}
