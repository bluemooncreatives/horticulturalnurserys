import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import EnquiryModel, { enquiryStatus } from "@/models/Enquiry.model"

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const grouped = await EnquiryModel.aggregate([
            { $match: { deletedAt: null } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ])

        const counts = Object.fromEntries(grouped.map((g) => [g._id, g.count]))
        // Ensure every known status is present (0 when none), in canonical order.
        const data = enquiryStatus.map((status) => ({ status, count: counts[status] || 0 }))
        const total = data.reduce((sum, d) => sum + d.count, 0)

        return response(true, 200, 'Enquiry status breakdown.', { data, total })
    } catch (error) {
        return catchError(error)
    }
}
