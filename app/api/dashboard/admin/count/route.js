import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import CategoryModel from "@/models/Category.model"
import EnquiryModel from "@/models/Enquiry.model"
import ProductModel from "@/models/Product.model"

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const [category, product, enquiry, newEnquiry] = await Promise.all([
            CategoryModel.countDocuments({ deletedAt: null }),
            ProductModel.countDocuments({ deletedAt: null }),
            EnquiryModel.countDocuments({ deletedAt: null }),
            EnquiryModel.countDocuments({ deletedAt: null, status: 'new' }),
        ])

        return response(true, 200, 'Dashboard count.', {
            category, product, enquiry, newEnquiry
        })

    } catch (error) {
        return catchError(error)
    }
}
