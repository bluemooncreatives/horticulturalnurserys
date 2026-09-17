import { unstable_cache } from 'next/cache'
import { connectDB } from '@/lib/databaseConnection'
import { escapeRegex } from '@/lib/helperFunction'
import { dedupeColorEntries, normalizeColor } from '@/lib/utils'
import CategoryModel from '@/models/Category.model'
import ParentModel from '@/models/Parent.model'
import ProductModel from '@/models/Product.model'
import ProductVariantModel from '@/models/ProductVariant.model'
import { withCoverFirstAll } from '@/lib/coverMedia'

const toPlainObject = (data) => JSON.parse(JSON.stringify(data))

const normalizeParam = (value) => {
    if (Array.isArray(value)) return value.join(',')
    return value ?? ''
}

// Parents (Plants, Pots & Planters, Manure & Fertilizers, ...) are the layer
// above Category. Only parents that actually hold live products are returned -
// a facet chip that can only ever yield an empty grid is a dead control.
const fetchParentFacets = async () => {
    const [parents, categories, counts] = await Promise.all([
        ParentModel.find({ deletedAt: null }).select('name slug').sort({ createdAt: 1 }).lean(),
        CategoryModel.find({ deletedAt: null }).select('_id parent').lean(),
        ProductModel.aggregate([
            { $match: { deletedAt: null } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]),
    ])

    if (!parents.length) return []

    const countByCategory = new Map(counts.map((row) => [String(row._id), row.count]))

    const countByParent = new Map()
    for (const category of categories) {
        const productCount = countByCategory.get(String(category._id)) || 0
        if (!productCount) continue
        const parentId = String(category.parent)
        countByParent.set(parentId, (countByParent.get(parentId) || 0) + productCount)
    }

    return parents
        .map((parent) => ({
            _id: String(parent._id),
            name: parent.name,
            slug: parent.slug,
            productCount: countByParent.get(String(parent._id)) || 0,
        }))
        .filter((parent) => parent.productCount > 0)
}

const fetchShopFilters = async () => {
    await connectDB()

    const [categories, parents, colorAggregate, sizesAggregate] = await Promise.all([
        CategoryModel.find({ deletedAt: null }).select('name slug').lean(),
        fetchParentFacets(),
        // Group by color name and carry a representative admin-set hex (if any)
        // so the sidebar swatch can render the exact shade.
        ProductVariantModel.aggregate([
            { $match: { deletedAt: null } },
            { $group: { _id: '$color', colorHex: { $max: '$colorHex' } } }
        ]),
        // size is optional, so exclude the sizeless bucket - it would surface
        // as a blank, unclickable facet chip.
        ProductVariantModel.aggregate([
            { $match: { deletedAt: null, size: { $nin: [null, ''] } } },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: '$size',
                    first: { $first: '$_id' }
                }
            },
            { $sort: { first: 1 } },
            { $project: { _id: 0, size: '$_id' } }
        ])
    ])

    const sizes = sizesAggregate.map((item) => item.size).filter(Boolean)

    // Collapse case/whitespace variants so the sidebar shows each color once,
    // carrying through a representative hex for the swatch.
    const colors = dedupeColorEntries(
        colorAggregate.map((item) => ({ name: item._id, hex: item.colorHex }))
    )

    return toPlainObject({ categories, parents, colors, sizes })
}

export const getShopFilters = unstable_cache(
    fetchShopFilters,
    ['storefront-shop-filters'],
    {
        revalidate: 300,
        tags: ['storefront-shop-filters']
    }
)

// Every cold visit to /shop renders the unfiltered first page, and the
// aggregation behind it is the bulk of the route's server response time.
// Cache just that default page briefly - filtered/searched/paged requests
// stay fully dynamic. Product/variant/review edits surface within a minute.
export const getDefaultShopProducts = unstable_cache(
    () => getShopProducts({}),
    ['storefront-shop-default-products'],
    {
        revalidate: 60,
        tags: ['storefront-shop-default-products']
    }
)

