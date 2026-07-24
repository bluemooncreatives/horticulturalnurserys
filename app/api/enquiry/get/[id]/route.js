import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import EnquiryModel from '@/models/Enquiry.model'
import { isValidObjectId } from 'mongoose'

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()
    const { id } = await params

    if (!isValidObjectId(id)) {
      return response(false, 400, 'Invalid enquiry id.')
    }

    const enquiry = await EnquiryModel.findById(id).lean()
    if (!enquiry) {
      return response(false, 404, 'Enquiry not found.')
    }

    // Auto-mark as read when admin opens it.
    if (!enquiry.isRead) {
      await EnquiryModel.findByIdAndUpdate(id, { isRead: true })
      enquiry.isRead = true
    }

    return response(true, 200, 'Enquiry found.', enquiry)
  } catch (error) {
    return catchError(error)
  }
}
