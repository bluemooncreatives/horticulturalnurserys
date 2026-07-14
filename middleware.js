import { NextResponse } from "next/server"
import { jwtVerify } from "jose/jwt/verify"
import { ADMIN_DASHBOARD, ADMIN_LOGIN } from "./routes/AdminPanelRoute"

export async function middleware(request) {
    try {
        const pathname = request.nextUrl.pathname
        const isAdminRoute = pathname.startsWith('/admin')
        const isAdminLoginRoute = pathname === ADMIN_LOGIN
        const hasToken = request.cookies.has('access_token')

        let role = null
        let invalidCustomToken = false

        if (hasToken) {
            try {
                const accessToken = request.cookies.get('access_token')?.value
                const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.SECRET_KEY))
                role = payload.role
            } catch (error) {
                invalidCustomToken = true
                role = null
            }
        }

        if (!role) {
            if (isAdminRoute && !isAdminLoginRoute) {
                const loginUrl = new URL(ADMIN_LOGIN, request.nextUrl)
                loginUrl.searchParams.set('callback', pathname + request.nextUrl.search)
                const response = NextResponse.redirect(loginUrl)
                if (invalidCustomToken) {
                    response.cookies.delete('access_token')
                }
                return response
            }

            const response = NextResponse.next()
            if (invalidCustomToken) {
                response.cookies.delete('access_token')
            }
            return response
        }

        if (isAdminLoginRoute) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.nextUrl))
            }

            const response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.nextUrl))
            response.cookies.delete('access_token')
            return response
        }

        if (isAdminRoute && role !== 'admin') {
            const response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.nextUrl))
            response.cookies.delete('access_token')
            return response
        }

        return NextResponse.next()
    } catch (error) {
        const response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.nextUrl))
        response.cookies.delete('access_token')
        return response
    }
}

export const config = {
    matcher: ['/admin/:path*']
}
