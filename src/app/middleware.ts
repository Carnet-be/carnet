import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    console.log('request', request)
    if (request.nextUrl.pathname.startsWith('/about')) {
      return NextResponse.rewrite(new URL('/about-2', request.url))
    }
   
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.rewrite(new URL('/dashboard/user', request.url))
    }
  }