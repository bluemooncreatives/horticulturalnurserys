import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { isValidObjectId } from "mongoose";
import ParentModel from "@/models/Parent.model";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 400, 'Invalid object id.')
        }

        filter._id = id

        const getParent = await ParentModel.findOne(filter).lean()

        if (!getParent) {
            return response(false, 404, 'Parent not found.')
        }

        return response(true, 200, 'Parent found.', getParent)

    } catch (error) {
        return catchError(error)
    }
}
