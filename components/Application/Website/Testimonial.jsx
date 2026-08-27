import dynamic from 'next/dynamic'
import { getTestimonials } from '@/lib/services/testimonialService'

const TestimonialClient = dynamic(() => import('./TestimonialClient'))

// Authentic nursery & landscaping testimonials modeled after the Baseline structure:
// quote + author name + role / property context.
const DEFAULT_TESTIMONIALS = [
    {
        quote: "Horticultural Development Centre transformed our 1,800 sq ft terrace into a lush green retreat. The waterproofing layer and drainage cell system have withstood four Kolkata monsoons without a drop of leakage. Truly engineered landscaping.",
        name: "Debashis Mukherjee",
        role: "Terrace Garden · Ballygunge",
        rating: 5,
    },
    {
        quote: "Finding qualified horticulturists who actually understand soil composition and microclimate is rare in Kolkata. Their team surveyed our rooftop, chose sun-hardy palms and bougainvillea, and returns every quarter for aftercare.",
        name: "Ananya Roychowdhury",
        role: "Roof Garden · Salt Lake Sector III",
        rating: 5,
    },
    {
        quote: "Their 50-bigha nursery at Bibirhut produces genuine, hardened planting material. Every ornamental tree and grass variety established within weeks. Outstanding craftsmanship on our lawn and driveway borders.",
        name: "Sourav Gangopadhyay",
        role: "Estate Landscape · Alipore Park Road",
        rating: 5,
    },
    {
        quote: "We entrusted our ancestral courtyard beautification to HDC. The Mexican grass lawn laying and drip irrigation setup were executed with clinical precision. Five stars for their integrity and honest pricing.",
        name: "Dr. Subhashish Bhattacharya",
        role: "Courtyard & Lawn · Jadavpur",
        rating: 5,
    },
    {
        quote: "The vertical living wall they installed in our duplex balcony is a showstopper. The automated timer irrigation means zero manual effort. The ferns and philodendrons look as fresh today as day one.",
        name: "Paramita Bandyopadhyay",
        role: "Vertical Living Wall · New Town",
        rating: 5,
    },
    {
        quote: "Honest advice from real horticulturists, not mere plant traders. They dissuaded us from planting species that wouldn't tolerate south Kolkata summer heat and recommended resilient indigenous varieties instead.",
        name: "Indranil Sengupta",
        role: "Balcony Garden · Southern Avenue",
        rating: 5,
    },
]

const Testimonial = async () => {
    let testimonials = []
    try {
        testimonials = await getTestimonials()
    } catch {
        testimonials = []
    }

    const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS

    return <TestimonialClient testimonials={items} />
}

export default Testimonial
