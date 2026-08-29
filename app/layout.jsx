import GlobalProvider from "@/components/Application/GlobalProvider";
import LenisProvider from '@/components/Application/LenisProvider'
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://www.horticulturaldevelopmentcentre.com'),
  title: {
    default: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
    template: '%s | Horticultural Development Centre',
  },
  description:
    'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance, plus a 50-bigha nursery and an Alipore outlet stocking plants, manure, pots, garden implements and roof-garden materials under one roof.',
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
    <html lang="en" className="font-sans">
      <head>
        {/* Cloudinary serves product images, about-us photos and Instagram videos,
            but all of it is below the fold - the homepage LCP is a local /assets hero.
            A full preconnect (TCP + TLS) therefore sits unused during the critical
            window (Lighthouse: "Unused preconnect"), so we only warm DNS here. The
            socket is established lazily when the first below-the-fold Image/video loads. */}
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
