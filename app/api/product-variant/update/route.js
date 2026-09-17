import { revalidateTag } from "next/cache"
import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import ProductVariantModel from "@/models/ProductVariant.model"


// The cover must be one of the images actually being saved. Anything else - a
// stale id left over after the admin removed that image, or a hand-crafted
// payload - is discarded so `coverMedia` can never dangle.
const pickCoverMedia = (coverMedia, media = []) =>
    coverMedia && media.includes(coverMedia) ? coverMedia : null

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
            product: true,
            sku: true,
            color: true,
            colorHex: true,
            size: true,
            media: true,
            coverMedia: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const validatedData = validate.data

        const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null, _id: validatedData._id })
        if (!getProductVariant) {
            return response(false, 404, 'Data not found.')
        }

        const product = await ProductModel.findOne({ _id: validatedData.product, deletedAt: null }).select('parentSku').lean()

        if (!product) {
            return response(false, 404, 'Product not found.')
        }

        const parentSku = (product.parentSku || '').trim()
        const sku = (validatedData.sku || '').trim()
        const skuPrefix = `${parentSku}-`

        if (!parentSku) {
            return response(false, 400, 'Selected product parent SKU is missing.')
        }

        if (!sku) {
            return response(false, 400, 'SKU is required.')
        }

        if (!sku.startsWith(skuPrefix)) {
            return response(false, 400, 'SKU must start with parent SKU.')
        }

        if (sku === parentSku) {
            return response(false, 400, 'SKU cannot be same as parent SKU.')
        }

        if (sku === skuPrefix || !sku.slice(skuPrefix.length).trim()) {
            return response(false, 400, 'Please add a suffix to SKU.')
        }

        getProductVariant.product = validatedData.product
        getProductVariant.color = validatedData.color
        getProductVariant.colorHex = validatedData.colorHex || ''
        getProductVariant.size = validatedData.size || ''
        getProductVariant.sku = sku
        getProductVariant.media = validatedData.media
        getProductVariant.coverMedia = pickCoverMedia(validatedData.coverMedia, validatedData.media)
        await getProductVariant.save()

        // Colour / media edits can change the shop filter list and the homepage
        // "Shop by Colour" section (label + representative image).
        revalidateTag('storefront-shop-filters')
        revalidateTag('storefront-home-colors')
        // The product page gallery renders the selected variant's media, led by
        // its cover - a cover change has to invalidate that cache too.
        revalidateTag('storefront-product-details')

        return response(true, 200, 'Product variant updated successfully.')

    } catch (error) {
        return catchError(error)
    }
}