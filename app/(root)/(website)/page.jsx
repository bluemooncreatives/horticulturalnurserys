import dynamic from 'next/dynamic'
import HeroSection from '@/components/Application/Website/HeroSection'
import LazyHydrate from '@/components/Application/LazyHydrate'
import FeaturedProduct from '@/components/Application/Website/FeaturedProduct'
import BestsellersSection from '@/components/Application/Website/BestsellersSection'
// Async server components (fetch their own data): imported directly so they run
// on the server, like BestsellersSection. Each code-splits its own client chunk.
import CategoryArchiveSection from '@/components/Application/Website/CategoryArchiveSection'
import Testimonial from '@/components/Application/Website/Testimonial'

// Defer media-heavy sections into separate JS chunks so they don't block
// parsing and hydration of the above-fold critical path.
const InstagramReelsMarquee = dynamic(() => import('@/components/Application/Website/InstagramReelsMarquee'))
const AboutUsSection = dynamic(() => import('@/components/Application/Website/AboutUsSection'))
const ServicesSection = dynamic(() => import('@/components/Application/Website/ServicesSection'))
const EditorialCardsSection = dynamic(() => import('@/components/Application/Website/EditorialCardsSection'))
const CompanySection = dynamic(() => import('@/components/Application/Website/CompanySection'))
const BenefitsSection = dynamic(() => import('@/components/Application/Website/BenefitsSection'))
const WholesaleSection = dynamic(() => import('@/components/Application/Website/WholesaleSection'))
const FAQSection = dynamic(() => import('@/components/Application/Website/FAQSection'))

export const metadata = {
    title: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
    description:
        'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance by qualified horticulturists, plus ornamental plants, seasonal flowers, lawn grass, manure, pots, garden implements and roof-garden materials - buy online or at our Alipore counter. Wholesale plant supply across India by bus, train and courier.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
        description:
            'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance by qualified horticulturists, plus ornamental plants, seasonal flowers, lawn grass, manure, pots, garden implements and roof-garden materials. Wholesale supply across India.',
    },
}

const Home = () => {
    return (
        <>
            <section>
                <HeroSection />
            </section>
            {/* The hero is 100svh, so everything below is below the fold.
                LazyHydrate keeps each section's server HTML in the document but
                defers its hydration until the user scrolls near it, so the
                initial load only hydrates the hero + header. */}
            {/* ── 1 · Entry: browse the catalogue by category ── */}
            <LazyHydrate>
                <CategoryArchiveSection />
            </LazyHydrate>

            {/* ── 2 · Who we are, and why the work holds up ──
                AboutUsSection introduces the house; BenefitsSection follows it
                immediately with the four reasons that introduction matters,
                instead of being stranded near the foot of the page. */}
            <LazyHydrate>
                <AboutUsSection />
            </LazyHydrate>

            <LazyHydrate>
                <BenefitsSection />
            </LazyHydrate>

            {/* ── 3 · The nursery arm: what you can buy today ── */}
            <LazyHydrate>
                <BestsellersSection />
            </LazyHydrate>

            {/* Featured ("In Stock, Ready to Ship") products */}
            <LazyHydrate>
                <FeaturedProduct />
            </LazyHydrate>

            {/* ── 4 · The landscaping arm ──
                Services follows the in-stock rail directly: whoever has just
                seen what we grow is the right person to be shown what we do
                with it. The three editorial ways in route out of it. */}
            <LazyHydrate>
                <ServicesSection />
            </LazyHydrate>

            <LazyHydrate>
                <EditorialCardsSection />
            </LazyHydrate>

            {/* ── 5 · The supply arm: bulk, pan-India ── */}
            <LazyHydrate>
                <WholesaleSection />
            </LazyHydrate>

            {/* ── 6 · Proof: our own feed, then clients' words ──
                The gallery's styled-jsx CSS is client-only (no SSR registry), so
                its server HTML is unstyled and ~1600px taller until hydration
                reflows it. Hydrate it extra early so that reflow always happens
                while the section is still far below the viewport. */}
            <LazyHydrate rootMargin='1500px'>
                <InstagramReelsMarquee />
            </LazyHydrate>

            <LazyHydrate>
                <Testimonial />
            </LazyHydrate>

            {/* ── 7 · Close: the company's record, and every way to reach it ── */}
            <LazyHydrate>
                <CompanySection />
            </LazyHydrate>

            <LazyHydrate>
                <FAQSection />
            </LazyHydrate>

        </>
    )
}

export default Home
