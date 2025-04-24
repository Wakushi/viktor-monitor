import { NextRequest } from "next/server"

export async function POST(request: NextRequest): Promise<void> {
  const body = await request.json()
  const { mode } = body

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cron`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    body: JSON.stringify({
      mode,
    }),
  })
}
