import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import EnquiryModel, { enquiryStatus } from '@/models/Enquiry.model'
import { isValidObjectId } from 'mongoose'

// Admin: update an enquiry's lifecycle status and/or the internal admin note.
export async function PUT(request) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()
    const { id, status, adminNote } = await request.json()

    if (!isValidObjectId(id)) {
      return response(false, 400, 'Invalid enquiry id.')
    }

    const update = {}

    if (status !== undefined) {
      if (!enquiryStatus.includes(status)) {
        return response(false, 400, 'Invalid status value.')
      }
      update.status = status
    }

    if (adminNote !== undefined) {
      if (typeof adminNote !== 'string' || adminNote.length > 2000) {
        return response(false, 400, 'Invalid admin note.')
      }
      update.adminNote = adminNote.trim()
    }

    if (Object.keys(update).length === 0) {
      return response(false, 400, 'Nothing to update.')
    }

    const enquiry = await EnquiryModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean()
    if (!enquiry) {
      return response(false, 404, 'Enquiry not found.')
    }

    return response(true, 200, 'Enquiry updated.', enquiry)
  } catch (error) {
    return catchError(error)
  }
}
