import { revalidateTag } from "next/cache"
import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import { encode } from "entities"
import { decodeHTMLDeep } from "@/lib/utils"


// The cover must be one of the images actually being saved. Anything else - a
// stale id left over after the admin removed that image, or a hand-crafted
// payload - is discarded so `coverMedia` can never dangle.
const pickCoverMedia = (coverMedia, media = []) =>
    coverMedia && media.includes(coverMedia) ? coverMedia : null

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()


        const schema = zSchema.pick({
            name: true,
            parentSku: true,
            slug: true,
            category: true,
            description: true,
            media: true,
            coverMedia: true
        })


        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const productData = validate.data

        const newProduct = new ProductModel({
            name: productData.name,
            parentSku: productData.parentSku,
            slug: productData.slug,
            category: productData.category,
            description: encode(decodeHTMLDeep(productData.description)),
            media: productData.media,
            coverMedia: pickCoverMedia(productData.coverMedia, productData.media),
        })

        await newProduct.save()

        // The Freshly Arrived section tops up with the newest products, so a new
        // product can change what it shows - refresh that cache.
        revalidateTag('storefront-freshly-arrived-products')
        // A new product changes its category's product count and may become the
        // representative image for the homepage "Categories" section.
        revalidateTag('storefront-home-categories')

        return response(true, 200, 'Product added successfully.', { _id: newProduct._id })

    } catch (error) {
        return catchError(error)
    }
}