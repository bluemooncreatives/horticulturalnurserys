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
const EditorialCardsSection = dynamic(() => import('@/components/Application/Website/EditorialCardsSection'))
const BenefitsSection = dynamic(() => import('@/components/Application/Website/BenefitsSection'))
const FAQSection = dynamic(() => import('@/components/Application/Website/FAQSection'))

export const metadata = {
    title: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
    description:
        'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance by qualified horticulturists, plus ornamental plants, seasonal flowers, lawn grass, manure, pots, garden implements and roof-garden materials — buy online or at our Alipore counter.',
    openGraph: {
        title: 'Horticultural Development Centre - Landscaping & Plant Nursery in Kolkata',
        description:
            'Kolkata\'s leading landscaper since 1989. Garden design, development and maintenance by qualified horticulturists, plus ornamental plants, seasonal flowers, lawn grass, manure, pots, garden implements and roof-garden materials.',
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
            <LazyHydrate>
                <FeaturedProduct />
            </LazyHydrate>

            <LazyHydrate>
                <CategoryArchiveSection />
            </LazyHydrate>

            <LazyHydrate>
                <AboutUsSection />
            </LazyHydrate>

            <LazyHydrate>
                <BestsellersSection />
            </LazyHydrate>

            {/* The gallery's styled-jsx CSS is client-only (no SSR registry), so
                its server HTML is unstyled and ~1600px taller until hydration
                reflows it. Hydrate it extra early so that reflow always happens
                while the section is still far below the viewport. */}
            <LazyHydrate rootMargin='1500px'>
                <InstagramReelsMarquee />
            </LazyHydrate>

            <LazyHydrate>
                <Testimonial />
            </LazyHydrate>

            <LazyHydrate>
                <EditorialCardsSection />
            </LazyHydrate>

            <LazyHydrate>
                <BenefitsSection />
            </LazyHydrate>

            <LazyHydrate>
                <FAQSection />
            </LazyHydrate>
        </>
    )
}

export default Home
