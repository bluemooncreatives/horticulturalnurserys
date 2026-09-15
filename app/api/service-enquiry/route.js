import { contactNotification } from '@/email/contactNotification'
import { contactConfirmation } from '@/email/contactConfirmation'
import { catchError, response } from '@/lib/helperFunction'
import { generateTicketId } from '@/lib/generateTicketId'
import { sendMail } from '@/lib/sendMail'
import ContactModel from '@/models/Contact.model'
import { connectDB } from '@/lib/databaseConnection'

const ALLOWED_SERVICES = {
  'landscape-development': 'Landscape Development',
  'garden-maintenance': 'Garden Maintenance & Aftercare',
  'roof-garden': 'Roof Garden Design',
  'vertical-garden': 'Vertical Garden Systems',
  'Landscape Development': 'Landscape Development',
  'Garden Maintenance & Aftercare': 'Garden Maintenance & Aftercare',
  'Garden Maintenance': 'Garden Maintenance & Aftercare',
  'Roof Garden Design': 'Roof Garden Design',
  'Roof Garden': 'Roof Garden Design',
  'Vertical Garden Systems': 'Vertical Garden Systems',
  'Vertical Garden': 'Vertical Garden Systems',
}

// Public: submit service enquiry from /services page
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      serviceType,
      projectScale,
      preferredTimeline,
      message,
      company, // honeypot
    } = body

    // Honeypot: bot traps
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
    if (!serviceType || !ALLOWED_SERVICES[serviceType.trim()]) {
      return response(false, 400, 'Please select a valid service.')
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return response(false, 400, 'Please provide project details (minimum 10 characters).')
    }
    if (name.trim().length > 100 || message.trim().length > 2000) {
      return response(false, 400, 'Input exceeds maximum allowed length.')
    }
    if (address && address.trim().length > 300) {
      return response(false, 400, 'Address exceeds maximum allowed length.')
    }

    const canonicalServiceName = ALLOWED_SERVICES[serviceType.trim()]
    const subject = `Service Enquiry: ${canonicalServiceName}`

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
      address: address?.trim() || '',
      subject,
      serviceType: canonicalServiceName,
      projectScale: projectScale?.trim() || '',
      preferredTimeline: preferredTimeline?.trim() || '',
      message: message.trim(),
    }

    await connectDB()

    let contact = null
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        contact = await ContactModel.create({
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

    const ticketId = contact.ticketId
    const emailPayload = { ...payload, ticketId }

    // Best-effort emails (never blocks the client)
    await Promise.allSettled([
      sendMail(
        `New Service Enquiry [${ticketId}]: ${canonicalServiceName} - from ${payload.name}`,
        process.env.NODEMAILER_EMAIL,
        contactNotification(emailPayload),
        { replyTo: payload.email }
      ),
      sendMail(
        `We've received your service enquiry - Ref ${ticketId}`,
        payload.email,
        contactConfirmation(emailPayload)
      ),
    ])

    return response(true, 200, 'Service enquiry submitted successfully.', {
      ticketId,
      service: canonicalServiceName,
    })
  } catch (error) {
    return catchError(error, 'Failed to submit service enquiry.')
  }
}
