import ServicesContent from './ServicesContent'

export const metadata = {
  title: 'Services - Horticultural Development Centre',
  description:
    'Garden development and landscaping for residential and commercial sites, garden maintenance, roof garden design and vertical garden systems - Horticultural Development Centre, Kolkata.',
}

// Hero bento - two photos flanking an accent card over a dark card.
const BENTO = {
  images: ['/assets/images/hero/01.jpg', '/assets/images/hero/03.jpg'],
  accent: {
    caption: 'Designing, planting and maintaining gardens across Kolkata and West Bengal, without a break.',
    figure: '37+',
  },
  dark: {
    figure: '50',
    caption: 'Bighas of our own farm at Bibirhut - 4,700 m² of it under cover, so nothing arrives with unknown growing conditions behind it.',
  },
}

// Rendered as a pinned, word-by-word colour fill - keep it to a few sentences
// so the whole statement resolves within one screen-lock.
const APPROACH = {
  lead: 'Every project starts with a horticulturist on your site, reading light, soil and drainage. Only then do we draw a plan and put a number to it. The design follows the brief you give us; the site decides what will actually survive in it - and the same team carries the work from first visit through to aftercare.',
}

const STATS = [
  { value: 'Since 1989', label: 'Growing and landscaping without a break' },
  { value: '50',     label: 'Bighas of our own farm at Bibirhut'        },
  { value: '4,700',  label: 'Square metres under cover'                 },
  { value: 'CPWD',   label: 'Approved vendor, with the State Government'},
]

const PROCESS = [
  {
    title: 'Site visit',
    desc: 'A horticulturist walks the site and reads light, soil, drainage and circulation - then listens to how you actually want to use the space.',
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
    desc: 'Our own field crew executes the plan, then hands over with watering, mowing and feeding schedules - and an AMC if you want us to keep it.',
  },
]

const CREDENTIALS = {
  heading: 'Cleared for public works, not just private gardens',
  desc: 'Approved-vendor status with the West Bengal State Government and CPWD means the same crew that builds a private garden is cleared to work on public ground - under its tendering, documentation and inspection regime.',
  projects: [
    'Public parks',
    'Lake-front promenades',
    'Zoo grounds',
    'Library grounds',
    'IT park campuses',
    'Government tourist lodges',
    'Heritage gardens',
    'Township landscapes',
  ],
}

const SERVICES = [
  {
    num: '01',
    title: 'Landscape Development',
    slug: 'landscape-development',
    image: '/assets/images/hero/01.jpg',
    short: 'Site survey, planting plan, costing and build - for homes and commercial grounds alike, at any scale.',
  },
  {
    num: '02',
    title: 'Garden Maintenance',
    slug: 'garden-maintenance',
    image: '/assets/images/hero/02.jpg',
    short: 'Annual contracts covering pruning, feeding, pest control, lawn upkeep and seasonal replanting.',
  },
  {
    num: '03',
    title: 'Roof Garden Design',
    slug: 'roof-garden',
    image: '/assets/images/hero/03.jpg',
    short: 'Geotextile and drain-cell systems that protect the slab while turning a rooftop into usable green space.',
  },
  {
    num: '04',
    title: 'Vertical Garden Systems',
    slug: 'vertical-garden',
    image: '/assets/images/hero/02.jpg',
    short: 'Modular living walls and trellises for interiors, facades and boundary screens, built to the available light.',
  },
]

export default function ServicesPage() {
  return (
    <ServicesContent
      services={SERVICES}
      bento={BENTO}
      approach={APPROACH}
      stats={STATS}
      process={PROCESS}
      credentials={CREDENTIALS}
    />
  )
}
