import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ParentModel from "@/models/Parent.model"

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            _id: true, name: true, slug: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const { _id, name, slug } = validate.data

        const getParent = await ParentModel.findOne({ deletedAt: null, _id })
        if (!getParent) {
            return response(false, 404, 'Data not found.')
        }

        getParent.name = name
        getParent.slug = slug
        await getParent.save()

        return response(true, 200, 'Parent updated successfully.')

    } catch (error) {
        return catchError(error)
    }
}
