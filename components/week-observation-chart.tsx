"use client"
import React, { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts"

export type WeekObservation = {
  id: string
  token_name: string
  start_date: string
  end_date: string
  observation_text: string
  raw_ohlcv_window: string
  next_day_close: number
  next_day_change: number
  outcome: string | null
  created_at: string
}

type DailyOHLCV = {
  Start: string
  End: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
  "Market Cap": number
}

export type SimilarWeekObservation = WeekObservation & {
  similarity: number
}

interface Props {
  metrics: DailyOHLCV[]
  similarConditions: SimilarWeekObservation[]
}

const getNormalizedPrices = (ohlcv: DailyOHLCV[]): number[] => {
  const base = ohlcv[0]?.Close || 1
  return ohlcv.map((day) => ((day.Close - base) / base) * 100)
}

const COLORS: Record<string, string> = {
  bullish: "#22c55e",
  bearish: "#ef4444",
  neutral: "#a1a1aa",
}

const WeeklyNormalizedChart: React.FC<Props> = ({
  metrics,
  similarConditions,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const candidateChange = getNormalizedPrices(metrics)

  const data = Array.from({ length: 7 }).map((_, i) => {
    const entry: any = { name: `Day ${i + 1}`, Candidate: candidateChange[i] }

    similarConditions.forEach((sim, index) => {
      const parsedWindow: DailyOHLCV[] = JSON.parse(sim.raw_ohlcv_window)
      const changes = getNormalizedPrices(parsedWindow)
      entry[`Sim ${index + 1}`] = changes[i]
    })

    return entry
  })

  const getColor = (outcome: string | null): string => {
    return outcome ? COLORS[outcome] || COLORS.neutral : COLORS.neutral
  }

  return (
    <div className="w-full h-[500px] bg-black p-4 rounded-xl">
      <h2 className="text-white text-lg mb-4">
        Weekly Similarity Trends (Normalized % Change)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis
            stroke="#fff"
            tickFormatter={(v) => `${v.toFixed(1)}%`}
            domain={["auto", "auto"]}
          >
            <Label
              value="% Change from Day 1"
              angle={-90}
              position="insideLeft"
              style={{ fill: "white" }}
            />
          </YAxis>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)}%`,
              name,
            ]}
            labelStyle={{ color: "white" }}
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: "white", cursor: "pointer" }}
            onClick={(e: any) => {
              const label = e.dataKey as string
              const index = parseInt(label.split(" ")[1], 10) - 1
              setHighlightedIndex(index === highlightedIndex ? null : index)
            }}
            formatter={(value: string) => {
              if (value === "Candidate") return "⚪ Candidate"
              const index = parseInt(value.split(" ")[1], 10) - 1
              const sim = similarConditions[index]
              return `${value} (${sim.similarity.toFixed(2)}, ${sim.outcome})`
            }}
          />
          <Line
            type="monotone"
            dataKey="Candidate"
            stroke="#fff"
            strokeWidth={2}
            dot={false}
          />
          {similarConditions.map((sim, index) => {
            const isHighlighted =
              highlightedIndex === null || highlightedIndex === index
            return (
              <Line
                key={index}
                type="monotone"
                dataKey={`Sim ${index + 1}`}
                stroke={getColor(sim.outcome)}
                dot={false}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHighlighted ? 1 : 0.2}
                strokeDasharray={highlightedIndex === index ? undefined : "4 2"}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeeklyNormalizedChart
