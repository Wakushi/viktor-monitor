import { NextRequest, NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/settings/whitelisted-chains`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET}`,
        },
      }
    )

    const { data } = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: response.status }
      )
    } else {
      return NextResponse.json({ success: true, data })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { chains } = body

    if (!Array.isArray(chains)) {
      return NextResponse.json(
        { success: false, message: "Chains must be an array" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/settings/whitelisted-chains`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_SECRET}`,
        },
        body: JSON.stringify({
          chains,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update settings",
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { success: true, message: "Settings updated successfully", data },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while updating settings" },
      { status: 500 }
    )
  }
}
