import ShopClient from '@/components/Application/Website/ShopClient'
import { getDefaultShopProducts, getShopFilters, getShopProducts } from '@/lib/services/shopService'
import JsonLd from '@/components/Application/Website/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/buildBreadcrumbSchema'

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Plants' },
])

export const metadata = {
  title: 'Plants - Shop',
  description:
    'Browse our full range of nursery plants - seasonal flowers, ornamental shrubs, specimen trees and select imported varieties, all grown on our 50-bigha farm at Bibirhut.',
  alternates: {
    canonical: '/shop/plants',
  },
}

const PlantsPage = async ({ searchParams }) => {
  const resolvedSearchParams = (await searchParams) ?? {}

  // "Plants" is a Parent, not a Category - there is no category slugged
  // "plants", so filtering by category here matched nothing and silently fell
  // through to the entire catalogue.
  const merged = { ...resolvedSearchParams, parent: 'plants' }

  const params = new URLSearchParams()
  Object.entries(merged).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((item) => params.append(k, item))
    else if (v != null) params.set(k, v)
  })
  const searchParamsString = params.toString()

  const [filters, { products, total, totalPages }] = await Promise.all([
    getShopFilters(),
    getShopProducts({
      parent: 'plants',
      category:       resolvedSearchParams?.category,
      size:           resolvedSearchParams?.size,
      color:          resolvedSearchParams?.color,
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
        heading="Plants"
        initialFilters={filters}
        initialProducts={products}
        initialTotal={total}
        initialTotalPages={totalPages}
        initialSearchParamsString={searchParamsString}
      />
    </>
  )
}

export default PlantsPage
