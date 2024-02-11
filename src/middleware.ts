import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { doesRequestContainPassword } from "./utils"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (request.method != "GET") {
        if (!doesRequestContainPassword(request)) {
            return NextResponse.json({}, { status: 401 })
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/api/:path*",
}
