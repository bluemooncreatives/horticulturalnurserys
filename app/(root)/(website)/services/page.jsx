import ServicesContent from './ServicesContent'

export const metadata = {
  title: 'Services — Horticultural Development Centre',
  description:
    'Garden development and landscaping for residential and commercial sites, garden maintenance, roof garden design and vertical garden systems — Horticultural Development Centre, Kolkata.',
}

const HERO_STATS = [
  { label: 'Landscaping since', value: '1989'                     },
  { label: 'Service lines',     value: 'Four, end to end'         },
  { label: 'Own farm',          value: '50 bighas, Bibirhut'      },
  { label: 'Approved by',       value: 'State Govt. & CPWD'       },
]

const APPROACH = {
  lead: `Every project starts the same way — a horticulturist on your site, reading light, soil, drainage and how the space will actually be used. Only then do we draw a plan and put a number to it.`,
  body: [
    `We work on residential and commercial sites alike, from a single balcony to township grounds of several acres. The design follows the brief you give us; the site decides what will actually survive in it. Nothing is built off a template.`,
    `The same team carries a project from first visit to handover — qualified horticulturists, licensed landscape architects and our own field crew. No subcontracted labour arriving halfway through with no memory of what was agreed.`,
    `Plants and materials come off our own 50-bigha farm at Bibirhut, so we know how every specimen was raised and hardened before it reaches your site. That is the difference between a garden that establishes in its first season and one that spends two years catching up.`,
    `And once it is built, we can keep it. Annual maintenance contracts cover gardens we have made and gardens we have not, using the same organic and inorganic inputs we stock at the Alipore counter.`,
  ],
}

const PROCESS = [
  {
    title: 'Site visit',
    desc: 'A horticulturist walks the site and reads light, soil, drainage and circulation — then listens to how you actually want to use the space.',
  },
  {
    title: 'Planting plan',
    desc: 'A layout drawn against that reading: species selection, hardscape positions, lawn areas and structures, sized to the site rather than a template.',
  },
  {
    title: 'Costing & phasing',
    desc: 'Plant counts, material quantities and labour, itemised. Large sites are broken into phases so the work can be built as budget allows.',
  },
  {
    title: 'Build & handover',
    desc: 'Our own field crew executes the plan, then hands over with watering, mowing and feeding schedules — and an AMC if you want us to keep it.',
  },
]

const FOUNDATIONS = [
  {
    figure: '50 bighas',
    title: 'Our own growing ground',
    desc: 'A farm at Bibirhut, Ramdevpur with 2,500 sqm of polyshed, 2,000 sqm of greenhouse and a 200 sqm fan-pad house. No middleman, and no unknown growing conditions.',
  },
  {
    figure: 'Since 1989',
    title: 'One team, start to finish',
    desc: 'Qualified horticulturists, licensed landscape architects and our own field crew — the same people from the first site visit through to aftercare.',
  },
  {
    figure: 'CPWD',
    title: 'Cleared for public works',
    desc: 'Approved-vendor status with the West Bengal State Government and CPWD: parks, lake fronts, zoo and library grounds, IT campuses and tourist lodges.',
  },
]

const SERVICES = [
  {
    num: '01',
    title: 'Landscape Development',
    slug: 'landscape-development',
    tagline: 'Garden development, residential & commercial',
    desc: 'Full-spectrum garden development and landscaping — site survey, planting plan, costing and build, for homes and commercial sites alike. Lawns in Selection-I, Mexican or Doob grass; garden structures and statuary in FRP, iron or Astroturf. Township gardens, government parks, IT campus grounds, lake fronts and tourist lodges, as an approved vendor for State Government and CPWD projects.',
    tags: ['Residential & Commercial', 'Site Survey', 'Planting Plans', 'Lawn Laying', 'Township Scale', 'CPWD Credentials'],
    images: ['/assets/images/hero/01.jpg', '/assets/images/hero/02.jpg'],
    accent: '#C9F24E',
  },
  {
    num: '02',
    title: 'Garden Maintenance & Aftercare',
    slug: 'garden-maintenance',
    tagline: 'Alive through every season',
    desc: `Annual maintenance contracts (AMC) for gardens we've built and those we haven't. Pruning, feeding, pest management, lawn upkeep and seasonal replanting by our own field teams — using the same organic and inorganic inputs we stock at the counter.`,
    tags: ['Annual Contracts', 'Pruning', 'Pest Control', 'Seasonal Replanting'],
    images: ['/assets/images/hero/02.jpg', '/assets/images/hero/03.jpg'],
    accent: '#A5B33D',
  },
  {
    num: '03',
    title: 'Roof Garden Design',
    slug: 'roof-garden',
    tagline: 'Protecting your slab, transforming your sky',
    desc: 'Specialist roof garden systems layered with geotextile net and drain cell to protect the structural slab. Planted with lightweight growing media, shade-tolerant species and weather-proof planters — turning rooftops into usable, beautiful green space.',
    tags: ['Geotextile Layer', 'Drain Cell', 'Lightweight Media', 'Weather-proof'],
    images: ['/assets/images/hero/03.jpg', '/assets/images/hero/01.jpg'],
    accent: '#356B38',
  },
  {
    num: '04',
    title: 'Vertical Garden Systems',
    slug: 'vertical-garden',
    tagline: 'Walls that breathe',
    desc: 'Modular living-wall and trellis systems for interiors, building facades and boundary screens. Custom-designed for the available light, irrigation source and plant species — from dense tropical moss walls to open climber frames with seasonal flowering.',
    tags: ['Living Walls', 'Trellis Systems', 'Facade Planting', 'Interior Installations'],
    images: ['/assets/images/hero/02.jpg', '/assets/images/hero/01.jpg'],
    accent: '#C9F24E',
  },
]

export default function ServicesPage() {
  return (
    <ServicesContent
      services={SERVICES}
      heroStats={HERO_STATS}
      approach={APPROACH}
      process={PROCESS}
      foundations={FOUNDATIONS}
    />
  )
}
