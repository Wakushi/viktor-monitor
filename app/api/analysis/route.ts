import { WeekAnalysisRecord } from "@/types/week-analysis.type"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page")
  const limit = searchParams.get("limit")

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analysis?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    ;(data as WeekAnalysisRecord[]).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 })
    }

    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
  }
}
