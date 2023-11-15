import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (token) {
    // console.log("🚀 ~ file: middleware.ts:11 ~ middleware ~ token:", token)
    const secret = new TextEncoder().encode(process.env.SECRET_TOKEN_KEY);
    const { payload } = await jose.jwtVerify(token.value, secret);
    // console.log(
    //   "🚀 ~ file: middleware.ts:16 ~ middleware ~ payload.role:",
    //   payload
    // );
    if (request.nextUrl.pathname.startsWith("/user-settings")) {
      if (!["user", "admin"].includes(payload.role as string)) {
        return NextResponse.redirect(new URL("/search", request.url));
      }
    }
    if (request.nextUrl.pathname.startsWith("/api/user")) {
      if (!["user", "admin"].includes(payload.role as string)) {
        return NextResponse.next();
      }
    }
    if (request.nextUrl.pathname.startsWith("/api/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.next();
      }
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("_id", payload._id as string);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  } else {
    return NextResponse.next();
  }
}
