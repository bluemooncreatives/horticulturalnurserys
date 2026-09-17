'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  Award,
  Boxes,
  Building2,
  Bus,
  ClipboardList,
  Clock,
  Droplets,
  Flower2,
  Hammer,
  Headset,
  Layers,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Mountain,
  Package,
  PencilRuler,
  Phone,
  Scissors,
  Shovel,
  ShoppingBag,
  Sprout,
  TrainFront,
  Truck,
} from 'lucide-react'

import ProductBox from '@/components/Application/Website/ProductBox'
import ServiceEnquiryForm from '@/components/Application/Website/ServiceEnquiryForm'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'
import { RevealUp } from '@/components/ui/reveal'
import {
  COMPANY_NAME,
  FANPAD_SQM,
  FLAGSHIP_PROJECTS,
  GREEN_HOUSE_SQM,
  NURSERY_BIGHAS,
  OPERATING_SINCE_YEAR,
  POLYSHED_SQM,
  UNDER_COVER_SQM,
  WHOLESALE_AUDIENCE,
  WHOLESALE_PHONE_DISPLAY,
  WHOLESALE_PHONE_TEL,
  WHOLESALE_WHATSAPP_URL,
  yearsInBusiness,
} from '@/lib/companyInfo'
import {
  WEBSITE_SHOP,
  WEBSITE_SERVICES,
  WEBSITE_SERVICES_LANDSCAPE,
  WEBSITE_SERVICES_MAINTENANCE,
  WEBSITE_SERVICES_ROOF_GARDEN,
  WEBSITE_SERVICES_VERTICAL_GARDEN,
} from '@/routes/WebsiteRoute'

/* ────────────────────────────────────────────────────────────────
   ABOUT US - the full company dossier, built entirely from the
   global design tokens and the section idioms the rest of the site
   already uses (eyebrow + dot, editorial header over a hairline
   rule, white bordered cards on --background, one dark-panel band
   per stretch, lime as the single accent).

   Every figure quoted here reads from lib/companyInfo, so the page
   can never drift from the homepage or the services pages.
   ──────────────────────────────────────────────────────────────── */

/* ── Imagery ─────────────────────────────────────────────────── */
const IMG = {
  heroMain: 'https://res.cloudinary.com/heog9fna/image/upload/v1787744099/WhatsApp_Image_2026-08-26_at_4.57.12_PM_v9lbib.jpg',
  heroSide: 'https://res.cloudinary.com/heog9fna/image/upload/v1787744100/WhatsApp_Image_2026-08-26_at_4.57.12_PM_1_cdnqow.jpg',
  heroWide: 'https://res.cloudinary.com/heog9fna/image/upload/v1788116698/5_hsovs6.png',
  story: 'https://res.cloudinary.com/heog9fna/image/upload/v1787744100/WhatsApp_Image_2026-08-26_at_4.57.12_PM_2_uhcbcb.jpg',
  farm: 'https://res.cloudinary.com/heog9fna/image/upload/v1787667630/zuiiigfsl9h1rupinhq0.jpg',
  counter: 'https://res.cloudinary.com/heog9fna/image/upload/v1787582197/pklraaorrpqqvfss304g.jpg',
  proprietor: 'https://res.cloudinary.com/heog9fna/image/upload/v1787731929/mb3shitmk9vb0qdxw0bi.jpg',
  crew: 'https://res.cloudinary.com/heog9fna/image/upload/v1787579099/zghj02urhtxrjsddsgkx.jpg',
}

/* ── Hero stat strip ─────────────────────────────────────────── */
const HERO_STATS = [
  { value: `${yearsInBusiness()}+`, label: 'Years in the field' },
  { value: `${NURSERY_BIGHAS}`, label: 'Bighas of our own farm' },
  { value: UNDER_COVER_SQM.toLocaleString('en-US'), label: 'm² under cover' },
  { value: 'CPWD', label: 'Approved vendor' },
]

/* ── Credential ticker under the hero. The track holds two copies of
   the list and slides by exactly half its width (.instagram-track),
   so the loop is seamless - same mechanism as the reels marquee. ── */
const TICKER = [
  `Kolkata since ${OPERATING_SINCE_YEAR}`,
  'Our own farm at Bibirhut',
  'Qualified horticulturists',
  'CPWD & State Government approved',
  'Landscape design · build · maintain',
  'Wholesale supply across India',
  'Sale counter at Alipore',
]

