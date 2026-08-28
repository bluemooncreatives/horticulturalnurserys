
// Content-Security-Policy scoped to the third parties this app actually uses:
// Cloudinary images (res.cloudinary.com) and the Cloudinary Upload Widget used in
// the admin Media section. The widget injects a script from and renders inside an
// iframe on upload-widget.cloudinary.com, and uploads go to api.cloudinary.com -
// all three must be whitelisted or the "Upload Media" button does nothing. There
// is no payment gateway: this is a catalogue + enquiry site, so no Razorpay hosts.
// 'unsafe-inline' is required for Next.js' inline bootstrap/hydration scripts and
// inline style attributes; tightening to a nonce-based strict-dynamic CSP is a
// future step.
const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://upload-widget.cloudinary.com",
    "media-src 'self' https://res.cloudinary.com",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' https://upload-widget.cloudinary.com",
    "connect-src 'self' https://api.cloudinary.com https://upload-widget.cloudinary.com",
    "frame-src 'self' https://upload-widget.cloudinary.com",
    "upgrade-insecure-requests",
].join('; ')

const securityHeaders = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    poweredByHeader: false,
    experimental: {
        optimizePackageImports: ['lucide-react', 'react-icons', 'radix-ui'],
    },
    // Permanent redirects for routes removed in the catalogue + enquiry migration:
    // the old buy/checkout, customer-account and customer-auth surfaces no longer
    // exist. Point old/bookmarked links at their sensible successor so they never
    // dead-end on a 404.
    async redirects() {
        return [
            { source: '/checkout', destination: '/enquiry', permanent: true },
            { source: '/order-details/:path*', destination: '/shop', permanent: true },
            { source: '/my-account', destination: '/', permanent: true },
            { source: '/profile', destination: '/', permanent: true },
            { source: '/orders', destination: '/', permanent: true },
            { source: '/auth/:path*', destination: '/admin/login', permanent: true },
            { source: '/admin/orders/:path*', destination: '/admin/enquiries', permanent: true },
            { source: '/admin/orders', destination: '/admin/enquiries', permanent: true },
            { source: '/admin/coupon/:path*', destination: '/admin/dashboard', permanent: true },
            { source: '/admin/coupon', destination: '/admin/dashboard', permanent: true },
        ]
    },
    async headers() {
        return [
            {
                // Security headers on every route
                source: '/:path*',
                headers: securityHeaders,
            },
            {
                // Cache custom fonts for 1 year - they're content-addressed filenames
                source: '/assets/font/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                // Cache hero and other static images for 1 year. The /_next/image
                // optimizer inherits this max-age for its output, so a short TTL here
                // is what made Lighthouse flag "inefficient cache lifetimes" on the
                // optimized hero/thumbnail URLs. stale-while-revalidate lets a renamed
                // asset refresh in the background without blocking the response.
                source: '/assets/images/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=86400' }],
            },
        ]
    },
    images: {
        qualities: [82],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 365,
        deviceSizes: [320, 420, 640, 768, 1024, 1200, 1440, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
                search: ''
            }
        ]
    }
};

export default nextConfig;
