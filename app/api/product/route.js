import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, escapeRegex, response } from "@/lib/helperFunction"
import ProductModel from "@/models/Product.model"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

// A product only stores `category`; the parent lives one hop further, on the
// category. Both joins are needed by the list, the search, the filters and the
// row count, so they are defined once and reused by every pipeline below.
const lookupStages = [
    {
        $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryData'
        }
    },
    {
        $unwind: {
            path: "$categoryData", preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'parents',
            localField: 'categoryData.parent',
            foreignField: '_id',
            as: 'parentData'
        }
    },
    {
        $unwind: {
            path: "$parentData", preserveNullAndEmptyArrays: true
        }
    },
]

// The toolbar filters send ids, not names. `category` is a field on the product
// itself; `parent` only exists on the joined category.
const ID_FILTER_FIELDS = {
    category: 'category',
    parent: 'categoryData.parent',
}

// Sorting by the raw `category` column would order by ObjectId, which looks
// random to anyone reading the table. Sort by the joined display name instead.
const SORT_FIELDS = {
    category: 'categoryData.name',
    parent: 'parentData.name',
}

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const searchParams = request.nextUrl.searchParams

        // Extract query parameters 
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || "[]")
        const globalFilter = searchParams.get('globalFilter') || ""
        const sorting = JSON.parse(searchParams.get('sorting') || "[]")
        const deleteType = searchParams.get('deleteType')

        // Build match query  
        let matchQuery = {}

        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        // Global search - escape so special chars don't build an invalid regex
        if (globalFilter) {
            const safeGlobalFilter = escapeRegex(globalFilter)
            matchQuery["$or"] = [
                { name: { $regex: safeGlobalFilter, $options: 'i' } },
                { slug: { $regex: safeGlobalFilter, $options: 'i' } },
                { "categoryData.name": { $regex: safeGlobalFilter, $options: 'i' } },
                { "parentData.name": { $regex: safeGlobalFilter, $options: 'i' } },
            ]
        }

        //  Column filteration

        filters.forEach(filter => {
            const idField = ID_FILTER_FIELDS[filter.id]
            if (idField) {
                // Match the ObjectId exactly rather than a regex on the joined
                // name: two categories sharing a name stay distinct and "Pots"
                // cannot half-match "Pots & Planters".
                //
                // An unparseable id (stale bookmark, hand-edited request) must
                // return an empty page. $in: [] matches nothing; null would
                // wrongly match rows that have no category/parent at all.
                matchQuery[idField] = mongoose.isValidObjectId(filter.value)
                    ? new mongoose.Types.ObjectId(String(filter.value))
                    : { $in: [] }
                return
            }
            matchQuery[filter.id] = { $regex: escapeRegex(String(filter.value)), $options: 'i' }
        });

        //   Sorting  
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[SORT_FIELDS[sort.id] ?? sort.id] = sort.desc ? -1 : 1
        });


        // Aggregate pipeline  

        const aggregatePipeline = [
            ...lookupStages,
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    parent: "$parentData.name",
                    category: "$categoryData.name",
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1
                }
            }
        ]

        // Execute query  

        const getProduct = await ProductModel.aggregate(aggregatePipeline)

        // Get totalRowCount. countDocuments() cannot see `categoryData` or
        // `parentData`, so it silently reported the unfiltered total (and a
        // pager for pages that do not exist) whenever the search or a filter
        // touched a joined field. Count through the same joins instead.
        const [countResult] = await ProductModel.aggregate([
            ...lookupStages,
            { $match: matchQuery },
            { $count: 'count' },
        ])
        const totalRowCount = countResult?.count ?? 0

        return NextResponse.json({
            success: true,
            data: getProduct,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}