/* ── The three arms of the business ──────────────────────────── */
const ARMS = [
  {
    num: '01',
    title: 'Landscaping',
    tagline: 'Design · Build · Maintain',
    copy: 'Qualified horticulturists survey the site, draw the planting plan and cost it; our own field crew builds it. Then we stay on to maintain it - private gardens, institutional grounds and public works alike.',
    href: WEBSITE_SERVICES,
    cta: 'Explore services',
    image: 'https://res.cloudinary.com/heog9fna/image/upload/bowtlepfx2qbwrdk5msj',
  },
  {
    num: '02',
    title: 'The Nursery',
    tagline: 'Grown, not traded',
    copy: `${NURSERY_BIGHAS} bighas at Bibirhut, Ramdevpur in South 24 Parganas, developed scientifically over the years. Plants are propagated, hardened and held here until they are ready - which is why we know the age and condition of everything we hand over.`,
    href: WEBSITE_SHOP,
    cta: 'Browse the catalogue',
    image: 'https://res.cloudinary.com/heog9fna/image/upload/zobtq95wnckowcapc7ue',
  },
  {
    num: '03',
    title: 'Wholesale Supply',
    tagline: 'Pan-India despatch',
    copy: `Exotic, ornamental and fruit plants in bulk to ${WHOLESALE_AUDIENCE.toLowerCase()} - anywhere in India, by bus, train or courier, with customer care on the line before the consignment leaves and after it lands.`,
    href: WHOLESALE_WHATSAPP_URL,
    cta: 'Wholesale enquiry',
    external: true,
    image: 'https://res.cloudinary.com/heog9fna/image/upload/v1787731802/ekw9icnf59busuhimjw4.jpg',
  },
]

/* ── Milestones ──────────────────────────────────────────────── */
const TIMELINE = [
  {
    year: '1989',
    title: 'Work begins in Kolkata',
    copy: 'A small group of people who had spent their working lives in horticulture start growing and selling planting material - properly, and honestly.',
  },
  {
    year: '1990',
    title: `${COMPANY_NAME} is formed`,
    copy: 'The organisation is formally established around the nursery, with horticulture - not trading - at the centre of it.',
  },
  {
    year: 'The farm',
    title: `${NURSERY_BIGHAS} bighas at Bibirhut`,
    copy: 'Land at Ramdevpur, South 24 Parganas is developed scientifically to propagate and produce plants and grasses suited to tropical and subtropical conditions.',
  },
  {
    year: 'Under cover',
    title: `${UNDER_COVER_SQM.toLocaleString('en-US')} m² of protected cultivation`,
    copy: `${POLYSHED_SQM.toLocaleString('en-US')} m² of polyshed house, ${GREEN_HOUSE_SQM.toLocaleString('en-US')} m² of green house and a ${FANPAD_SQM} m² fanpad house, served by sprinkler, fogger and drip irrigation.`,
  },
  {
    year: 'Public works',
    title: 'Cleared for State Government & CPWD',
    copy: 'Parks, gardens and beautification work executed under State Government departments and CPWD - the same crew, under public tendering and inspection.',
  },
  {
    year: 'Today',
    title: 'Counter, campus and courier',
    copy: 'A showroom at Alipore, landscaping across West Bengal, and wholesale consignments despatched nationwide - sold online and across the counter alike.',
  },
]

/* ── Services ────────────────────────────────────────────────── */
const SERVICES = [
  {
    Icon: Mountain,
    title: 'Landscape Development',
    href: WEBSITE_SERVICES_LANDSCAPE,
    copy: 'Site survey, soil conditioning, hardscaping, planting plans and lawn creation - homes, campuses and public ground.',
  },
  {
    Icon: Scissors,
    title: 'Garden Maintenance',
    href: WEBSITE_SERVICES_MAINTENANCE,
    copy: 'Annual contracts covering pruning, feeding, pest control, lawn upkeep and seasonal replanting by our own field staff.',
  },
  {
    Icon: Building2,
    title: 'Roof Garden Design',
    href: WEBSITE_SERVICES_ROOF_GARDEN,
    copy: 'Root-barrier geotextile and drain-cell systems that protect the slab, with planting sized to the load the terrace can take.',
  },
  {
    Icon: Layers,
    title: 'Vertical Garden Systems',
    href: WEBSITE_SERVICES_VERTICAL_GARDEN,
    copy: 'Modular living walls and wire trellises for interiors, facades and boundary screens, built to the available light.',
  },
]

