"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts"
import { format } from "date-fns"
import { useMemo } from "react"

type BalanceChartProps = {
  balanceUsd: number
  balanceHistory: [number, number][]
}

const formatTimestamp = (timestamp: number) =>
  format(new Date(timestamp), "yyyy-MM-dd HH:mm")

export function BalanceChart({
  balanceUsd,
  balanceHistory,
}: BalanceChartProps) {
  const chartData = useMemo(
    () =>
      balanceHistory.map(([timestamp, value]) => ({
        time: formatTimestamp(timestamp),
        rawTime: timestamp,
        value,
      })),
    [balanceHistory]
  )

  const minGap = 3 * 60 * 60 * 1000
  const xTicks: number[] = []
  let last = 0
  for (const point of chartData) {
    if (point.rawTime - last >= minGap) {
      xTicks.push(point.rawTime)
      last = point.rawTime
    }
  }

  return (
    <div className="w-full p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-md">
      <div className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-100">
        Current Balance: ${balanceUsd.toFixed(2)}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="rawTime"
            ticks={xTicks}
            tickFormatter={(ts) => formatTimestamp(ts)}
            tick={{ fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={80}
            domain={["auto", "auto"]}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null
              return (
                <div className="rounded-md bg-white dark:bg-zinc-800 p-2 shadow-md border dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-100">
                  <div className="font-medium">
                    Time: {formatTimestamp(Number(label))}
                  </div>
                  <div>Balance: ${Number(payload[0].value).toFixed(2)}</div>
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
          <Brush
            dataKey="rawTime"
            height={30}
            stroke="#4f46e5"
            travellerWidth={10}
            tickFormatter={(ts) => format(new Date(ts), "MM-dd HH:mm")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
