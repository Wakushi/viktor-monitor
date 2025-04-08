"use client"
import React, { useState, useMemo } from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
} from "recharts"
import { format } from "date-fns"
import _ from "lodash"

type TokenData = {
  id: number
  token_address: string
  chain: string
  timestamp: number
  srg_balance: number
  token_balance: number
  internal_price_usd: number
  real_price_usd: number
  internal_liquidity_usd: number
  real_liquidity_usd: number
  created_at: string
  volume: number
}

type TimeRange = "24h" | "7d" | "30d" | "90d" | "180d" | "1y" | "all"
type DataGrouping = "hourly" | "daily" | "weekly" | "monthly"

interface TokenAnalyticsProps {
  data: TokenData[]
  height?: number
  defaultTimeRange?: TimeRange
  defaultDataGrouping?: DataGrouping
}

const TokenAnalyticsDashboard: React.FC<TokenAnalyticsProps> = ({
  data,
  height = 600,
  defaultTimeRange = "7d",
  defaultDataGrouping = "daily",
}) => {
  const [activeTimeRange, setActiveTimeRange] =
    useState<TimeRange>(defaultTimeRange)
  const [dataGrouping, setDataGrouping] =
    useState<DataGrouping>(defaultDataGrouping)
  const [seriesVisibility, setSeriesVisibility] = useState({
    internalPrice: true,
    realPrice: true,
    internalLiquidity: true,
    realLiquidity: true,
    volume: true,
    srgBalance: false,
    tokenBalance: false,
  })

  // Sort data by timestamp (ascending)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.timestamp - b.timestamp)
  }, [data])

  //   // {
  //     "startIndex": 615,
  //     "endIndex": 799
  // }
  const [brushRange, setBrushRange] = useState<[number, number] | null>(null)

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (sortedData.length === 0) return []

    const now = sortedData[sortedData.length - 1].timestamp // Use latest timestamp in data
    let startTimestamp: number

    switch (activeTimeRange) {
      case "24h":
        startTimestamp = now - 86400
        break
      case "7d":
        startTimestamp = now - 7 * 86400
        break
      case "30d":
        startTimestamp = now - 30 * 86400
        break
      case "90d":
        startTimestamp = now - 90 * 86400
        break
      case "180d":
        startTimestamp = now - 180 * 86400
        break
      case "1y":
        startTimestamp = now - 365 * 86400
        break
      case "all":
      default:
        return sortedData
    }

    return sortedData.filter((item) => item.timestamp >= startTimestamp)
  }, [sortedData, activeTimeRange])

  // Group data based on selected grouping
  const groupedData = useMemo(() => {
    if (filteredData.length === 0) return []
    if (dataGrouping === "hourly" || filteredData.length < 24) {
      return filteredData.map((item) => ({
        ...item,
        date: new Date(item.timestamp * 1000),
      }))
    }

    // Group by timeframe
    const groupByFn = (timestamp: number) => {
      const date = new Date(timestamp * 1000)

      if (dataGrouping === "daily") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      }

      if (dataGrouping === "weekly") {
        // Get the first day of the week
        const firstDayOfWeek = new Date(date)
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
        firstDayOfWeek.setDate(diff)
        return `${firstDayOfWeek.getFullYear()}-${String(
          firstDayOfWeek.getMonth() + 1
        ).padStart(2, "0")}-${String(firstDayOfWeek.getDate()).padStart(
          2,
          "0"
        )}`
      }

      if (dataGrouping === "monthly") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`
      }

      return timestamp.toString()
    }

    const groups = _.groupBy(filteredData, (item) => groupByFn(item.timestamp))

    return Object.entries(groups)
      .map(([key, groupItems]) => {
        // Calculate the average/last value for the group
        const lastItem = groupItems[groupItems.length - 1]
        const avgInternalPrice = _.meanBy(groupItems, "internal_price_usd")
        const avgRealPrice = _.meanBy(groupItems, "real_price_usd")
        const avgInternalLiquidity = _.meanBy(
          groupItems,
          "internal_liquidity_usd"
        )
        const avgRealLiquidity = _.meanBy(groupItems, "real_liquidity_usd")
        const avgVolume = _.meanBy(groupItems, "volume")
        const avgSrgBalance = _.meanBy(groupItems, "srg_balance")
        const avgTokenBalance = _.meanBy(groupItems, "token_balance")

        const timestamp = new Date(key).getTime() / 1000

        return {
          timestamp,
          date: new Date(timestamp * 1000),
          internal_price_usd: avgInternalPrice,
          real_price_usd: avgRealPrice,
          internal_liquidity_usd: avgInternalLiquidity,
          real_liquidity_usd: avgRealLiquidity,
          volume: avgVolume,
          srg_balance: avgSrgBalance,
          token_balance: avgTokenBalance,
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [filteredData, dataGrouping])

  // Format date for tooltip and x-axis
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)

    if (dataGrouping === "monthly") {
      return format(date, "MMM yyyy")
    }

    if (dataGrouping === "weekly") {
      return `Week of ${format(date, "MMM d")}`
    }

    if (dataGrouping === "daily") {
      return format(date, "MMM d, yyyy")
    }

    return format(date, "MMM d, HH:mm")
  }

  // Handle time range button click
  const handleTimeRangeClick = (range: TimeRange) => {
    setActiveTimeRange(range)

    // Adjust data grouping based on selected time range
    if (range === "24h") {
      setDataGrouping("hourly")
    } else if (range === "7d") {
      setDataGrouping("daily")
    } else if (range === "30d") {
      setDataGrouping("daily")
    } else if (range === "90d") {
      setDataGrouping("weekly")
    } else if (range === "180d" || range === "1y") {
      setDataGrouping("weekly")
    } else {
      setDataGrouping("monthly")
    }
  }

  // Toggle series visibility
  const toggleSeriesVisibility = (series: keyof typeof seriesVisibility) => {
    setSeriesVisibility((prev) => ({
      ...prev,
      [series]: !prev[series],
    }))
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
        <p className="font-bold text-white">{formatDate(label)}</p>
        {seriesVisibility.internalPrice && (
          <p className="text-blue-400">
            Internal Price: $
            {payload[0]?.payload.internal_price_usd.toFixed(15)}
          </p>
        )}
        {seriesVisibility.realPrice && (
          <p className="text-green-400">
            Real Price: ${payload[0]?.payload.real_price_usd.toFixed(15)}
          </p>
        )}
        {seriesVisibility.internalLiquidity && (
          <p className="text-purple-400">
            Internal Liquidity: $
            {payload[0]?.payload.internal_liquidity_usd.toFixed(6)}
          </p>
        )}
        {seriesVisibility.realLiquidity && (
          <p className="text-pink-400">
            Real Liquidity: ${payload[0]?.payload.real_liquidity_usd.toFixed(6)}
          </p>
        )}
        {seriesVisibility.volume && (
          <p className="text-yellow-400">
            Volume: {payload[0]?.payload.volume.toFixed(4)}
          </p>
        )}
        {seriesVisibility.srgBalance && (
          <p className="text-cyan-400">
            SRG Balance: {payload[0]?.payload.srg_balance.toLocaleString()}
          </p>
        )}
        {seriesVisibility.tokenBalance && (
          <p className="text-orange-400">
            Token Balance: {payload[0]?.payload.token_balance.toLocaleString()}
          </p>
        )}
      </div>
    )
  }

  // Calculate domains for different Y axes
  const priceDomain = useMemo(() => {
    const maxPrice = Math.max(
      ...groupedData.map((item) =>
        Math.max(item.internal_price_usd, item.real_price_usd)
      )
    )
    return [0, maxPrice * 1.1] // Add 10% padding
  }, [groupedData])

  const liquidityDomain = useMemo(() => {
    const maxLiquidity = Math.max(
      ...groupedData.map((item) =>
        Math.max(item.internal_liquidity_usd, item.real_liquidity_usd)
      )
    )
    return [0, maxLiquidity * 1.1]
  }, [groupedData])

  const volumeDomain = useMemo(() => {
    const maxVolume = Math.max(...groupedData.map((item) => item.volume))
    return [0, maxVolume * 1.1]
  }, [groupedData])

  const balanceDomain = useMemo(() => {
    const maxBalance = Math.max(
      ...groupedData.map((item) =>
        Math.max(item.srg_balance, item.token_balance / 1000)
      )
    )
    return [0, maxBalance * 1.1]
  }, [groupedData])

  if (data.length === 0) {
    return (
      <div className="bg-slate-900 p-4 rounded-lg shadow text-center">
        <p className="text-slate-400">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">
          Analytics: {data[0]?.token_address}
        </h2>

        {/* Time Range Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-slate-300 font-medium self-center">
            Time Range:
          </span>
          {(
            ["24h", "7d", "30d", "90d", "180d", "1y", "all"] as TimeRange[]
          ).map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded text-sm ${
                activeTimeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
              onClick={() => handleTimeRangeClick(range)}
            >
              {range === "all" ? "All" : range}
            </button>
          ))}
        </div>

        {/* Data Grouping Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-slate-300 font-medium self-center">
            Group By:
          </span>
          {(["hourly", "daily", "weekly", "monthly"] as DataGrouping[]).map(
            (group) => (
              <button
                key={group}
                className={`px-3 py-1 rounded text-sm ${
                  dataGrouping === group
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                } ${
                  activeTimeRange === "24h" && group !== "hourly"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => setDataGrouping(group)}
                disabled={activeTimeRange === "24h" && group !== "hourly"}
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Chart Display Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.internalPrice}
              onChange={() => toggleSeriesVisibility("internalPrice")}
              className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            Internal Price
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.realPrice}
              onChange={() => toggleSeriesVisibility("realPrice")}
              className="mr-2 h-4 w-4 text-green-600 rounded focus:ring-green-500"
            />
            Real Price
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.internalLiquidity}
              onChange={() => toggleSeriesVisibility("internalLiquidity")}
              className="mr-2 h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
            />
            Internal Liquidity
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.realLiquidity}
              onChange={() => toggleSeriesVisibility("realLiquidity")}
              className="mr-2 h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
            />
            Real Liquidity
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.volume}
              onChange={() => toggleSeriesVisibility("volume")}
              className="mr-2 h-4 w-4 text-yellow-600 rounded focus:ring-yellow-500"
            />
            Volume
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.srgBalance}
              onChange={() => toggleSeriesVisibility("srgBalance")}
              className="mr-2 h-4 w-4 text-cyan-600 rounded focus:ring-cyan-500"
            />
            SRG Balance
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.tokenBalance}
              onChange={() => toggleSeriesVisibility("tokenBalance")}
              className="mr-2 h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
            />
            Token Balance
          </label>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <ComposedChart
            data={groupedData}
            margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="timestamp"
              scale="time"
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              angle={-45}
              textAnchor="end"
              height={80}
              padding={{ left: 10, right: 10 }}
            />

            {/* Price Y Axis */}
            <YAxis
              yAxisId="price"
              orientation="left"
              domain={priceDomain}
              width={100}
              tickFormatter={(value) => `$${value.toFixed(8)}`}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "Price (USD)",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={
                !seriesVisibility.internalPrice && !seriesVisibility.realPrice
              }
            />

            {/* Liquidity Y Axis */}
            <YAxis
              yAxisId="liquidity"
              orientation="right"
              domain={liquidityDomain}
              tickFormatter={(value) => `$${value.toFixed(6)}`}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "Liquidity (USD)",
                angle: -90,
                position: "insideRight",
                offset: 5,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={
                !seriesVisibility.internalLiquidity &&
                !seriesVisibility.realLiquidity
              }
            />

            {/* Volume Y Axis */}
            <YAxis
              yAxisId="volume"
              orientation="right"
              domain={volumeDomain}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "Volume",
                angle: -90,
                position: "insideRight",
                offset: 30,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={!seriesVisibility.volume}
            />

            {/* Balance Y Axis */}
            <YAxis
              yAxisId="balance"
              orientation="right"
              domain={balanceDomain}
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "Balance",
                angle: -90,
                position: "insideRight",
                offset: 60,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={
                !seriesVisibility.srgBalance && !seriesVisibility.tokenBalance
              }
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Price Lines */}
            <Line
              type="monotone"
              dataKey="internal_price_usd"
              name="Internal Price"
              stroke="#3b82f6"
              yAxisId="price"
              dot={false}
              activeDot={{ r: 4 }}
              hide={!seriesVisibility.internalPrice}
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="real_price_usd"
              name="Real Price"
              stroke="#10b981"
              yAxisId="price"
              dot={false}
              activeDot={{ r: 4 }}
              hide={!seriesVisibility.realPrice}
              strokeWidth={2}
            />

            {/* Liquidity Areas */}
            <Area
              type="monotone"
              dataKey="internal_liquidity_usd"
              name="Internal Liquidity"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              yAxisId="liquidity"
              fillOpacity={0.2}
              hide={!seriesVisibility.internalLiquidity}
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="real_liquidity_usd"
              name="Real Liquidity"
              stroke="#ec4899"
              fill="#ec4899"
              yAxisId="liquidity"
              fillOpacity={0.2}
              hide={!seriesVisibility.realLiquidity}
              strokeWidth={2}
            />

            {/* Volume Bar */}
            <Bar
              dataKey="volume"
              name="Volume"
              fill="#f59e0b"
              yAxisId="volume"
              radius={[4, 4, 0, 0]}
              hide={!seriesVisibility.volume}
            />

            {/* Balance Lines */}
            <Line
              type="monotone"
              dataKey="srg_balance"
              name="SRG Balance"
              stroke="#06b6d4"
              yAxisId="balance"
              dot={false}
              activeDot={{ r: 4 }}
              hide={!seriesVisibility.srgBalance}
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="token_balance"
              name="Token Balance"
              stroke="#f97316"
              yAxisId="balance"
              dot={false}
              activeDot={{ r: 4 }}
              hide={!seriesVisibility.tokenBalance}
              strokeWidth={2}
            />

            <Brush
              dataKey="timestamp"
              height={20}
              padding={{ top: 90 }}
              stroke="#8884d8"
              tickFormatter={formatDate}
              onChange={(e) => console.log(e)}
              startIndex={Math.max(
                0,
                groupedData.length - Math.min(50, groupedData.length)
              )}
              endIndex={groupedData.length - 1}
              fill="#373e52"
              travellerWidth={10}
              gap={5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <p>
          Showing {groupedData.length} data points from{" "}
          {groupedData.length > 0
            ? formatDate(groupedData[0].timestamp)
            : "N/A"}{" "}
          to{" "}
          {groupedData.length > 0
            ? formatDate(groupedData[groupedData.length - 1].timestamp)
            : "N/A"}
        </p>
      </div>
    </div>
  )
}

export default TokenAnalyticsDashboard
