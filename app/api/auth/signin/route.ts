import { createUserJwtToken } from "@/lib/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        {
          message: "Missing password",
        },
        {
          status: 400,
        }
      )
    }

    const isValidPassword = password === process.env.ADMIN_PASSWORD

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Invalid password",
        },
        {
          status: 400,
        }
      )
    }

    const token = await createUserJwtToken()

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: process.env.TOKEN_COOKIE as string,
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error })
  }
}
