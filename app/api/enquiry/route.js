import { enquiryNotification } from '@/email/enquiryNotification'
import { enquiryConfirmation } from '@/email/enquiryConfirmation'
import { catchError, response, escapeRegex } from '@/lib/helperFunction'
import { generateTicketId } from '@/lib/generateTicketId'
import { sendMail } from '@/lib/sendMail'
import { connectDB } from '@/lib/databaseConnection'
import { isAuthenticated } from '@/lib/authentication'
import { MAX_CART_QTY } from '@/lib/cartConstants'
import EnquiryModel from '@/models/Enquiry.model'
import ProductVariantModel from '@/models/ProductVariant.model'
import { NextResponse } from 'next/server'

const clampQty = (value) => {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(MAX_CART_QTY, n)
}

// Public: submit a product enquiry (the cart → enquiry flow). No customer auth
// exists on this site by design, so this endpoint is intentionally open - it is
// hardened with strict validation, a honeypot and a hard cap on line items.
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      message,
      products,
      company, // honeypot - real users never see or fill this
    } = body

    // Honeypot: a filled hidden field means a bot. Return a benign success so the
    // bot gets no signal, but persist nothing.
    if (typeof company === 'string' && company.trim().length > 0) {
      return response(true, 200, 'Enquiry submitted successfully.', { ticketId: null })
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return response(false, 400, 'Name is required.')
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response(false, 400, 'A valid email is required.')
    }
    if (!phone || !/^[+\d][\d\s()-]{6,19}$/.test(String(phone).trim())) {
      return response(false, 400, 'A valid mobile number is required.')
    }
    if (name.trim().length > 100) {
      return response(false, 400, 'Name exceeds maximum allowed length.')
    }
    if (message && String(message).trim().length > 2000) {
      return response(false, 400, 'Note exceeds maximum allowed length.')
    }
    if (address && String(address).trim().length > 300) {
      return response(false, 400, 'Address exceeds maximum allowed length.')
    }

    if (!Array.isArray(products) || products.length === 0) {
      return response(false, 400, 'Your enquiry list is empty. Add at least one product.')
    }
    if (products.length > 100) {
      return response(false, 400, 'Too many items in a single enquiry.')
    }

    await connectDB()

    // Server is authoritative: never trust the client's product names/variants.
    // Re-verify every line against live, non-deleted variants (and their parent
    // product), rebuild the display snapshot from the DB, and quietly drop any
    // line whose variant/product no longer exists.
    const requestedQtyByVariant = new Map()
    for (const item of products) {
      const variantId = item?.variantId ? String(item.variantId) : null
      if (!variantId) continue
      requestedQtyByVariant.set(variantId, clampQty(item.qty))
    }

    const variantIds = [...requestedQtyByVariant.keys()]
    const variants = variantIds.length
      ? await ProductVariantModel.find({ _id: { $in: variantIds }, deletedAt: null })
          .populate('product', 'name slug deletedAt')
          .lean()
      : []

    const verifiedItems = variants
      .filter((variant) => variant.product && !variant.product.deletedAt)
      .map((variant) => ({
        productId: variant.product._id,
        variantId: variant._id,
        name: variant.product.name,
        slug: variant.product.slug || '',
        size: variant.size || '',
        color: variant.color || '',
        qty: requestedQtyByVariant.get(String(variant._id)) || 1,
      }))

    if (verifiedItems.length === 0) {
      return response(
        false,
        400,
        'None of the products in your enquiry are available anymore. Please refresh and try again.'
      )
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
      address: address ? String(address).trim() : '',
      city: city ? String(city).trim() : '',
      state: state ? String(state).trim() : '',
      pincode: pincode ? String(pincode).trim() : '',
      country: country ? String(country).trim() : '',
      message: message ? String(message).trim() : '',
      products: verifiedItems,
    }

    // Mint a unique, human-readable reference with a few retries on the (rare)
    // duplicate-key collision, so a random-id clash never fails the submission.
    let enquiry = null
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        enquiry = await EnquiryModel.create({
          ...payload,
          ticketId: generateTicketId(),
        })
        break
      } catch (err) {
        const isDuplicateTicket =
          err?.code === 11000 && err?.keyPattern && 'ticketId' in err.keyPattern
        if (isDuplicateTicket && attempt < 4) continue
        throw err
      }
    }

    const ticketId = enquiry.ticketId
    const emailPayload = { ...payload, ticketId }

    // Notify the store inbox and acknowledge the customer. Both are best-effort:
    // the enquiry is already saved and sendMail never throws, so a mail outage
    // must not break the customer-facing flow.
    await Promise.allSettled([
      sendMail(
        `New Product Enquiry [${ticketId}] - from ${payload.name}`,
        process.env.NODEMAILER_EMAIL,
        enquiryNotification(emailPayload),
        { replyTo: payload.email }
      ),
      sendMail(
        `We've received your enquiry - Ref ${ticketId}`,
        payload.email,
        enquiryConfirmation(emailPayload)
      ),
    ])

    return response(true, 200, 'Enquiry submitted successfully.', { ticketId })
  } catch (error) {
    return catchError(error, 'Failed to submit enquiry.')
  }
}

// Admin: paginated list for the enquiries datatable. Mirrors /api/contact GET.
export async function GET(request) {
  try {
    const auth = await isAuthenticated('admin')
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized.')
    }

    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const start = parseInt(searchParams.get('start') || 0, 10)
    const size = parseInt(searchParams.get('size') || 10, 10)
    const filters = JSON.parse(searchParams.get('filters') || '[]')
    const globalFilter = searchParams.get('globalFilter') || ''
    const sorting = JSON.parse(searchParams.get('sorting') || '[]')
    const deleteType = searchParams.get('deleteType')

    let matchQuery = {}
    if (deleteType === 'SD') {
      matchQuery = { deletedAt: null }
    } else if (deleteType === 'PD') {
      matchQuery = { deletedAt: { $ne: null } }
    }

    if (globalFilter) {
      const safe = escapeRegex(globalFilter)
      matchQuery['$or'] = [
        { ticketId: { $regex: safe, $options: 'i' } },
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
        { phone: { $regex: safe, $options: 'i' } },
        { city: { $regex: safe, $options: 'i' } },
        { status: { $regex: safe, $options: 'i' } },
      ]
    }

    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: escapeRegex(filter.value), $options: 'i' }
    })

    let sortQuery = {}
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1
    })

    const aggregatePipeline = [
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $addFields: {
          totalItem: { $size: { $ifNull: ['$products', []] } },
        },
      },
    ]

    const enquiries = await EnquiryModel.aggregate(aggregatePipeline)
    const totalRowCount = await EnquiryModel.countDocuments(matchQuery)

    return NextResponse.json({
      success: true,
      data: enquiries,
      meta: { totalRowCount },
    })
  } catch (error) {
    return catchError(error)
  }
}
