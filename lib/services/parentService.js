import { unstable_cache } from 'next/cache'
import { connectDB } from '@/lib/databaseConnection'
import ParentModel from '@/models/Parent.model'
import CategoryModel from '@/models/Category.model'
import ProductModel from '@/models/Product.model'
import '@/models/Media.model'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const toPlainObject = (data) => JSON.parse(JSON.stringify(data))

// Fallback high-res nursery photos for parents that do not have active products uploaded yet.
const PARENT_FALLBACK_IMAGES = {
    'plants': 'https://res.cloudinary.com/heog9fna/image/upload/v1787667632/a46iwjobo3mjblaojzid.jpg',
    'seasonal-flowering-plants': 'https://res.cloudinary.com/heog9fna/image/upload/v1787578383/usn3usn3621dmmxihpoa.png',
    'carpet-grass-for-lawn': 'https://res.cloudinary.com/heog9fna/image/upload/v1787581409/h7bfudgmmqcjmsdfxmix.png',
    'seeds-and-seedlings': 'https://res.cloudinary.com/heog9fna/image/upload/v1787579593/vjl45wmrpgmdt3nzmnph.png',
    'manure-and-fertilizers': 'https://res.cloudinary.com/heog9fna/image/upload/v1787670144/s04glpcbqnagzwspbcqd.jpg',
    'insecticide': 'https://res.cloudinary.com/heog9fna/image/upload/v1787667628/iextcolnp0tfogckxalf.jpg',
    'pots-and-planters': 'https://res.cloudinary.com/heog9fna/image/upload/v1787582960/v4eqqykn0xejotzkfjc3.jpg',
    'roof-garden-materials': 'https://res.cloudinary.com/heog9fna/image/upload/v1787583708/f9pdhwbh9tpd4ji5kzph.jpg',
    'growing-media': 'https://res.cloudinary.com/heog9fna/image/upload/v1787667630/zuiiigfsl9h1rupinhq0.jpg',
}

const DEFAULT_FALLBACK_IMAGE = 'https://res.cloudinary.com/heog9fna/image/upload/v1787667632/a46iwjobo3mjblaojzid.jpg'

const fetchHomeParents = async () => {
    await connectDB()

    const parents = await ParentModel.find({ deletedAt: null }).sort({ createdAt: 1 }).lean()
    if (!parents || parents.length === 0) return []

    const parentIds = parents.map((p) => p._id)

    // Find all active categories for all parents
    const categories = await CategoryModel.find({
        deletedAt: null,
        parent: { $in: parentIds }
    }).select('_id parent').lean()

    const catToParent = new Map()
    const allCatIds = []
    for (const c of categories) {
        catToParent.set(String(c._id), String(c.parent))
        allCatIds.push(c._id)
    }

    let imageByParent = new Map()
    let countByParent = new Map()

    if (allCatIds.length > 0) {
        // Aggregate product counts per category
        const counts = await ProductModel.aggregate([
            { $match: { deletedAt: null, category: { $in: allCatIds } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ])

        for (const row of counts) {
            const pId = catToParent.get(String(row._id))
            if (pId) {
                countByParent.set(pId, (countByParent.get(pId) || 0) + row.count)
            }
        }

        // Aggregate newest active image per category
        const imageRows = await ProductModel.aggregate([
            { $match: { deletedAt: null, category: { $in: allCatIds } } },
            { $sort: { createdAt: -1, _id: -1 } },
            {
                $lookup: {
                    from: 'medias',
                    let: { mediaIds: { $ifNull: ['$media', []] } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$_id', '$$mediaIds'] },
                                        { $eq: ['$deletedAt', null] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, secure_url: 1, alt: 1 } },
                        { $limit: 1 }
                    ],
                    as: 'firstMedia'
                }
            },
            { $match: { 'firstMedia.0': { $exists: true } } },
            {
                $project: {
                    category: 1,
                    image: { $arrayElemAt: ['$firstMedia', 0] }
                }
            }
        ])

        for (const row of imageRows) {
            const pId = catToParent.get(String(row.category))
            if (pId && !imageByParent.has(pId)) {
                imageByParent.set(pId, row.image?.secure_url)
            }
        }
    }

    const items = parents.map((parent) => {
        const id = String(parent._id)
        const count = countByParent.get(id) || 0
        const resolvedImage = imageByParent.get(id)
            || PARENT_FALLBACK_IMAGES[parent.slug]
            || DEFAULT_FALLBACK_IMAGE

        return {
            id: `parent-${id}`,
            name: parent.name,
            slug: parent.slug,
            href: `${WEBSITE_SHOP}?parent=${encodeURIComponent(parent.slug)}`,
            previewImage: resolvedImage,
            alt: parent.name,
            productCount: count
        }
    })

    return toPlainObject(items)
}

export const getHomeParents = unstable_cache(
    fetchHomeParents,
    ['storefront-home-parents'],
    {
        revalidate: 300,
        tags: ['storefront-home-parents', 'storefront-home-categories']
    }
)
