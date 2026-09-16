import { revalidateTag } from "next/cache"
import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import { encode } from "entities"
import { decodeHTMLDeep } from "@/lib/utils"

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            _id: true,
            name: true,
            slug: true,
            category: true,
            description: true,
            media: true
        })
        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const validatedData = validate.data

        const getProduct = await ProductModel.findOne({ deletedAt: null, _id: validatedData._id })
        if (!getProduct) {
            return response(false, 404, 'Data not found.')
        }

        getProduct.name = validatedData.name
        getProduct.slug = validatedData.slug
        getProduct.category = validatedData.category
        // Decode before encoding so re-saving an already-encoded description
        // is a no-op. Without it every save added an encoding layer, producing
        // the `&amp;lt;p&amp;gt;` rows `decodeHTMLDeep` exists to clean up.
        getProduct.description = encode(decodeHTMLDeep(validatedData.description))
        getProduct.media = validatedData.media
        await getProduct.save()

        // Re-categorising a product or changing its media can change category
        // counts and the homepage "Categories" representative image.
        revalidateTag('storefront-home-categories')

        return response(true, 200, 'Product updated successfully.')

    } catch (error) {
        return catchError(error)
    }
}