/* ── Farm infrastructure ─────────────────────────────────────── */
const FARM_SPECS = [
  { value: `${NURSERY_BIGHAS}`, unit: 'bighas', label: 'Total farm area at Bibirhut' },
  { value: POLYSHED_SQM.toLocaleString('en-US'), unit: 'm²', label: 'Polyshed house' },
  { value: GREEN_HOUSE_SQM.toLocaleString('en-US'), unit: 'm²', label: 'Green house' },
  { value: `${FANPAD_SQM}`, unit: 'm²', label: 'Fanpad house' },
]

const FARM_SYSTEMS = [
  'Sprinkler irrigation',
  'Fogger lines',
  'Drip irrigation',
  'Shade hardening',
  'Imported varieties',
  'Tropical & subtropical stock',
]

/* ── What the counter carries ────────────────────────────────── */
const CATALOGUE = [
  {
    Icon: Leaf,
    title: 'Plants',
    items: [
      'Ornamental trees & shrubs',
      'Indoor & hanging plants',
      'Topiary & bonsai',
      'Fruit plants',
      'Exotic imported varieties',
    ],
  },
  {
    Icon: Flower2,
    title: 'Seasonal & Lawn',
    items: [
      'Winter flower seedlings (Aug – Dec)',
      'Summer flower seeds (Feb – May)',
      'Mexican lawn grass',
      'Shade grass',
      'Blade grass',
    ],
  },
  {
    Icon: ShoppingBag,
    title: 'Pots & Planters',
    items: [
      'Earthen - general, mazla / chali',
      'Bonsai pots',
      'LLDPE & fibre pots',
      'Decorative planters',
      'Hanging & vertical biowall units',
    ],
  },
  {
    Icon: Sprout,
    title: 'Manure & Nutrients',
    items: [
      'Vermicompost & bone meal',
      'Mustard & neem oil cake',
      'Horn meal',
      'Super phosphate, DAP, NPK',
      'Suphala, 19:19:19, 20:20:20, potash',
    ],
  },
  {
    Icon: Droplets,
    title: 'Plant Protection',
    items: [
      'Organic insecticides',
      'Inorganic insecticides',
      'Fungicides',
      'Neem-based sprays',
      'Counter advice on dosage',
    ],
  },
  {
    Icon: Shovel,
    title: 'Implements & Media',
    items: [
      'Hedge shears & secateurs',
      'Rakes, khurpa, sprayers',
      'Watering pipes, sprinklers, cans',
      'Cocopeat, garden soil, cowdung',
      'Decorative pebbles',
    ],
  },
]

/* ── How a project runs ──────────────────────────────────────── */
const PROCESS = [
  {
    Icon: ClipboardList,
    step: '01',
    title: 'Site visit',
    copy: 'A horticulturist walks the site and reads light, soil, drainage and circulation - then listens to how you actually want to use the space.',
  },
  {
    Icon: PencilRuler,
    step: '02',
    title: 'Planting plan',
    copy: 'A layout drawn against that reading: species, hardscape positions, lawn areas and structures, sized to the site rather than a template.',
  },
  {
    Icon: Boxes,
    step: '03',
    title: 'Costing & phasing',
    copy: 'Plant counts, material quantities and labour, itemised. Large sites are broken into phases so the work can be built as budget allows.',
  },
  {
    Icon: Hammer,
    step: '04',
    title: 'Build & aftercare',
    copy: 'Our own crew executes the plan, then hands over with watering, mowing and feeding schedules - and an AMC if you want us to keep it.',
  },
]

/* ── Wholesale capability marks ──────────────────────────────── */
const WHOLESALE_MARKS = [
  { Icon: Boxes, label: 'Wholesale quantity' },
  { Icon: Truck, label: 'Supply all over India' },
  { Icon: Bus, label: 'By bus' },
  { Icon: TrainFront, label: 'By train' },
  { Icon: Package, label: 'By courier' },
  { Icon: Headset, label: 'Customer care support' },
]

