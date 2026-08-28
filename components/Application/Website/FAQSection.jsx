'use client'

import { FAQ } from '@/components/ui/faq-tabs'

// The three groups the section header used to advertise as a static caption
// ("Plants · Landscaping · Supplies") - now navigable tabs instead.
const CATEGORIES = {
    landscaping: 'Landscaping',
    nursery: 'Plants & Nursery',
    supplies: 'Supplies',
}

const FAQ_DATA = {
    landscaping: [
        {
            question: 'Do you take up landscaping projects, or only sell plants?',
            answer: 'Both. Our horticulturists design, execute and maintain gardens for residences, farm houses, institutions and government bodies - and the same nursery supplies the plants and materials for it. You can hire us for the whole garden or simply buy a pot at the counter.',
        },
        {
            question: 'How does a landscaping project usually start?',
            answer: 'With a site visit. We read the light, soil, drainage and how you intend to use the space, then return a planting plan with a costing. Work begins only once the layout and estimate are approved.',
        },
        {
            question: 'Can you build a roof garden?',
            answer: 'Yes, and it is one of the things we are asked for most in Kolkata. We supply and lay geotextile net and drain cell so the slab stays protected, and design the planting around the load and wind the terrace can actually take.',
        },
        {
            question: 'Do you handle garden maintenance after handover?',
            answer: 'Yes. We take annual maintenance for gardens we have built and for existing gardens too - regular pruning, feeding, pest control, lawn upkeep and seasonal replanting by our own field staff.',
        },
        {
            question: 'Can you take on government or institutional work?',
            answer: 'We hold credentials for beautification work executed under State Government departments and CPWD, and have completed parks, lake fronts, zoo and library grounds, IT parks, tourist lodges and township landscapes.',
        },
    ],
    nursery: [
        {
            question: 'Where do your plants come from?',
            answer: 'From our own farm at Bibirhut, Ramdevpur in South 24 Parganas - roughly 50 bighas, with 2,500 sqm of polyshed, 2,000 sqm of green house and a 200 sqm fanpad house. We also import selected varieties from abroad for projects that call for them.',
        },
        {
            question: 'Will a plant from the nursery survive in my home or balcony?',
            answer: 'That depends on light more than anything else. Tell us how many hours of direct sun the spot gets and we will point you to the right group - shade-loving indoor plants, hanging varieties, or full-sun shrubs and ornamental trees.',
        },
        {
            question: 'When are seasonal flowers available?',
            answer: 'Seedlings of winter flowers are available from August to December, and seeds of summer flowers from February to May. Summer and winter seasonal flowering plants are stocked in their respective seasons.',
        },
        {
            question: 'Which lawn grass should I choose?',
            answer: 'Mexican grass gives the finest, most manicured carpet and needs good sun. Shade grass is the choice for areas under tree cover or between buildings. Blade grass is hardier and better suited to larger, rougher lawns. We can advise once we know the site.',
        },
    ],
    supplies: [
        {
            question: 'Do you supply manure and plant protection chemicals?',
            answer: 'Yes. Organic manures include vermicompost, bone meal, mustard oil cake, horn meal and neem oil cake. Inorganic options include super phosphate, DAP, NPK, Suphala, 19:19:19, 20:20:20, potash and ammonium sulphate. We stock both organic and inorganic insecticides.',
        },
        {
            question: 'What kind of pots and planters do you stock?',
            answer: 'Earthen pots including general, mazla / chali and bonsai shapes, plus LLDPE and fibre pots - general, decorative, decorative planters, hanging pots and vertical / biowall systems for green walls.',
        },
        {
            question: 'Do you sell garden tools and soil media?',
            answer: 'We carry hedge shears, secateurs, rakes, khurpa, sprayers, watering pipes, sprinklers and watering cans, along with cocopeat, garden soil, cowdung and decorative pebbles.',
        },
        {
            question: 'Can I visit before ordering?',
            answer: 'Please do. Our sale counter at 2/5 Judges Court Road, Alipore, Kolkata 700027 keeps plants, pots, nutrients, chemicals and implements together in one place, and our staff can walk you through the options.',
        },
    ],
}

const FAQSection = () => (
    <FAQ
        title="Frequently Asked"
        categories={CATEGORIES}
        faqData={FAQ_DATA}
    >
        <p className="mt-10 text-center text-[0.78rem] text-muted-foreground lg:mt-12">
            Still have a question?{' '}
            <a
                href="/contact"
                className="font-semibold text-[var(--dark-red-2)] underline underline-offset-2 transition-opacity hover:opacity-70"
            >
                Contact our team
            </a>
        </p>
    </FAQ>
)

export default FAQSection
