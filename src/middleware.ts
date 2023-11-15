import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const secret = process.env.WRITE_KEY

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (request.method != "GET") {
        const requestHeaders = new Headers(request.headers)
        const authHeader = requestHeaders.get("authorization")
        if (authHeader !== secret) {
            return NextResponse.json({}, { status: 401 })
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/api/:path*",
}