/* ── People ──────────────────────────────────────────────────── */
const PEOPLE = [
  {
    name: 'Tapan Maiti',
    role: `Proprietor · ${COMPANY_NAME}`,
    image: IMG.proprietor,
    bio: [
      'Landscaping in Kolkata is rarely a matter of taste alone. The soil is heavy, the monsoon is unforgiving, and a terrace has only so much load to give. What survives here is what was chosen with those things in mind.',
      'That conviction is why we kept the nursery rather than becoming a trading house. When a plant is raised on our own farm we know its age, its hardening, and what it will do in its second year - none of which can be guaranteed from a bought-in consignment.',
      'It is also why we invested early in protected cultivation and modern irrigation: polyshed, green house and fanpad structures with sprinkler, fogger and drip systems let us hold quality through the seasons that would otherwise dictate what we could offer.',
    ],
  },
  {
    name: 'Our Horticulturists & Field Staff',
    role: 'Design · Execution · Maintenance',
    image: IMG.crew,
    reverse: true,
    bio: [
      'Every project is read on site before it is drawn. Light hours, drainage, soil, wind, load and how the space will actually be used decide the planting plan - not a catalogue picked in an office.',
      'The team covers the full arc: survey and design, soil preparation and planting, lawn laying, roof-garden waterproofing with geotextile and drain cell, and the irrigation that keeps it all alive.',
      'The staff who plant a garden are the ones who come back to it. Pruning, feeding, pest control, lawn upkeep and seasonal replanting run on a schedule, which is how a garden still looks considered in its fifth year.',
    ],
  },
]

/* ── Visit / contact ─────────────────────────────────────────── */
const CONTACT_EMAIL = 'horticulturaldc@gmail.com'

const CONTACT_CARDS = [
  {
    Icon: MapPin,
    label: 'Showroom & sale counter',
    lines: ['2/5 Judges Court Road,', 'Alipore, Kolkata 700027'],
    href: 'https://maps.google.com/?q=2%2F5+Judges+Court+Road+Alipore+Kolkata+700027',
    hrefLabel: 'Open in Maps',
  },
  {
    Icon: Sprout,
    label: 'The farm',
    lines: ['Bibirhut, Ramdevpur,', 'South 24 Parganas'],
  },
  {
    Icon: Phone,
    label: 'Phone',
    lines: ['(033) 2479-5710', WHOLESALE_PHONE_DISPLAY],
    href: `tel:${WHOLESALE_PHONE_TEL}`,
    hrefLabel: 'Call us',
  },
  {
    Icon: Clock,
    label: 'Hours',
    lines: ['Mon – Sat', '10:00 – 19:00'],
  },
]

/* ── Shared primitives ───────────────────────────────────────── */

// The site-wide section shell: fluid gutter + the homepage's vertical rhythm,
// so this page's block spacing matches every other section on the site.
const Section = ({ children, className = '', ...rest }) => (
  <section
    className={`w-full mx-auto px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)] ${className}`}
    {...rest}
  >
    {children}
  </section>
)

// Eyebrow + outlined dot - the mark used by AboutUsSection / WholesaleSection.
const Eyebrow = ({ children, tone = 'light' }) => (
  <span
    className={`flex items-center gap-2 text-[0.8rem] font-semibold uppercase ${
      tone === 'dark' ? 'text-white/45' : 'text-[var(--brand-primary)]'
    }`}
  >
    <span aria-hidden className="size-1.5 rounded-full border border-current" />
    {children}
  </span>
)

// Editorial header: eyebrow + headline left, lead paragraph right, hairline rule.
const SectionHead = ({ eyebrow, title, lead, tone = 'light' }) => (
  <>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-12">
      <div>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2
          className={`mt-4 text-[clamp(1.7rem,4.2vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] ${
            tone === 'dark' ? 'text-white' : 'text-[var(--brand-primary)]'
          }`}
        >
          {title}
        </h2>
      </div>
      {lead && (
        <p
          className={`text-[0.9375rem] leading-normal lg:pb-2 ${
            tone === 'dark' ? 'text-white/50' : 'text-[var(--muted-foreground)]'
          }`}
        >
          {lead}
        </p>
      )}
    </div>
    <div className={`my-8 h-px w-full lg:my-12 ${tone === 'dark' ? 'bg-white/15' : 'bg-foreground/10'}`} />
  </>
)

