import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  CustomTooltipProps,
  ScatterDataPoint,
} from "./confidence-metrics.types"

interface PerformanceScatterPlotProps {
  scatterData: ScatterDataPoint[]
}

export default function PerformanceScatterPlot({
  scatterData,
}: PerformanceScatterPlotProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buying Confidence vs Performance</CardTitle>
        <CardDescription>
          Each point represents a token analysis. The X-axis shows the buying
          confidence, while the Y-axis shows the actual performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="buyingConfidence"
                name="Buying Confidence"
                unit="%"
                domain={[60, 100]}
              />
              <YAxis
                type="number"
                dataKey="percentageChange"
                name="Performance"
                unit="%"
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Tokens"
                data={scatterData}
                fill="#8884d8"
                shape="circle"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ScatterDataPoint
    return (
      <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow text-sm text-white">
        <p className="font-bold">{data.token}</p>
        <p>Date: {data.date}</p>
        <p>Buying Confidence: {data.buyingConfidence.toFixed(2)}%</p>
        <p>Performance: {data.percentageChange.toFixed(2)}%</p>
        <p>Initial Price: ${data.price.toFixed(6)}</p>
        <p>Current Price: ${data.currentPrice.toFixed(6)}</p>
      </div>
    )
  }
  return null
}
