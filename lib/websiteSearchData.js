import {
    Home,
    Store,
    Crown,
    Info,
    Mail,
    ShieldCheck,
    FileText,
    ShoppingBag,
    CreditCard,
} from 'lucide-react'
import {
    WEBSITE_HOME,
    WEBSITE_SHOP,
    WEBSITE_CART,
    WEBSITE_CHECKOUT,
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
        label: 'Shop All Products',
        description: 'Browse the full collection',
        url: WEBSITE_SHOP,
        icon: Store,
        keywords: ['shop', 'store', 'products', 'collection', 'catalog', 'catalogue', 'browse', 'all', 'new'],
    },
    {
        label: 'Bestsellers',
        description: 'Our most popular products',
        url: `${WEBSITE_SHOP}?bestseller=true`,
        icon: Crown,
        keywords: ['bestseller', 'best seller', 'best sellers', 'popular', 'trending', 'top', 'hot', 'favourite', 'favorite'],
    },
    {
        label: 'About Us',
        description: 'Our story and mission',
        url: '/about-us',
        icon: Info,
        keywords: ['about', 'story', 'company', 'who we are', 'mission', 'brand'],
    },
    {
        label: 'Contact',
        description: 'Get in touch with our team',
        url: '/contact',
        icon: Mail,
        keywords: ['contact', 'support', 'help', 'email', 'reach', 'customer service', 'enquiry', 'inquiry', 'query'],
    },
    {
        label: 'Cart',
        description: 'Items in your shopping bag',
        url: WEBSITE_CART,
        icon: ShoppingBag,
        keywords: ['cart', 'bag', 'basket', 'shopping bag'],
    },
    {
        label: 'Checkout',
        description: 'Complete your purchase',
        url: WEBSITE_CHECKOUT,
        icon: CreditCard,
        keywords: ['checkout', 'buy', 'pay', 'payment', 'place order'],
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