const AboutUsContent = ({ products = [] }) => {
  return (
    <div className="relative z-[1] bg-background">

      {/* ══ 1 · Hero ═══════════════════════════════════════════════ */}
      <section className="w-full mx-auto px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] pt-[clamp(6.5rem,11vw,9.5rem)] pb-[clamp(2rem,4vw,3.5rem)]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-12">

          {/* headline column */}
          <RevealUp>
            <Eyebrow>About the company</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.4rem,7vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.03em] text-[var(--brand-primary)]">
              We grow the plant,
              <br />
              build the garden,
              <br />
              and come back to it.
            </h1>
            <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-[var(--muted-foreground)]">
              {COMPANY_NAME} has worked out of Kolkata since {OPERATING_SINCE_YEAR} - a{' '}
              {NURSERY_BIGHAS}-bigha nursery at Bibirhut, qualified horticulturists on every site,
              landscaping credentials with State Government departments and CPWD, and wholesale
              plant supply across India. One house does all of it, which is the whole point.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LimeArrowButton href="#enquiry-form">Request a site visit</LimeArrowButton>
              <Link
                href={WEBSITE_SHOP}
                className="group inline-flex h-11 items-center gap-2 rounded-full border border-[var(--brand-primary)]/25 px-5 cta-text font-medium text-[var(--brand-primary)] transition-colors duration-200 hover:bg-[var(--brand-primary)] hover:text-white sm:h-14 sm:px-7 sm:text-[1.05rem]"
              >
                Browse the nursery
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </RevealUp>

          {/* image cluster */}
          <RevealUp delay={120} className="grid grid-cols-2 gap-3 lg:gap-4">
            <div className="relative col-span-1 row-span-2 aspect-3/4 overflow-hidden rounded-[var(--radius-3xl)]">
              <Image
                src={IMG.heroMain}
                alt="Planting stock raised at our farm in Bibirhut"
                fill
                priority
                quality={82}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-3xl)]">
              <Image
                src={IMG.heroSide}
                alt="Rows of potted ornamentals under cover at the nursery"
                fill
                quality={82}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-3xl)]">
              <Image
                src={IMG.heroWide}
                alt="A landscape project executed by our field crew"
                fill
                quality={82}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </RevealUp>
        </div>

        {/* stat strip - gap-px over a border-coloured bed draws the hairlines */}
        <RevealUp
          delay={220}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--border)] lg:mt-14 lg:grid-cols-4"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="bg-white p-5 lg:p-7">
              <p className="text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--brand-primary)]">
                {stat.value}
              </p>
              <div className="my-3 h-px w-8 bg-[var(--brand-olive)]" />
              <p className="text-[0.8rem] leading-normal text-[var(--muted-foreground)]">{stat.label}</p>
            </div>
          ))}
        </RevealUp>
      </section>

      {/* ══ 2 · Credential ticker ══════════════════════════════════ */}
      <div className="w-full mx-auto px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))]">
        <div className="dark-panel overflow-hidden py-4">
          <div className="instagram-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {TICKER.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex shrink-0 items-center gap-4 whitespace-nowrap px-4 text-[0.8rem] font-semibold uppercase text-white/70 sm:px-6"
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-[var(--brand-lime)]" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 3 · Three arms of the business ═════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="What we are"
          title={
            <>
              Three businesses,
              <br className="hidden sm:block" /> one house.
            </>
          }
          lead="Most garden firms do one of these and buy in the rest. We run all three off the same farm and the same field staff - so nothing is handed off, and nothing gets lost between them."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          {ARMS.map((arm) => (
            <RevealUp
              key={arm.num}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white transition-colors duration-300 hover:border-[var(--brand-primary)]/25"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={arm.image}
                  alt={arm.title}
                  fill
                  quality={82}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-5 top-5 text-[0.8rem] font-semibold uppercase text-white/70">
                  {arm.num}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <p className="text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">
                  {arm.tagline}
                </p>
                <h3 className="mt-2 text-[1.45rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.6rem]">
                  {arm.title}
                </h3>
                <div className="my-4 h-px w-8 bg-[var(--brand-lime)]" />
                <p className="text-[0.875rem] leading-normal text-[var(--muted-foreground)]">{arm.copy}</p>

                <Link
                  href={arm.href}
                  {...(arm.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="mt-6 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)] transition-opacity duration-200 hover:opacity-70"
                >
                  {arm.cta}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </RevealUp>
          ))}
        </div>
      </Section>

      {/* ══ 4 · Story + milestone rail ═════════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="Our story"
          title={
            <>
              From one nursery
              <br className="hidden sm:block" /> to {yearsInBusiness()} years of it.
            </>
          }
          lead="The idea was modest: grow good planting material properly, and sell it honestly. Everything since has grown out of that one decision."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">

          {/* portrait image + pull quote, held in place while the rail scrolls */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-4/5 overflow-hidden rounded-[var(--radius-3xl)]">
              <Image
                src={IMG.story}
                alt="Our nursery at Bibirhut, Ramdevpur"
                fill
                quality={82}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <p className="mt-5 text-[1.05rem] leading-snug tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.2rem]">
              &ldquo;We are not a garden shop that also plants. We grow the plant, design the space
              it goes into, and come back to look after it.&rdquo;
            </p>
          </div>

          {/* milestone rail */}
          <ol className="relative border-l border-[var(--border)] pl-6 sm:pl-8">
            {TIMELINE.map((entry) => (
              <RevealUp as="li" key={entry.year} className="relative pb-8 last:pb-0 sm:pb-10">
                <span
                  aria-hidden
                  className="absolute -left-[1.81rem] top-1.5 size-2.5 rounded-full border-2 border-[var(--brand-primary)] bg-background sm:-left-[2.31rem]"
                />
                <p className="text-[0.8rem] font-semibold uppercase text-[var(--brand-olive)]">{entry.year}</p>
                <h3 className="mt-2 text-[1.15rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.3rem]">
                  {entry.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-normal text-[var(--muted-foreground)]">{entry.copy}</p>
              </RevealUp>
            ))}
          </ol>
        </div>
      </Section>

      {/* ══ 5 · The farm ═══════════════════════════════════════════ */}
      <Section>
        <div className="dark-panel relative overflow-hidden p-5 sm:p-8 lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-14 select-none font-wordmark text-[14rem] leading-none text-white/[0.03] lg:text-[20rem]"
          >
            ✦
          </div>

          <div className="relative">
            <SectionHead
              tone="dark"
              eyebrow="The farm at Bibirhut"
              title={
                <>
                  Protected cultivation,
                  <br className="hidden sm:block" /> not a buying desk.
                </>
              }
              lead="Developed scientifically over the years to propagate and produce plants and grasses suited to tropical and subtropical conditions - so material establishes, rather than merely surviving the journey."
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {FARM_SPECS.map((spec) => (
                  <div key={spec.label} className="border-t border-white/15 pt-4">
                    <p className="flex items-baseline gap-1.5 leading-none tracking-[-0.03em] text-white">
                      <span className="text-[clamp(1.9rem,4vw,3rem)] font-semibold">{spec.value}</span>
                      <span className="text-[0.95rem] font-medium text-[var(--brand-lime)]">{spec.unit}</span>
                    </p>
                    <p className="mt-2.5 text-[0.8rem] leading-normal text-white/45">{spec.label}</p>
                  </div>
                ))}
              </div>

              <div className="relative aspect-16/10 overflow-hidden rounded-[var(--radius-3xl)] lg:aspect-auto lg:min-h-[20rem]">
                <Image
                  src={IMG.farm}
                  alt="Protected cultivation under the green house at our Bibirhut farm"
                  fill
                  quality={82}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 lg:mt-10">
              {FARM_SYSTEMS.map((system) => (
                <span key={system} className="tag-chip">
                  {system}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ══ 6 · Services ═══════════════════════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="What we do"
          title={
            <>
              Gardens, designed and
              <br className="hidden sm:block" /> kept by the same people.
            </>
          }
          lead="Four services, all executed by our own horticulturists and field staff - and stocked from our own farm."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {SERVICES.map(({ Icon, title, copy, href }) => (
            <RevealUp key={title}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-6 transition-colors duration-300 hover:border-[var(--brand-primary)]/25 lg:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)]">
                    <Icon className="size-[18px] text-[var(--brand-primary)]" strokeWidth={1.6} />
                  </span>
                  <ArrowUpRight className="size-5 text-[var(--muted-foreground)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
                </div>
                <h3 className="mt-6 text-[1.15rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.3rem]">
                  {title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-normal text-[var(--muted-foreground)]">{copy}</p>
              </Link>
            </RevealUp>
          ))}
        </div>

        <div className="mt-8 flex justify-center lg:mt-10">
          <LimeArrowButton href={WEBSITE_SERVICES}>See all services in detail</LimeArrowButton>
        </div>
      </Section>

      {/* ══ 7 · How a project runs ═════════════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="How we work"
          title={
            <>
              Site first, drawing second,
              <br className="hidden sm:block" /> price in writing.
            </>
          }
          lead="The same four steps whether it is a balcony or a township - nothing starts until the layout and the estimate are approved."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {PROCESS.map(({ Icon, step, title, copy }) => (
            <div
              key={step}
              className="relative lg:px-8 [&:first-child]:lg:pl-0 [&:last-child]:lg:pr-0 [&:not(:last-child)]:lg:border-r [&:not(:last-child)]:lg:border-[var(--border)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-white">
                  <Icon className="size-[18px] text-[var(--brand-primary)]" strokeWidth={1.6} />
                </span>
                <span className="text-[0.8rem] font-medium text-[var(--muted-foreground)]">[{step}]</span>
              </div>
              <h3 className="text-[1.05rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)]">{title}</h3>
              <p className="mt-2 text-[0.8rem] leading-normal text-[var(--muted-foreground)]">{copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══ 8 · Credentials & flagship projects ════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="Credentials"
          title={
            <>
              Cleared for public works,
              <br className="hidden sm:block" /> not just private gardens.
            </>
          }
          lead="Approved-vendor status with West Bengal State Government departments and CPWD means the same crew that builds a private garden is cleared to work on public ground - under its tendering, documentation and inspection regime."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">

          {/* credential card */}
          <div className="col-span-1 flex flex-col justify-between rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-6 lg:col-span-4 lg:p-8">
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)]">
              <Award className="size-5 text-[var(--brand-primary)]" strokeWidth={1.6} />
            </span>
            <div className="mt-8">
              <p className="text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">Approved by</p>
              <p className="mt-3 text-[1.35rem] font-medium leading-snug tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.6rem]">
                CPWD &amp; West Bengal State Government departments
              </p>
              <div className="my-4 h-px w-8 bg-[var(--brand-lime)]" />
              <p className="text-[0.875rem] leading-normal text-[var(--muted-foreground)]">
                Parks, gardens and beautification work executed for State departments, CPWD and
                private clients across the country.
              </p>
            </div>
          </div>

          {/* project list */}
          <div className="col-span-1 rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-6 lg:col-span-8 lg:p-8">
            <p className="text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">Selected projects</p>
            {/* Two columns from `sm` up, so the last row holds the final TWO
                items - both drop the hairline, not just the last one. */}
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
              {FLAGSHIP_PROJECTS.map((project, i) => (
                <li
                  key={project}
                  className="flex items-baseline gap-3 border-b border-[var(--border)] py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                >
                  <span className="text-[0.75rem] font-medium text-[var(--brand-olive)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-[var(--brand-primary)]">{project}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ══ 9 · What we stock ══════════════════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="Products & supplies"
          title={
            <>
              Everything a garden needs,
              <br className="hidden sm:block" /> under one roof.
            </>
          }
          lead="Our Alipore counter is the one place in West Bengal where plants, seeds, pots, hanging baskets, nutrients, plant protection chemicals, implements and every accessory sit together."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {CATALOGUE.map(({ Icon, title, items }) => (
            <RevealUp
              key={title}
              className="flex flex-col rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-6 transition-colors duration-300 hover:border-[var(--brand-primary)]/25 lg:p-7"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)]">
                <Icon className="size-[18px] text-[var(--brand-primary)]" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-[1.05rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)]">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.8rem] leading-normal text-[var(--muted-foreground)]"
                  >
                    <span aria-hidden className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-[var(--brand-olive)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealUp>
          ))}
        </div>

        <div className="mt-8 flex justify-center lg:mt-10">
          <LimeArrowButton href={WEBSITE_SHOP}>Browse the full catalogue</LimeArrowButton>
        </div>
      </Section>

      {/* ══ 10 · Wholesale ═════════════════════════════════════════ */}
      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">

          {/* copy panel */}
          <div className="col-span-1 flex flex-col justify-between rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-6 lg:col-span-7 lg:p-10">
            <div>
              <Eyebrow>Wholesale &amp; pan-India supply</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--brand-primary)]">
                Bulk consignments, despatched anywhere in India.
              </h2>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-normal text-[var(--muted-foreground)]">
                Exotic, ornamental and fruit plants in wholesale quantity to{' '}
                {WHOLESALE_AUDIENCE.toLowerCase()} - grown and hardened on our own farm, packed
                there, and sent by whichever mode suits the order. Sold online and across the
                counter alike.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {WHOLESALE_MARKS.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3.5 py-2 text-[0.8rem] text-[var(--brand-primary)]"
                >
                  <Icon className="size-4" strokeWidth={1.6} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* CTA panel - the section's one dark surface */}
          <div className="dark-panel col-span-1 flex flex-col justify-between p-6 lg:col-span-5 lg:p-10">
            <div>
              <p className="text-[0.8rem] font-semibold uppercase text-white/45">Order or enquire</p>
              <p className="mt-3 text-[1.25rem] font-medium leading-snug tracking-[-0.01em] text-white lg:text-[1.5rem]">
                Tell us the species, the quantity and where it has to reach. We will tell you how it
                travels and what it costs.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-start gap-4">
              <LimeArrowButton href={WHOLESALE_WHATSAPP_URL} external icon={MessageCircle}>
                {/* The full label is too wide for a nowrap pill on a narrow
                    phone; the icon already says WhatsApp there. */}
                <span className="sm:hidden">{WHOLESALE_PHONE_DISPLAY}</span>
                <span className="hidden sm:inline">WhatsApp {WHOLESALE_PHONE_DISPLAY}</span>
              </LimeArrowButton>
              <a
                href={`tel:${WHOLESALE_PHONE_TEL}`}
                className="inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase text-white/60 transition-colors duration-200 hover:text-[var(--brand-lime)]"
              >
                <Phone className="size-4" strokeWidth={1.6} />
                Or call {WHOLESALE_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ══ 11 · People ════════════════════════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="The people"
          title={
            <>
              Qualified horticulturists,
              <br className="hidden sm:block" /> and field staff who come back.
            </>
          }
          lead="Behind every garden is one house doing all of it - raising the plants at Bibirhut, surveying and designing the site, executing the work, and returning season after season. Nothing is subcontracted out and then forgotten."
        />

        <div className="space-y-4 lg:space-y-5">
          {PEOPLE.map((person) => (
            <RevealUp
              key={person.name}
              as="article"
              className={`grid grid-cols-1 gap-6 overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-4 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-5 ${
                person.reverse ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-2xl)] lg:aspect-4/5">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  quality={82}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="p-2 lg:p-6">
                <p className="text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">{person.role}</p>
                <h3 className="mt-3 text-[clamp(1.5rem,3vw,2.2rem)] font-medium leading-tight tracking-[-0.02em] text-[var(--brand-primary)]">
                  {person.name}
                </h3>
                <div className="my-5 h-px w-10 bg-[var(--brand-lime)]" />
                <div className="space-y-3.5">
                  {person.bio.map((para, i) => (
                    <p key={i} className="text-[0.875rem] leading-relaxed text-[var(--muted-foreground)]">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </RevealUp>
          ))}
        </div>
      </Section>

      {/* ══ 12 · Visit us ══════════════════════════════════════════ */}
      <Section>
        <SectionHead
          eyebrow="Visit us"
          title={
            <>
              Come to the counter,
              <br className="hidden sm:block" /> or ask us to come to you.
            </>
          }
          lead="The showroom at Alipore is open six days a week. For a garden, a roof or a campus, a horticulturist will come and read the site first."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">

          {/* contact cards */}
          <div className="col-span-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
            {CONTACT_CARDS.map(({ Icon, label, lines, href, hrefLabel }) => (
              <div
                key={label}
                className="flex flex-col rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-6 lg:p-7"
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)]">
                  <Icon className="size-[18px] text-[var(--brand-primary)]" strokeWidth={1.6} />
                </span>
                <p className="mt-5 text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">{label}</p>
                <div className="mt-2 space-y-0.5">
                  {lines.map((line) => (
                    <p key={line} className="text-[0.9375rem] leading-snug text-[var(--brand-primary)]">
                      {line}
                    </p>
                  ))}
                </div>
                {href && (
                  <a
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)] transition-opacity duration-200 hover:opacity-70"
                  >
                    {hrefLabel}
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* counter photo */}
          <div className="relative col-span-1 aspect-4/3 overflow-hidden rounded-[var(--radius-3xl)] lg:col-span-5 lg:aspect-auto lg:min-h-[24rem]">
            <Image
              src={IMG.counter}
              alt="Our showroom and sale counter at Judges Court Road, Alipore"
              fill
              quality={82}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <p className="text-[0.8rem] font-semibold uppercase text-white/50">Showroom</p>
              <p className="mt-2 text-[1.25rem] font-medium leading-snug tracking-[-0.01em] text-white lg:text-[1.45rem]">
                Plants, pots, nutrients, chemicals and implements, all in one place.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-5 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase text-white/70 transition-colors duration-200 hover:text-[var(--brand-lime)]"
              >
                <Mail className="size-4" strokeWidth={1.6} />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ══ 13 · Enquiry form - the same-page target for every CTA ══ */}
      <Section id="enquiry-form" className="scroll-mt-24">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ServiceEnquiryForm />
        </Suspense>
      </Section>

      {/* ══ 14 · From the nursery ══════════════════════════════════ */}
      {products.length > 0 && (
        <Section>
          <SectionHead
            eyebrow="From the nursery"
            title="You may also need"
            lead="A few things off the counter, picked from what people buy most alongside a new garden."
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((item) => (
              <ProductBox key={item._id} product={item} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

export default AboutUsContent
