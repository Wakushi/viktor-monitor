"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import {
  ScatterDataPoint,
  darkThemeTooltipStyle,
} from "./confidence-metrics.types"

interface ConfidenceBracketChartProps {
  scatterData: ScatterDataPoint[]
}

export default function ConfidenceBracketChart({
  scatterData,
}: ConfidenceBracketChartProps) {
  const processSinglePercentageBrackets = (data: ScatterDataPoint[]) => {
    const brackets: {
      [key: number]: { sum: number; count: number; tokens: string[] }
    } = {}

    for (let i = 0; i <= 100; i++) {
      brackets[i] = { sum: 0, count: 0, tokens: [] }
    }

    data.forEach((item) => {
      const percentageKey = Math.round(item.buyingConfidence)
      if (brackets[percentageKey]) {
        brackets[percentageKey].sum += item.percentageChange
        brackets[percentageKey].count += 1
        brackets[percentageKey].tokens.push(item.token)
      }
    })

    const result = Object.entries(brackets)
      .map(([percentage, stats]) => ({
        percentage: parseInt(percentage),
        avgPerformance:
          stats.count > 0
            ? parseFloat((stats.sum / stats.count).toFixed(2))
            : 0,
        count: stats.count,
        tokens: stats.tokens,
      }))
      .filter((bracket) => bracket.count > 0)
      .sort((a, b) => a.percentage - b.percentage)

    return result
  }

  const singlePercentageBrackets = processSinglePercentageBrackets(scatterData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Individual Confidence Percentage</CardTitle>
        <CardDescription>
          Shows the average performance for each individual percentage point of
          buying confidence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={singlePercentageBrackets}
              margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="percentage"
                label={{
                  value: "Confidence (%)",
                  position: "insideBottom",
                  offset: -10,
                  style: { fill: "#fff" },
                }}
              />
              <YAxis
                tickFormatter={(value) => value.toFixed(2)}
                label={{
                  value: "Avg Performance (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#fff" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Number of Tokens",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "#fff" },
                }}
              />
              <ReferenceLine y={0} stroke="#666" strokeWidth={1} />
              <Tooltip
                contentStyle={darkThemeTooltipStyle}
                formatter={(value: number, name: string, props: any) => {
                  if (name === "avgPerformance") {
                    return [`${value.toFixed(2)}%`, "Avg Performance"]
                  }
                  if (name === "count") {
                    return [value, "Number of Tokens"]
                  }
                  return [value, name]
                }}
                labelFormatter={(value: number) => `Confidence: ${value}%`}
              />
              <Bar
                dataKey="avgPerformance"
                fill="#82ca9d"
                name="Avg Performance"
              />
              <Bar
                dataKey="count"
                fill="#8884d8"
                name="Number of Tokens"
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
