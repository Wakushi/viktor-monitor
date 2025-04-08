import _ from "lodash"
import { Analyse, FormattedResult } from "@/types/analysis.type"
import { AverageMetrics, ScatterDataPoint } from "./confidence-metrics.types"

export function processAnalysisData(
  analyses: Analyse[],
  confidenceFilter: number = 0
) {
  const processedScatterData: ScatterDataPoint[] = []

  const filteredAnalysis = analyses.map((analyse: Analyse) => {
    const filteredResults = analyse.analysis.formattedResults
      .map((result: FormattedResult) => {
        return Number(result.buyingConfidence.slice(0, 5)) > confidenceFilter
          ? result
          : null
      })
      .filter((result) => !!result)

    const filteredPerformances = analyse.performance
      ? analyse.performance.filter((performance) => {
          return filteredResults.some((res) => res.token === performance.token)
        })
      : []

    return {
      ...analyse,
      performance: filteredPerformances,
      analysis: { ...analyse.analysis, formattedResults: filteredResults },
    }
  })

  filteredAnalysis.forEach((analyse) => {
    const formattedResults = analyse.analysis.formattedResults || []
    const performances = analyse.performance || []

    formattedResults.forEach((result) => {
      const tokenName = result.token
      const buyingConfidence = parseFloat(
        result.buyingConfidence.replace("%", "")
      )

      const matchingPerformance = performances.find(
        (perf) => perf.token.toLowerCase() === tokenName.toLowerCase()
      )

      if (matchingPerformance) {
        processedScatterData.push({
          token: tokenName,
          buyingConfidence,
          percentageChange: matchingPerformance.percentageChange,
          date: new Date(analyse.created_at).toLocaleDateString(),
          price: parseFloat(result.price.replace("$", "")),
          currentPrice: matchingPerformance.currentPrice,
          priceChange: matchingPerformance.priceChange,
        })
      }
    })
  })

  // Process confidence brackets
  const brackets: {
    [key: string]: { sum: number; count: number; tokens: string[] }
  } = {}
  const bracketSize = 10 // 10% brackets

  for (let i = 0; i < 100; i += bracketSize) {
    const bracketLabel = `${i}-${i + bracketSize}`
    brackets[bracketLabel] = { sum: 0, count: 0, tokens: [] }
  }

  processedScatterData.forEach((item) => {
    const bracketIndex =
      Math.floor(item.buyingConfidence / bracketSize) * bracketSize
    const bracketLabel = `${bracketIndex}-${bracketIndex + bracketSize}`

    if (brackets[bracketLabel]) {
      brackets[bracketLabel].sum += item.percentageChange
      brackets[bracketLabel].count += 1
      brackets[bracketLabel].tokens.push(item.token)
    }
  })

  // Calculate metrics
  const avgConfidence = processedScatterData.length
    ? _.meanBy(processedScatterData, "buyingConfidence")
    : 0

  const avgPerformance = processedScatterData.length
    ? _.meanBy(processedScatterData, "percentageChange")
    : 0

  const positivePerformances = processedScatterData.filter(
    (item) => item.percentageChange > 0
  )
  const positiveRate =
    processedScatterData.length > 0
      ? (positivePerformances.length / processedScatterData.length) * 100
      : 0

  // Calculate correlation
  let correlation = 0
  if (processedScatterData.length > 1) {
    const confidences = processedScatterData.map((d) => d.buyingConfidence)
    const performances = processedScatterData.map((d) => d.percentageChange)
    const confidenceMean = _.mean(confidences)
    const performanceMean = _.mean(performances)

    let numerator = 0
    let denominatorConfidence = 0
    let denominatorPerformance = 0

    for (let i = 0; i < confidences.length; i++) {
      const confidenceDiff = confidences[i] - confidenceMean
      const performanceDiff = performances[i] - performanceMean

      numerator += confidenceDiff * performanceDiff
      denominatorConfidence += confidenceDiff * confidenceDiff
      denominatorPerformance += performanceDiff * performanceDiff
    }

    correlation =
      denominatorConfidence > 0 && denominatorPerformance > 0
        ? numerator /
          (Math.sqrt(denominatorConfidence) * Math.sqrt(denominatorPerformance))
        : 0
  }

  const calculatedMetrics: AverageMetrics = {
    avgConfidence,
    avgPerformance,
    positiveRate,
    correlation,
  }

  return {
    processedScatterData,
    calculatedMetrics,
  }
}
