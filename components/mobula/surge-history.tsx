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

export type SrgHourlyPrice = {
  id?: number
  timestamp: number
  token_address: string
  chain: string
  real_native_balance: number
  internal_native_balance: number
  native_price_usd: number
  srg_balance: number
  internal_srg_price_usd: number
  real_price_usd: number
}

type TimeRange = "24h" | "7d" | "30d" | "90d" | "180d" | "1y" | "all"
type DataGrouping = "hourly" | "daily" | "weekly" | "monthly"

interface TokenAnalyticsProps {
  data: SrgHourlyPrice[]
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
    internalNativeBalance: false,
    realNativeBalance: false,
    nativePrice: false,
    srgBalance: false,
  })

  // Sort data by timestamp (ascending)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.timestamp - b.timestamp)
  }, [data])

  const [brushRange, setBrushRange] = useState<[number, number] | null>(null)

  const handleBrushChange = ({
    startIndex,
    endIndex,
  }: {
    startIndex?: number
    endIndex?: number
  }) => {
    if (
      startIndex === undefined ||
      endIndex === undefined ||
      !groupedData.length
    )
      return

    const startTimestamp = groupedData[startIndex].timestamp
    const endTimestamp = groupedData[endIndex].timestamp

    const rangeInDays = (endTimestamp - startTimestamp) / 86400

    if (rangeInDays <= 1) {
      setActiveTimeRange("24h")
      setDataGrouping("hourly")
    } else if (rangeInDays <= 7) {
      setActiveTimeRange("7d")
      setDataGrouping("daily")
    } else if (rangeInDays <= 30) {
      setActiveTimeRange("30d")
      setDataGrouping("daily")
    } else if (rangeInDays <= 90) {
      setActiveTimeRange("90d")
      setDataGrouping("weekly")
    } else if (rangeInDays <= 180) {
      setActiveTimeRange("180d")
      setDataGrouping("weekly")
    } else if (rangeInDays <= 365) {
      setActiveTimeRange("1y")
      setDataGrouping("weekly")
    } else {
      setActiveTimeRange("all")
      setDataGrouping("monthly")
    }

    setBrushRange([startTimestamp, endTimestamp])
  }

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (sortedData.length === 0) return []

    const now = sortedData[sortedData.length - 1].timestamp
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

    const groupByFn = (timestamp: number) => {
      const date = new Date(timestamp * 1000)

      if (dataGrouping === "daily") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      }

      if (dataGrouping === "weekly") {
        const firstDayOfWeek = new Date(date)
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1)
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
        const avgInternalPrice = _.meanBy(groupItems, "internal_srg_price_usd")
        const avgRealPrice = _.meanBy(groupItems, "real_price_usd")
        const avgInternalNative = _.meanBy(
          groupItems,
          "internal_native_balance"
        )
        const avgRealNative = _.meanBy(groupItems, "real_native_balance")
        const avgNativePrice = _.meanBy(groupItems, "native_price_usd")
        const avgSrgBalance = _.meanBy(groupItems, "srg_balance")

        const timestamp = new Date(key).getTime() / 1000

        return {
          timestamp,
          date: new Date(timestamp * 1000),
          token_address: groupItems[0].token_address,
          chain: groupItems[0].chain,
          real_native_balance: avgRealNative,
          internal_native_balance: avgInternalNative,
          native_price_usd: avgNativePrice,
          srg_balance: avgSrgBalance,
          internal_srg_price_usd: avgInternalPrice,
          real_price_usd: avgRealPrice,
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [filteredData, dataGrouping])

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

  const handleTimeRangeClick = (range: TimeRange) => {
    setActiveTimeRange(range)

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

  const toggleSeriesVisibility = (series: keyof typeof seriesVisibility) => {
    setSeriesVisibility((prev) => ({
      ...prev,
      [series]: !prev[series],
    }))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
        <p className="font-bold text-white">{formatDate(label)}</p>
        {seriesVisibility.internalPrice && (
          <p className="text-blue-400">
            Internal Price: $
            {payload[0]?.payload.internal_srg_price_usd.toFixed(10)}
          </p>
        )}
        {seriesVisibility.realPrice && (
          <p className="text-green-400">
            Real Price: ${payload[0]?.payload.real_price_usd.toFixed(10)}
          </p>
        )}
        {seriesVisibility.internalNativeBalance && (
          <p className="text-purple-400">
            Internal Native Balance:{" "}
            {payload[0]?.payload.internal_native_balance.toFixed(2)}
          </p>
        )}
        {seriesVisibility.realNativeBalance && (
          <p className="text-pink-400">
            Real Native Balance:{" "}
            {payload[0]?.payload.real_native_balance.toFixed(2)}
          </p>
        )}
        {seriesVisibility.nativePrice && (
          <p className="text-yellow-400">
            Native Price: ${payload[0]?.payload.native_price_usd.toFixed(4)}
          </p>
        )}
        {seriesVisibility.srgBalance && (
          <p className="text-cyan-400">
            SRG Balance: {payload[0]?.payload.srg_balance.toLocaleString()}
          </p>
        )}
      </div>
    )
  }

  const priceDomain = useMemo(() => {
    const maxPrice = Math.max(
      ...groupedData.map((item) =>
        Math.max(item.internal_srg_price_usd, item.real_price_usd)
      )
    )
    return [0, maxPrice * 1.1]
  }, [groupedData])

  const nativeBalanceDomain = useMemo(() => {
    const maxBalance = Math.max(
      ...groupedData.map((item) =>
        Math.max(item.internal_native_balance, item.real_native_balance)
      )
    )
    return [0, maxBalance * 1.1]
  }, [groupedData])

  const nativePriceDomain = useMemo(() => {
    const maxPrice = Math.max(
      ...groupedData.map((item) => item.native_price_usd)
    )
    return [0, maxPrice * 1.1]
  }, [groupedData])

  const srgBalanceDomain = useMemo(() => {
    const maxBalance = Math.max(...groupedData.map((item) => item.srg_balance))
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
          $SRG: {data[0]?.chain} ({data[0]?.token_address})
        </h2>

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
              checked={seriesVisibility.internalNativeBalance}
              onChange={() => toggleSeriesVisibility("internalNativeBalance")}
              className="mr-2 h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
            />
            Internal Native Balance
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.realNativeBalance}
              onChange={() => toggleSeriesVisibility("realNativeBalance")}
              className="mr-2 h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
            />
            Real Native Balance
          </label>
          <label className="flex items-center text-slate-300">
            <input
              type="checkbox"
              checked={seriesVisibility.nativePrice}
              onChange={() => toggleSeriesVisibility("nativePrice")}
              className="mr-2 h-4 w-4 text-yellow-600 rounded focus:ring-yellow-500"
            />
            Native Price
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
        </div>
      </div>

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

            <YAxis
              yAxisId="nativeBalance"
              orientation="right"
              domain={nativeBalanceDomain}
              tickFormatter={(value) => value.toFixed(2)}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "Native Balance",
                angle: -90,
                position: "insideRight",
                offset: 5,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={
                !seriesVisibility.internalNativeBalance &&
                !seriesVisibility.realNativeBalance
              }
            />

            <YAxis
              yAxisId="nativePrice"
              orientation="right"
              domain={nativePriceDomain}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "Native Price",
                angle: -90,
                position: "insideRight",
                offset: 30,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={!seriesVisibility.nativePrice}
            />

            <YAxis
              yAxisId="srgBalance"
              orientation="right"
              domain={srgBalanceDomain}
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              label={{
                value: "SRG Balance",
                angle: -90,
                position: "insideRight",
                offset: 60,
                style: { textAnchor: "middle", fill: "#94a3b8" },
              }}
              hide={!seriesVisibility.srgBalance}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="internal_srg_price_usd"
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

            <Area
              type="monotone"
              dataKey="internal_native_balance"
              name="Internal Native Balance"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              yAxisId="nativeBalance"
              fillOpacity={0.2}
              hide={!seriesVisibility.internalNativeBalance}
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="real_native_balance"
              name="Real Native Balance"
              stroke="#ec4899"
              fill="#ec4899"
              yAxisId="nativeBalance"
              fillOpacity={0.2}
              hide={!seriesVisibility.realNativeBalance}
              strokeWidth={2}
            />

            <Bar
              dataKey="native_price_usd"
              name="Native Price"
              fill="#f59e0b"
              yAxisId="nativePrice"
              radius={[4, 4, 0, 0]}
              hide={!seriesVisibility.nativePrice}
            />

            <Line
              type="monotone"
              dataKey="srg_balance"
              name="SRG Balance"
              stroke="#06b6d4"
              yAxisId="srgBalance"
              dot={false}
              activeDot={{ r: 4 }}
              hide={!seriesVisibility.srgBalance}
              strokeWidth={2}
            />

            <Brush
              dataKey="timestamp"
              height={20}
              padding={{ top: 90 }}
              stroke="#8884d8"
              tickFormatter={formatDate}
              startIndex={0}
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
