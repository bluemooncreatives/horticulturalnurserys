const BASE_URL = 'https://www.horticulturaldevelopmentcentre.com'

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Keep crawlers out of the admin panel, API routes and the personal
                // enquiry list/form - they're either auth-gated or meaningless in
                // search results.
                disallow: [
                    '/admin',
                    '/api/',
                    '/cart',
                    '/enquiry',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
