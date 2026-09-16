import ShopClient from '@/components/Application/Website/ShopClient'
import { getShopFilters, getShopProducts } from '@/lib/services/shopService'
import JsonLd from '@/components/Application/Website/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/buildBreadcrumbSchema'

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Pots' },
])

export const metadata = {
  title: 'Pots - Shop',
  description:
    'Browse our collection of planters, pots and containers - terracotta, glazed ceramic, fibreglass and resin, sized from windowsill to statement specimen.',
  alternates: {
    canonical: '/shop/pots',
  },
}

const PotsPage = async ({ searchParams }) => {
  const resolvedSearchParams = (await searchParams) ?? {}

  const merged = { ...resolvedSearchParams, category: 'pots' }

  const params = new URLSearchParams()
  Object.entries(merged).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((item) => params.append(k, item))
    else if (v != null) params.set(k, v)
  })
  const searchParamsString = params.toString()

  const [filters, { products, total, totalPages }] = await Promise.all([
    getShopFilters(),
    getShopProducts({
      category: 'pots',
      size:           resolvedSearchParams?.size,
      color:          resolvedSearchParams?.color,
      minPrice:       resolvedSearchParams?.minPrice,
      maxPrice:       resolvedSearchParams?.maxPrice,
      bestseller:     resolvedSearchParams?.bestseller,
      freshlyArrived: resolvedSearchParams?.freshlyArrived,
      q:              resolvedSearchParams?.q,
      sort:           resolvedSearchParams?.sort,
      limit:          resolvedSearchParams?.limit,
      page:           resolvedSearchParams?.page,
    }),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ShopClient
        heading="Pots"
        initialFilters={filters}
        initialProducts={products}
        initialTotal={total}
        initialTotalPages={totalPages}
        initialSearchParamsString={searchParamsString}
      />
    </>
  )
}

export default PotsPage
