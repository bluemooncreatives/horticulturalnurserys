import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import EnquiryModel from '@/models/Enquiry.model'

export async function GET(request) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()

    const enquiries = await EnquiryModel.find({ deletedAt: null })
      .select('ticketId name email phone address city state pincode country message products status isRead createdAt')
      .sort({ createdAt: -1 })
      .lean()

    // Flatten the products array into a readable summary + count so the CSV
    // export stays a single row per enquiry.
    const rows = enquiries.map((e) => ({
      ...e,
      totalItem: Array.isArray(e.products) ? e.products.length : 0,
      products: Array.isArray(e.products)
        ? e.products.map((p) => `${p.name} (x${p.qty})`).join('; ')
        : '',
    }))

    return response(true, 200, 'Data found.', rows)
  } catch (error) {
    return catchError(error)
  }
}
