import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import ReviewModel from "@/models/Review.model";
import { withCoverFirst } from '@/lib/coverMedia'

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }
        await connectDB()

        const latestReview = await ReviewModel.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({
                path: 'product',
                select: 'name media coverMedia',
                populate: {
                    path: 'media',
                    select: 'secure_url'
                }
            })
            // lean() so the documents are plain objects the cover normalizer can
            // spread; they are only serialized into the response from here.
            .lean()

        // The thumbnail reads product.media[0], so rotate each review's product
        // onto its chosen cover before returning.
        const reviews = latestReview.map((review) => (
            review?.product ? { ...review, product: withCoverFirst(review.product) } : review
        ))

        return response(true, 200, 'Latest review', reviews)

    } catch {
        return catchError(error)
    }
}