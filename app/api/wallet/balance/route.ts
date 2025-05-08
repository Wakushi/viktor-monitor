import { NextRequest, NextResponse } from "next/server"

const WALLET_API = process.env.NEXT_PUBLIC_API_URL
const API_SECRET = process.env.API_SECRET

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")

  try {
    const response = await fetch(`${WALLET_API}/transaction/wallet/${from}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error fetching balance data:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
