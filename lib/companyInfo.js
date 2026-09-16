// Single source of truth for Horticultural Development Centre's real-world
// facts (founding dates, farm size, credentials, flagship projects) so the
// same figure never has to be hand-typed - and risk drifting - in every
// section that quotes it.

export const COMPANY_NAME = 'Horticultural Development Centre'

// The business has operated in Kolkata since 1989; the organisation was
// formally established the following year.
export const OPERATING_SINCE_YEAR = 1989
export const FORMED_YEAR = 1990

// Years-in-business, recomputed on every render so it never goes stale the
// way a hand-typed "35+" did.
export const yearsInBusiness = () => new Date().getFullYear() - OPERATING_SINCE_YEAR

// Own nursery/farm at Bibirhut, near Kolkata.
export const NURSERY_BIGHAS = 50
export const POLYSHED_SQM = 2500
export const GREEN_HOUSE_SQM = 2000
export const FANPAD_SQM = 200
export const UNDER_COVER_SQM = POLYSHED_SQM + GREEN_HOUSE_SQM + FANPAD_SQM // 4,700

export const CPWD_APPROVED = true

// Wholesale plant supply - a distinct line of business from the landscaping/
// design service above: bulk exotic, ornamental and fruit plants despatched
// nationwide by bus, train or courier, sold both online and at the Alipore
// counter. Client-supplied WhatsApp/call number for wholesale enquiries.
export const WHOLESALE_PHONE_DISPLAY = '+91 90882 75576'
export const WHOLESALE_PHONE_TEL = '+919088275576'
export const WHOLESALE_WHATSAPP_URL = 'https://wa.me/919088275576'
export const WHOLESALE_AUDIENCE = 'Nurseries, Landscapers, Garden Centres, Farmers & Plant Lovers'
export const TRANSPORT_MODES = ['Bus', 'Train', 'Courier']

// Flagship projects named by the client - kept as one list so every section
// that name-drops projects draws from the same set.
export const FLAGSHIP_PROJECTS = [
    'Soujanya State Banquet Hall (Alipore)',
    'Krishnanagar IT Park',
    'Jhargram Tourist Lodge',
    'Malda IT Park',
    'Biswa Bangla Khudra Bazar (Bolpur)',
    'West Bengal Legislative Assembly House',
    'National Library',
    'Alipore Zoological Gardens',
    'Rabindra Sarobar Lake',
    'Uttarayan Township',
]