export const getShopProducts = async (params = {}) => {
    await connectDB()

    const size = normalizeParam(params.size)
    const color = normalizeParam(params.color)
    const categorySlug = normalizeParam(params.category)
    const parentSlug = normalizeParam(params.parent)
    // Trim + cap length so a stray pasted blob can't build a huge regex.
    const search = normalizeParam(params.q).trim().slice(0, 80)
    const bestsellerOnly = ['true', '1', 'yes'].includes(String(params.bestseller).toLowerCase())
    const freshlyArrivedOnly = ['true', '1', 'yes'].includes(String(params.freshlyArrived).toLowerCase())

    const sizeList = size ? size.split(',').filter(Boolean) : []
    // Lower-cased + canonical so the URL param matches stored colors regardless
    // of casing/whitespace (and so legacy mixed-case data still matches).
    const colorList = color
        ? [...new Set(color.split(',').map((c) => normalizeColor(c)?.toLowerCase()).filter(Boolean))]
        : []

    const limit = Math.min(parseInt(params.limit) || 9, 30)
    const page = Math.max(parseInt(params.page) || 0, 0)
    const skip = page * limit

    // Any unrecognised sort falls back to the default rather than leaving the
    // query unsorted. This matters because the old price_low_high /
    // price_high_low options were removed with the pricing fields: a bookmarked
    // or shared ?sort=price_low_high link would otherwise fall through to the
    // _id tiebreaker alone and silently list oldest-first.
    const SORT_QUERIES = {
        default_sorting: { createdAt: -1 },
        asc: { name: 1 },
        desc: { name: -1 },
    }
    const sortOption = params.sort || 'default_sorting'
    let sortquery = SORT_QUERIES[sortOption] || SORT_QUERIES.default_sorting
    // Stable tiebreaker: without it, products sharing the same primary sort key
    // (e.g. equal createdAt) can reshuffle between pages, causing the same
    // product to appear twice or be skipped entirely as you paginate.
    sortquery = { ...sortquery, _id: 1 }

    let categoryId = []
    if (categorySlug) {
        const slugs = categorySlug.split(',')
        const categoryData = await CategoryModel.find({ deletedAt: null, slug: { $in: slugs } })
            .select('_id')
            .lean()
        categoryId = categoryData.map((category) => category._id)
    }

    if (parentSlug) {
        const parentSlugs = parentSlug.split(',').filter(Boolean)
        const parents = await ParentModel.find({ deletedAt: null, slug: { $in: parentSlugs } })
            .select('_id')
            .lean()
        if (parents.length > 0) {
            const parentIds = parents.map((p) => p._id)
            const categoriesUnderParent = await CategoryModel.find({
                deletedAt: null,
                parent: { $in: parentIds }
            }).select('_id').lean()
            const parentCatIds = categoriesUnderParent.map((c) => c._id)
            if (categoryId.length > 0) {
                categoryId = categoryId.filter((id) =>
                    parentCatIds.some((pid) => String(pid) === String(id))
                )
            } else {
                categoryId = parentCatIds
            }
        }
    }

    let matchStage = { deletedAt: null }
    if (categoryId.length > 0) matchStage.category = { $in: categoryId }
    if (bestsellerOnly) matchStage.isBestseller = true
    if (freshlyArrivedOnly) matchStage.isFreshlyArrived = true

    if (search) {
        matchStage.name = { $regex: escapeRegex(search), $options: 'i' }
    }

    const aggregation = await ProductModel.aggregate([
        { $match: matchStage },
        // Variant filtering (size / color) must run BEFORE pagination.
        // If it ran after $skip/$limit, a page would fetch N products then drop
        // the non-matching ones - returning fewer than `limit` items and making
        // the total count (and therefore the page count) impossible to know.
        {
            $lookup: {
                from: 'productvariants',
                let: { productId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$product', '$$productId'] },
                                    { $eq: ['$deletedAt', null] },
                                    sizeList.length > 0 ? { $in: ['$size', sizeList] } : { $literal: true },
                                    colorList.length > 0 ? { $in: [{ $toLower: { $trim: { input: '$color' } } }, colorList] } : { $literal: true },
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            size: 1,
                            color: 1,
                        }
                    },
                    {
                        $limit: 1
                    }
                ],
                as: 'matchedVariants'
            }
        },
        {
            $match: { 'matchedVariants.0': { $exists: true } }
        },
        { $sort: sortquery },
        {
            // One round-trip returns both the total (for page count) and just the
            // current page's documents. The expensive reviews/media lookups live
            // inside the `data` branch so they only run for the page being shown.
            $facet: {
                meta: [{ $count: 'total' }],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: 'reviews',
                            let: { productId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$product', '$$productId'] },
                                                { $eq: ['$deletedAt', null] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        avg: { $avg: '$rating' },
                                        count: { $sum: 1 }
                                    }
                                }
                            ],
                            as: 'reviewStats'
                        }
                    },
                    {
                        $addFields: {
                            ratingAvg: { $ifNull: [{ $arrayElemAt: ['$reviewStats.avg', 0] }, 0] },
                            ratingCount: { $ifNull: [{ $arrayElemAt: ['$reviewStats.count', 0] }, 0] },
                            defaultVariant: { $arrayElemAt: ['$matchedVariants', 0] }
                        }
                    },
                    {
                        // Looked up into a scratch field, NOT straight into
                        // `media`: writing to `media` would clobber the ordered
                        // array of ids, and $lookup returns its matches in the
                        // collection's own order, not the order they were asked
                        // for. That is what made the shop grid lead with an
                        // arbitrary photo.
                        $lookup: {
                            from: 'medias',
                            let: { mediaIds: '$media' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ['$_id', '$$mediaIds']
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        secure_url: 1,
                                        alt: 1
                                    }
                                }
                            ],
                            as: 'mediaDocs'
                        }
                    },
                    {
                        // Re-seat the looked-up docs into the admin's selection
                        // order by walking the original id array. $filter drops
                        // ids whose media row was deleted, so a stale id leaves a
                        // gap rather than a null the card would try to render.
                        $addFields: {
                            media: {
                                $filter: {
                                    input: {
                                        $map: {
                                            input: '$media',
                                            as: 'mediaId',
                                            in: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$mediaDocs',
                                                            cond: { $eq: ['$$this._id', '$$mediaId'] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        }
                                    },
                                    cond: { $ne: ['$$this', null] }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            slug: 1,
                            ratingAvg: 1,
                            ratingCount: 1,
                            defaultVariant: {
                                _id: 1,
                                size: 1,
                                color: 1
                            },
                            coverMedia: 1,
                            media: {
                                _id: 1,
                                secure_url: 1,
                                alt: 1
                            }
                        }
                    }
                ]
            }
        }
    ])

    const facet = aggregation[0] || { meta: [], data: [] }
    const total = facet.meta?.[0]?.total || 0
    // `media` is back in the admin's selection order by this point, so this only
    // has to honour an explicitly chosen cover; products without one correctly
    // fall back to the first selected image.
    const products = withCoverFirstAll(facet.data || [])
    const totalPages = Math.ceil(total / limit)
    // Kept for backward compatibility with any infinite-scroll consumer.
    const nextPage = page + 1 < totalPages ? page + 1 : null

    return toPlainObject({ products, nextPage, total, totalPages, page })
}
