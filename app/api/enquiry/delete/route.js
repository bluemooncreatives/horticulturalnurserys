import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import EnquiryModel from '@/models/Enquiry.model'

// Soft delete (SD) or restore (RSD)
export async function PUT(request) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()
    const payload = await request.json()
    const ids = payload.ids || []
    const deleteType = payload.deleteType

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, 'Invalid or empty id list.')
    }

    const found = await EnquiryModel.find({ _id: { $in: ids } }).lean()
    if (!found.length) {
      return response(false, 404, 'Data not found.')
    }

    if (!['SD', 'RSD'].includes(deleteType)) {
      return response(false, 400, 'Delete type must be SD or RSD.')
    }

    await EnquiryModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt: deleteType === 'SD' ? new Date().toISOString() : null } }
    )

    return response(true, 200, deleteType === 'SD' ? 'Moved to trash.' : 'Restored.')
  } catch (error) {
    return catchError(error)
  }
}

// Permanent delete (PD)
export async function DELETE(request) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()
    const payload = await request.json()
    const ids = payload.ids || []

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, 'Invalid or empty id list.')
    }

    const found = await EnquiryModel.find({ _id: { $in: ids } }).lean()
    if (!found.length) {
      return response(false, 404, 'Data not found.')
    }

    await EnquiryModel.deleteMany({ _id: { $in: ids } })

    return response(true, 200, 'Deleted permanently.')
  } catch (error) {
    return catchError(error)
  }
}
