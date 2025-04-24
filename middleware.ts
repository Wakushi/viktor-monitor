import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { RateLimiterMemory } from "rate-limiter-flexible"
import { verifyJWT } from "./lib/jwt"

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  const authCookie = request.cookies.get(process.env.TOKEN_COOKIE as string)
  const token = authCookie?.value

  try {
    const ip = request.headers.get("x-forwarded-for")

    if (ip) {
      await rateLimiter.consume(ip)
    }

    if (token) {
      const decodedToken = await verifyJWT(token)

      if (pathname.startsWith("/admin")) {
        if (decodedToken.userType !== "ADMIN") {
          url.pathname = "/"
          return NextResponse.redirect(url)
        }
      }
    } else {
      if (pathname.startsWith("/admin")) {
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  } catch (error) {
    if (error instanceof Error && "consume" in error) {
      return new NextResponse("Too many requests", { status: 429 })
    }
    console.error("Middleware error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
