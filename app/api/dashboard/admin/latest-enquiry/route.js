import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import EnquiryModel from "@/models/Enquiry.model"

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const enquiries = await EnquiryModel.find({ deletedAt: null })
            .select('ticketId name email status products createdAt')
            .sort({ createdAt: -1 })
            .limit(8)
            .lean()

        return response(true, 200, 'Latest enquiries.', enquiries)
    } catch (error) {
        return catchError(error)
    }
}
