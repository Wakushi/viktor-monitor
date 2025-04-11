import { Analyse } from "@/types/analysis.type"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const fromCloud = searchParams.get("fromCloud")

  try {
    const response = await fetch(
      `https://viktor.wakushi.com/agent/analysis?fromCloud=${fromCloud ?? ""}`,
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

    data.sort(
      (a: Analyse, b: Analyse) =>
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
