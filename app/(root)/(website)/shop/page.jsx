import ShopClient from '@/components/Application/Website/ShopClient'
import { getDefaultShopProducts, getShopFilters, getShopProducts } from '@/lib/services/shopService'

export const metadata = {
    title: 'Shop - Plants, Pots & Garden Materials',
    description:
        'Shop ornamental plants, seasonal flowers, lawn grass, manure, planters and garden implements from Horticultural Development Centre\'s 50-bigha nursery - order online or collect at our Alipore counter.',
    alternates: {
        // Filter/sort/pagination query params all resolve to the same canonical
        // listing so they don't get indexed as separate duplicate pages.
        canonical: '/shop',
    },
}

const buildSearchParamString = (searchParams) => {
    if (!searchParams) return ''
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item))
        } else if (value !== undefined && value !== null) {
            params.set(key, value)
        }
    })
    return params.toString()
}

const Shop = async ({ searchParams }) => {
    const resolvedSearchParams = (await searchParams) ?? {}
    const initialSearchParamsString = buildSearchParamString(resolvedSearchParams)
    const [filters, { products, total, totalPages }] = await Promise.all([
        getShopFilters(),
        // Bare /shop (no filters/search/sort) serves the cached default page;
        // any query param falls through to the fully dynamic aggregation.
        initialSearchParamsString === ''
            ? getDefaultShopProducts()
            : getShopProducts({
                size: resolvedSearchParams?.size,
                color: resolvedSearchParams?.color,
                minPrice: resolvedSearchParams?.minPrice,
                maxPrice: resolvedSearchParams?.maxPrice,
                category: resolvedSearchParams?.category,
                parent: resolvedSearchParams?.parent,
                bestseller: resolvedSearchParams?.bestseller,
                freshlyArrived: resolvedSearchParams?.freshlyArrived,
                q: resolvedSearchParams?.q,
                sort: resolvedSearchParams?.sort,
                limit: resolvedSearchParams?.limit,
                page: resolvedSearchParams?.page,
            })
    ])

    return (
        <ShopClient
            initialFilters={filters}
            initialProducts={products}
            initialTotal={total}
            initialTotalPages={totalPages}
            initialSearchParamsString={initialSearchParamsString}
        />
    )
}

export default Shop
