import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export const isAuthenticated = async (role, request = null) => {
    try {
        const cookieStore = await cookies()

        if (!cookieStore.has('access_token')) {
            return {
                isAuth: false
            }
        }

        const accessToken = cookieStore.get('access_token')
        const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(process.env.SECRET_KEY))

        if (!payload.role || !payload._id || payload.role !== role) {
            return {
                isAuth: false
            }
        }

        return {
            isAuth: true,
            userId: payload._id,
            email: payload.email || null
        }
    } catch (error) {
        return {
            isAuth: false,
            error
        }
    }
}

export const getCurrentUser = async () => {
    try {
        const cookieStore = await cookies()

        if (!cookieStore.has('access_token')) {
            return null
        }

        const accessToken = cookieStore.get('access_token')
        const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(process.env.SECRET_KEY))

        return {
            userId: payload._id || null,
            email: payload.email || null,
            role: payload.role || null,
        }
    } catch (error) {
        return null
    }
}
