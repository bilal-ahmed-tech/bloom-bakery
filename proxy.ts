import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.isAdmin === true
  const { pathname } = req.nextUrl

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  const isProtected =
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders")

  const isAdminRoute = pathname.startsWith("/admin")

  // Block /admin — must be logged in AND isAdmin
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  // Block protected routes for guests
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|studio|public).*)"],
}