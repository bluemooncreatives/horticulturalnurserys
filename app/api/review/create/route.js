import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ReviewModel from "@/models/Review.model"

// Admin-only: create an admin-authored review. Customer accounts have been
// removed, so reviews are seeded and managed by the admin. The author's display
// name is stored on `authorName` (there is no linked user).
export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            product: true,
            authorName: true,
            rating: true,
            title: true,
            review: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const { product, authorName, rating, title, review } = validate.data

        const numericRating = Math.min(5, Math.max(1, Math.round(Number(rating))))

        const newReview = new ReviewModel({
            product,
            authorName,
            rating: numericRating,
            title,
            review,
        })

        await newReview.save()

        return response(true, 200, 'Review added successfully.')

    } catch (error) {
        return catchError(error)
    }
}
