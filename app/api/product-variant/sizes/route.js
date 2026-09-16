import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

const CACHE_HEADERS = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
}

export async function GET() {
    try {

        await connectDB()

        // Size is optional, so sizeless variants group under '' / null - they
        // must not become a blank entry in the admin picker or the shop facet.
        const getSize = await ProductVariantModel.aggregate([
            { $match: { deletedAt: null, size: { $nin: [null, ''] } } },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: "$size",
                    first: { $first: "$_id" }
                }
            },
            { $sort: { first: 1 } },
            { $project: { _id: 0, size: "$_id" } }
        ])

        // An empty catalogue (or one where nothing carries a size) is a valid
        // state, not a 404 - the admin picker still has to render.
        const sizes = getSize.map(item => item.size).filter(Boolean)

        return response(true, 200, 'Size found.', sizes, { headers: CACHE_HEADERS })

    } catch (error) {
        return catchError(error)
    }
}