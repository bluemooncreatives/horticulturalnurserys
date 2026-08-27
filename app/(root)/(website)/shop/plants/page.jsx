import ShopClient from '@/components/Application/Website/ShopClient'
import { getDefaultShopProducts, getShopFilters, getShopProducts } from '@/lib/services/shopService'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'

export const metadata = {
  title: 'Plants — Shop',
  description:
    'Browse our full range of nursery plants — seasonal flowers, ornamental shrubs, specimen trees and select imported varieties, all grown on our 50-bigha farm at Bibirhut.',
}

const PlantsPage = async ({ searchParams }) => {
  const resolvedSearchParams = (await searchParams) ?? {}

  // Pre-inject the category=plants filter so this page always shows plants.
  const merged = { ...resolvedSearchParams, category: 'plants' }

  const params = new URLSearchParams()
  Object.entries(merged).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((item) => params.append(k, item))
    else if (v != null) params.set(k, v)
  })
  const searchParamsString = params.toString()

  const [filters, { products, total, totalPages }] = await Promise.all([
    getShopFilters(),
    getShopProducts({
      category: 'plants',
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
      <WebsiteBreadcrumb props={{ title: 'Plants' }} />
      <ShopClient
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
