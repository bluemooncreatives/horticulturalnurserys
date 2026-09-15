import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import ContactModel from '@/models/Contact.model'

export async function GET(request) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()

    const kind = request.nextUrl.searchParams.get('kind')
    const matchQuery = { deletedAt: null }
    if (kind === 'general') {
      matchQuery.serviceType = { $in: [null, ''] }
    } else if (kind === 'service') {
      matchQuery.serviceType = { $nin: [null, ''] }
    }

    const contacts = await ContactModel.find(matchQuery)
      .select(
        'ticketId name email phone address subject serviceType projectScale preferredTimeline message isRead createdAt'
      )
      .sort({ createdAt: -1 })
      .lean()

    return response(true, 200, 'Data found.', contacts)
  } catch (error) {
    return catchError(error)
  }
}
