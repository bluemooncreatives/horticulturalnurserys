import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

export async function GET() {
    try {
        await connectDB()
        const adminCount = await UserModel.countDocuments({ role: 'admin', deletedAt: null })
        return response(true, 200, 'Setup status fetched successfully.', {
            hasAdmin: adminCount > 0
        })
    } catch (error) {
        return catchError(error)
    }
}
