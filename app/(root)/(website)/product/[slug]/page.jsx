import { notFound } from 'next/navigation'
import ProductDetails from './ProductDetails'
import JsonLd from '@/components/Application/Website/JsonLd'
import { getProductDetailsBySlug, getRelatedProducts } from '@/lib/services/productService'
import { htmlToText, pickRandom } from '@/lib/utils'
import { buildBreadcrumbSchema } from '@/lib/buildBreadcrumbSchema'

const SITE_URL = 'https://www.horticulturaldevelopmentcentre.com'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const productData = await getProductDetailsBySlug(slug)
    if (!productData) return { title: 'Product not found' }

    const { product } = productData
    const description = htmlToText(product?.description).slice(0, 160)
    const image = product?.media?.[0]?.secure_url

    return {
        title: product?.name,
        description,
        alternates: {
            // Colour/size query params render the same product page, so the
            // base product URL (no variant) is the one canonical result.
            canonical: `/product/${slug}`,
        },
        openGraph: {
            title: product?.name,
            description,
            images: image ? [{ url: image }] : [],
            type: 'website',
        },
    }
}

const ProductPage = async ({ params, searchParams }) => {
    const { slug } = await params
    const { color, size } = await searchParams

    const productData = await getProductDetailsBySlug(slug, size, color)

    if (!productData) notFound()

    const { product, variant, reviewCount, ratingAvg } = productData

    // Fetch the cached pool, then randomly pick 4 so the rail varies each visit.
    const relatedPool = await getRelatedProducts(
        productData.product._id,
        productData.product.category?._id
    )
    const relatedProducts = pickRandom(relatedPool, 4)

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.name,
        description: htmlToText(product?.description).slice(0, 5000),
        image: (variant?.media?.length ? variant.media : product?.media)?.map((m) => m.secure_url) || [],
        sku: variant?.sku,
        category: product?.category?.name,
        brand: {
            '@type': 'Brand',
            name: 'Horticultural Development Centre',
        },
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/product/${slug}`,
            priceCurrency: 'INR',
            price: variant?.sellingPrice,
            // No inventory/quantity tracking in the catalogue - a live variant
            // (not soft-deleted) is always sellable.
            availability: 'https://schema.org/InStock',
        },
        // Only claim a rating when there's at least one real review - an
        // aggregateRating with zero reviews violates Google's structured data
        // guidelines and can trigger a manual action.
        ...(reviewCount > 0
            ? {
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: ratingAvg,
                    reviewCount,
                },
            }
            : {}),
    }

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        ...(product?.category?.name ? [{ name: product.category.name, path: `/shop?category=${product.category.slug ?? ''}` }] : []),
        { name: product?.name },
    ])

    return (
        <>
            <JsonLd data={productSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ProductDetails
                product={productData.product}
                variant={productData.variant}
                colors={productData.colors}
                colorEntries={productData.colorEntries}
                sizes={productData.sizes}
                variantOptions={productData.variantOptions}
                reviewCount={productData.reviewCount}
                ratingAvg={productData.ratingAvg}
                relatedProducts={relatedProducts}
            />
        </>
    )
}

export default ProductPage
