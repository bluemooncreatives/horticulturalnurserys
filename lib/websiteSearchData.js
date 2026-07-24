import {
    Home,
    Store,
    Crown,
    Info,
    Mail,
    ShieldCheck,
    FileText,
    ClipboardList,
    Send,
} from 'lucide-react'
import {
    WEBSITE_HOME,
    WEBSITE_SHOP,
    WEBSITE_CART,
    WEBSITE_ENQUIRY,
} from '@/routes/WebsiteRoute'

const websiteSearchData = [
    {
        label: 'Home',
        description: 'Back to the homepage',
        url: WEBSITE_HOME,
        icon: Home,
        keywords: ['home', 'main', 'landing', 'start'],
    },
    {
        label: 'Full Catalogue',
        description: 'Plants, manure, pots, implements and more',
        url: WEBSITE_SHOP,
        icon: Store,
        keywords: [
            'shop', 'store', 'products', 'catalog', 'catalogue', 'browse', 'all', 'new',
            'plant', 'plants', 'tree', 'shrub', 'indoor', 'hanging', 'creeper', 'topiary',
            'flower', 'seasonal', 'seed', 'seedling', 'grass', 'lawn', 'manure', 'compost',
            'fertiliser', 'fertilizer', 'insecticide', 'pot', 'planter', 'implement', 'tool',
            'cocopeat', 'pebble', 'soil', 'cowdung', 'roof garden', 'geotextile', 'drain cell',
        ],
    },
    {
        label: 'Bestsellers',
        description: 'What moves fastest off the counter',
        url: `${WEBSITE_SHOP}?bestseller=true`,
        icon: Crown,
        keywords: ['bestseller', 'best seller', 'best sellers', 'popular', 'trending', 'top', 'hot', 'favourite', 'favorite'],
    },
    {
        label: 'About Us',
        description: 'Our nursery, our landscaping work, since 1989',
        url: '/about-us',
        icon: Info,
        keywords: ['about', 'story', 'company', 'who we are', 'nursery', 'farm', 'bibirhut', 'landscaping', 'history'],
    },
    {
        label: 'Contact',
        description: 'Site visits, enquiries and our Alipore counter',
        url: '/contact',
        icon: Mail,
        keywords: ['contact', 'support', 'help', 'email', 'phone', 'address', 'alipore', 'kolkata', 'site visit', 'enquiry', 'inquiry', 'query', 'quotation', 'quote'],
    },
    {
        label: 'Enquiry List',
        description: 'Products you have added to enquire about',
        url: WEBSITE_CART,
        icon: ClipboardList,
        keywords: ['cart', 'list', 'enquiry list', 'basket', 'my enquiry', 'selected'],
    },
    {
        label: 'Submit Enquiry',
        description: 'Send us your enquiry and get availability & pricing',
        url: WEBSITE_ENQUIRY,
        icon: Send,
        keywords: ['enquiry', 'inquiry', 'enquire', 'quote', 'quotation', 'request', 'submit', 'contact'],
    },
    {
        label: 'Privacy Policy',
        description: 'How we handle your data',
        url: '/privacy-policy',
        icon: ShieldCheck,
        keywords: ['privacy', 'policy', 'data', 'gdpr'],
    },
    {
        label: 'Terms & Conditions',
        description: 'Our terms of service',
        url: '/terms-and-conditions',
        icon: FileText,
        keywords: ['terms', 'conditions', 'tos', 'legal', 'agreement', 'refund', 'return'],
    },
]

export default websiteSearchData
