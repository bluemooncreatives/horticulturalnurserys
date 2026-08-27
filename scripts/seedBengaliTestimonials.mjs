import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. Read .env to get MONGODB_URI
const envPath = path.resolve(__dirname, '../.env')
const envContent = fs.readFileSync(envPath, 'utf8')

let mongodbUri = ''
for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('MONGODB_URI=')) {
        mongodbUri = trimmed.replace('MONGODB_URI=', '').replace(/^["']|["']$/g, '').trim()
        break
    }
}

if (!mongodbUri) {
    console.error('MONGODB_URI not found in .env')
    process.exit(1)
}

console.log('Connecting to MongoDB...')

// 2. Define schema
const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    role: { type: String, trim: true, default: 'Verified Client · Kolkata' },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    deletedAt: { type: Date, default: null, index: true },
}, { timestamps: true })

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema, 'testimonials')

// 3. Unique Bengali Testimonials
const BENGALI_TESTIMONIALS = [
    {
        name: "Debashis Mukherjee",
        role: "Terrace Garden · Ballygunge",
        rating: 5,
        sortOrder: 1,
        review: "Horticultural Development Centre transformed our 1,800 sq ft terrace into a lush green retreat. The waterproofing layer and drainage cell system have withstood four Kolkata monsoons without a drop of leakage. Truly engineered landscaping.",
    },
    {
        name: "Ananya Roychowdhury",
        role: "Roof Garden · Salt Lake Sector III",
        rating: 5,
        sortOrder: 2,
        review: "Finding qualified horticulturists who actually understand soil composition and microclimate is rare in Kolkata. Their team surveyed our rooftop, chose sun-hardy palms and bougainvillea, and returns every quarter for aftercare.",
    },
    {
        name: "Sourav Gangopadhyay",
        role: "Estate Landscape · Alipore Park Road",
        rating: 5,
        sortOrder: 3,
        review: "Their 50-bigha nursery at Bibirhut produces genuine, hardened planting material. Every ornamental tree and grass variety established within weeks. Outstanding craftsmanship on our lawn and driveway borders.",
    },
    {
        name: "Dr. Subhashish Bhattacharya",
        role: "Courtyard & Lawn · Jadavpur",
        rating: 5,
        sortOrder: 4,
        review: "We entrusted our ancestral courtyard beautification to HDC. The Mexican grass lawn laying and drip irrigation setup were executed with clinical precision. Five stars for their integrity and honest pricing.",
    },
    {
        name: "Paramita Bandyopadhyay",
        role: "Vertical Living Wall · New Town",
        rating: 5,
        sortOrder: 5,
        review: "The vertical living wall they installed in our duplex balcony is a showstopper. The automated timer irrigation means zero manual effort. The ferns and philodendrons look as fresh today as day one.",
    },
    {
        name: "Indranil Sengupta",
        role: "Balcony Garden · Southern Avenue",
        rating: 5,
        sortOrder: 6,
        review: "Honest advice from real horticulturists, not mere plant traders. They dissuaded us from planting species that wouldn't tolerate south Kolkata summer heat and recommended resilient indigenous varieties instead.",
    },
    {
        name: "Madhuchhanda Majumdar",
        role: "Terrace Orchard · Behala Chowrasta",
        rating: 5,
        sortOrder: 7,
        review: "From lightweight growing media to fruit-bearing dwarf varieties, their terrace garden execution was flawless. We harvested fresh Kagzi lemons and guavas in the very first season!",
    },
    {
        name: "Capt. Arindam Chattopadhyay",
        role: "Villa Landscape · Rajarhat Township",
        rating: 5,
        sortOrder: 8,
        review: "Comprehensive service under one single roof — site design, soil enrichment, plant supply from their own farm, and scheduled maintenance. The team takes immense pride in their work.",
    },
    {
        name: "Kakoli Ghoshal",
        role: "Boutique Garden · South City",
        rating: 5,
        sortOrder: 9,
        review: "Their showroom at Alipore is a treasure trove for garden lovers. The imported ceramic pots, organic manure, and potting mix are top quality. The Alipore counter staff are immensely knowledgeable.",
    },
    {
        name: "Tathagata Chakraborty",
        role: "Heritage Grounds · Burdwan",
        rating: 5,
        sortOrder: 10,
        review: "Their landscaping team handled our institutional lawns with deep respect for the historic architecture. Proper grading, sprinkler lines, and royal palms that look majestic.",
    },
]

async function run() {
    try {
        await mongoose.connect(mongodbUri, {
            dbName: 'YT-NEXTJS-ECOMMERCE',
        })
        console.log('Connected to MongoDB successfully!')

        // Remove old generic testimonials to avoid clutter
        const deleteResult = await Testimonial.deleteMany({})
        console.log(`Cleared ${deleteResult.deletedCount} existing testimonials.`)

        // Insert new Bengali testimonials
        const docs = await Testimonial.insertMany(BENGALI_TESTIMONIALS)
        console.log(`Successfully inserted ${docs.length} unique Bengali testimonials:`)
        docs.forEach((doc, i) => {
            console.log(`  ${i + 1}. ${doc.name} (${doc.role})`)
        })

        console.log('\nSeed completed successfully!')
        process.exit(0)
    } catch (err) {
        console.error('Error seeding testimonials:', err)
        process.exit(1)
    }
}

run()
