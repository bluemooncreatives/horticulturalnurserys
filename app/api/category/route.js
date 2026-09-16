import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, escapeRegex, response } from "@/lib/helperFunction"
import CategoryModel from "@/models/Category.model"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

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

        // Global search 
        if (globalFilter) {
            matchQuery["$or"] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } },
            ]
        }

        //  Column filteration  

        filters.forEach(filter => {
            if (filter.id === 'parent') {
                // The toolbar sends a parent _id. Match the raw ObjectId rather
                // than the joined `parentData.name`: it is exact, it uses the
                // index, and - because it is a field on the category itself -
                // the countDocuments() below stays correct without having to
                // repeat the $lookup.
                //
                // An unparseable id (stale bookmark, hand-edited request) must
                // return an empty page. $in: [] matches nothing; null would
                // wrongly match categories that genuinely have no parent.
                matchQuery.parent = mongoose.isValidObjectId(filter.value)
                    ? new mongoose.Types.ObjectId(String(filter.value))
                    : { $in: [] }
                return
            }
            matchQuery[filter.id] = { $regex: escapeRegex(String(filter.value)), $options: 'i' }
        });

        //   Sorting  
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });


        // Aggregate pipeline

        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'parents',
                    localField: 'parent',
                    foreignField: '_id',
                    as: 'parentData'
                }
            },
            {
                $unwind: {
                    path: "$parentData", preserveNullAndEmptyArrays: true
                }
            },
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
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1
                }
            }
        ]

        // Execute query  

        const getCategory = await CategoryModel.aggregate(aggregatePipeline)

        // Get totalRowCount  
        const totalRowCount = await CategoryModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getCategory,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}