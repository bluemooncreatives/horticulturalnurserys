'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

const FAQS = [
    {
        q: 'Do you take up landscaping projects, or only sell plants?',
        a: 'Both. Our horticulturists design, execute and maintain gardens for residences, farm houses, institutions and government bodies — and the same nursery supplies the plants and materials for it. You can hire us for the whole garden or simply buy a pot at the counter.',
    },
    {
        q: 'How does a landscaping project usually start?',
        a: 'With a site visit. We read the light, soil, drainage and how you intend to use the space, then return a planting plan with a costing. Work begins only once the layout and estimate are approved.',
    },
    {
        q: 'Where do your plants come from?',
        a: 'From our own farm at Bibirhut, Ramdevpur in South 24 Parganas - roughly 50 bighas, with 2,500 sqm of polyshed, 2,000 sqm of green house and a 200 sqm fanpad house. We also import selected varieties from abroad for projects that call for them.',
    },
    {
        q: 'Will a plant from the nursery survive in my home or balcony?',
        a: 'That depends on light more than anything else. Tell us how many hours of direct sun the spot gets and we will point you to the right group — shade-loving indoor plants, hanging varieties, or full-sun shrubs and ornamental trees.',
    },
    {
        q: 'When are seasonal flowers available?',
        a: 'Seedlings of winter flowers are available from August to December, and seeds of summer flowers from February to May. Summer and winter seasonal flowering plants are stocked in their respective seasons.',
    },
    {
        q: 'Which lawn grass should I choose?',
        a: 'Mexican grass gives the finest, most manicured carpet and needs good sun. Shade grass is the choice for areas under tree cover or between buildings. Blade grass is hardier and better suited to larger, rougher lawns. We can advise once we know the site.',
    },
    {
        q: 'Do you supply manure and plant protection chemicals?',
        a: 'Yes. Organic manures include vermicompost, bone meal, mustard oil cake, horn meal and neem oil cake. Inorganic options include super phosphate, DAP, NPK, Suphala, 19:19:19, 20:20:20, potash and ammonium sulphate. We stock both organic and inorganic insecticides.',
    },
    {
        q: 'Can you build a roof garden?',
        a: 'Yes, and it is one of the things we are asked for most in Kolkata. We supply and lay geotextile net and drain cell so the slab stays protected, and design the planting around the load and wind the terrace can actually take.',
    },
    {
        q: 'What kind of pots and planters do you stock?',
        a: 'Earthen pots including general, mazla / chali and bonsai shapes, plus LLDPE and fibre pots — general, decorative, decorative planters, hanging pots and vertical / biowall systems for green walls.',
    },
    {
        q: 'Do you sell garden tools and soil media?',
        a: 'We carry hedge shears, secateurs, rakes, khurpa, sprayers, watering pipes, sprinklers and watering cans, along with cocopeat, garden soil, cowdung and decorative pebbles.',
    },
    {
        q: 'Do you handle garden maintenance after handover?',
        a: 'Yes. We take annual maintenance for gardens we have built and for existing gardens too — regular pruning, feeding, pest control, lawn upkeep and seasonal replanting by our own field staff.',
    },
    {
        q: 'Can you take on government or institutional work?',
        a: 'We hold credentials for beautification work executed under State Government departments and CPWD, and have completed parks, lake fronts, zoo and library grounds, IT parks, tourist lodges and township landscapes.',
    },
    {
        q: 'Can I visit before ordering?',
        a: 'Please do. Our sale counter at 2/5 Judges Court Road, Alipore, Kolkata 700027 keeps plants, pots, nutrients, chemicals and implements together in one place, and our staff can walk you through the options.',
    },
]

const FAQItem = ({ faq, isOpen, onToggle }) => (
    <div className="border-b border-foreground/10">
        <button
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between gap-6 py-5 text-left"
        >
            <span className="font-neue text-[0.95rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1rem]">
                {faq.q}
            </span>
            <Plus
                className="size-4 flex-shrink-0 text-[var(--dark-red)] transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
            />
        </button>

        {/* grid-rows trick — no fixed max-height, no JS measurement */}
        <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        >
            <div className="overflow-hidden">
                <p className="pb-5 pr-8 text-[0.84rem] leading-relaxed text-[var(--text-body)]">
                    {faq.a}
                </p>
            </div>
        </div>
    </div>
)

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i))

    return (
        <section className="lumora-shell bg-background pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">

            {/* section header */}
            <div className="mb-4 flex items-end justify-between lg:mb-6">
                <div>
                    <span className="eyebrow flex items-center gap-2">
                        <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                        Got Questions?
                    </span>
                    <h2 className="mt-3 text-[clamp(1.7rem,4.2vw,3rem)] font-medium tracking-[-0.02em] text-[var(--brand-primary)]">
                        Frequently Asked
                    </h2>
                </div>
                <span className="hidden text-[0.68rem] font-semibold uppercase text-muted-foreground sm:block">
                    Plants · Landscaping · Supplies
                </span>
            </div>

            {/* rule */}
            <div className="mb-10 h-px w-full bg-foreground/10 lg:mb-14" />

            {/* two-column grid on desktop */}
            <div className="grid gap-x-16 lg:grid-cols-2">
                {FAQS.map((faq, i) => (
                    <div key={i}>
                        <FAQItem
                            faq={faq}
                            isOpen={openIndex === i}
                            onToggle={() => toggle(i)}
                        />
                    </div>
                ))}
            </div>

            {/* bottom hint */}
            <p className="mt-10 text-center text-[0.78rem] text-muted-foreground lg:mt-14">
                Still have a question?{' '}
                <a
                    href="/contact"
                    className="font-semibold text-[var(--dark-red-2)] underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                    Contact our team
                </a>
            </p>
        </section>
    )
}

export default FAQSection
