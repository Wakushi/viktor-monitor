import { Analyse } from "@/types/analysis.type"
import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch("https://viktor.wakushi.com/agent/analysis", {
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    const analyses: Analyse[] = data.map((analyse: Analyse) => {
      if (!analyse.performance) return analyse

      const p = analyse.performance.map((perf) =>
        Math.abs(perf.percentageChange) > 80
          ? { ...perf, percentageChange: 0 }
          : perf
      )

      return { ...analyse, performance: p }
    })

    analyses.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({ success: true, data: analyses }, { status: 200 })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 })
    }

    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
  }
}
