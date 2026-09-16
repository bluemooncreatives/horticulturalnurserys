import GlobalProvider from "@/components/Application/GlobalProvider";
import LenisProvider from '@/components/Application/LenisProvider'
import { Toaster } from "@/components/ui/sonner";
import JsonLd from "@/components/Application/Website/JsonLd";
import { FORMED_YEAR, WHOLESALE_PHONE_TEL } from "@/lib/companyInfo";
import "./globals.css";

const SITE_URL = 'https://www.horticulturaldevelopmentcentre.com'

// GardenStore (schema.org's dedicated type for nurseries/garden centres) doubling
// as the LocalBusiness record - powers the knowledge-panel-style rich result
// (address, hours, phone, map pin) for brand-name searches. Rendered once, here,
// so every page carries it without repeating the same facts per route.
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GardenStore',
  '@id': `${SITE_URL}/#business`,
  name: 'Horticultural Development Centre',
  image: `${SITE_URL}/assets/images/hero/01.jpg`,
  url: SITE_URL,
  telephone: '+91-33-2479-5710',
  email: 'horticulturaldc@gmail.com',
  foundingDate: String(FORMED_YEAR),
  // Bulk/wholesale plant orders (nurseries, landscapers, garden centres,
  // farmers) are quoted and despatched pan-India, distinct from the local
  // Alipore sale-counter line above.
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: WHOLESALE_PHONE_TEL,
    areaServed: 'IN',
    availableLanguage: ['en', 'hi', 'bn'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2/5 Judges Court Road, Alipore',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    postalCode: '700027',
    addressCountry: 'IN',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '19:00',
  },
  sameAs: [
    'https://www.instagram.com/horticulturaldevelopmentcentre/',
    'https://www.facebook.com/horticulturaldevelopmentcentre',
    'https://wa.me/919088275576',
  ],
  // Landscaping/maintenance is Kolkata-local, but wholesale plant supply
  // (bus/train/courier despatch) reaches customers across the country.
  areaServed: [
    { '@type': 'City', name: 'Kolkata' },
    { '@type': 'Country', name: 'India' },
  ],
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
    template: '%s | Horticultural Development Centre',
  },
  description:
    'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance, plus a 50-bigha nursery and an Alipore outlet stocking plants, manure, pots, garden implements and roof-garden materials under one roof. Wholesale plant supply across India.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Horticultural Development Centre',
    title: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
    description:
      'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance, plus a 50-bigha nursery and an Alipore outlet stocking plants, manure, pots, garden implements and roof-garden materials under one roof.',
    url: 'https://www.horticulturaldevelopmentcentre.com',
    images: [
      {
        url: '/assets/images/hero/01.jpg',
        width: 1200,
        height: 630,
        alt: 'Horticultural Development Centre - landscaping and plant nursery, Kolkata',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
    description:
      'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance, plus a 50-bigha nursery and an Alipore outlet stocking everything a garden needs.',
    images: ['/assets/images/hero/01.jpg'],
  },
  other: {
    'theme-color': '#F4F3F1',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <head>
        {/* Cloudinary serves the hero images, product images, about-us photos and Instagram videos.
            Preconnecting to Cloudinary speeds up TLS handshake for the hero LCP frame. */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Preload only fonts on the LCP critical path.
            Felixti is the display font (.font-header) used by LCP headings
            on auth/checkout and other hero-text pages; it's 20 KB and swaps
            late without a preload, which tanks Speed Index.
            Medium (weight 600) is used by the LCP "Shop" heading.
            Book (weight 400) is the primary body font - preloaded so it's
            ready before below-the-fold content renders. */}
        <link rel="preload" href="/assets/font/Felixti.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/font/PPNeueMontreal-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/font/PPNeueMontreal-Book.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <JsonLd data={localBusinessSchema} />
        <GlobalProvider>
          <Toaster />
          <LenisProvider>
            {children}
          </LenisProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
