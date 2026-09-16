const SITE_URL = 'https://www.horticulturaldevelopmentcentre.com'

// Builds a schema.org BreadcrumbList from an ordered list of {name, path} crumbs
// (path omitted on the last, current-page crumb). Lets Google swap the search
// result's URL line for the breadcrumb trail.
export const buildBreadcrumbSchema = (crumbs) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        ...(crumb.path ? { item: `${SITE_URL}${crumb.path}` } : {}),
    })),
})
