import type { NextRequest } from "next/server"

const secret = process.env.WRITE_KEY

export function doesRequestContainPassword(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const authHeader = requestHeaders.get("authorization")
    return authHeader === secret
}
