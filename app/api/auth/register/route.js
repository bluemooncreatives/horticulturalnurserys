import { catchError, response } from "@/lib/helperFunction";

export async function POST() {
    try {
        return response(false, 403, 'Customer registration has been removed. Only admin login is available.')
    } catch (error) {
        return catchError(error)
    }
}
