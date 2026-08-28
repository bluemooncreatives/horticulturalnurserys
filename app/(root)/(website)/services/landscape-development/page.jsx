import LandscapeDevelopmentContent from './LandscapeDevelopmentContent'

export const metadata = {
  title: 'Garden Development & Landscaping - Services',
  description:
    'Garden development and landscaping for residential and commercial sites - planting plans, lawn laying in Selection-I, Mexican and Doob grass, garden structures and statues in FRP, iron and Astroturf. Township gardens, government parks, IT campus grounds, lake fronts and tourist lodges across West Bengal.',
}

const SERVICE = {
  num: '01',
  title: 'Landscape Development',
  // Hero headline, one entry per rendered line - the masked reveal animates
  // each line separately, so the break is set here rather than left to wrapping.
  titleLines: ['Landscape', 'Development'],
  slug: 'landscape-development',
  tagline:
    'Garden development and landscaping for homes, campuses and public grounds - designed, planted and built by one team, from the first site visit to handover.',
  accent: '#C9F24E',
  images: ['/assets/images/hero/01.jpg', '/assets/images/hero/02.jpg'],

  // Hero stat rail
  stats: [
    { label: 'Since',        value: '1989'                     },
    { label: 'We work for',  value: 'Residential & commercial' },
    { label: 'Project scale',value: 'Balcony to township'      },
    { label: 'Approved by',  value: 'State Govt. & CPWD'       },
  ],

  intro: `Every landscape project starts with reading the land - light angles, soil profile, drainage paths and the way people will actually move through the space. That reading is set against the brief you give us, and only then do we draw up a planting plan and a costing. We don't begin until the layout and estimate are agreed.`,

  body: [
    `We work on commercial and residential sites alike. The design is built around what you tell us you want from the space, then developed by qualified horticulturists, licensed landscape architects and our own field crew - the same team from the first site visit to handover.`,
    `Our methods are modern and scientific rather than habitual, which is why every project is run by trained horticultural staff instead of general labour. It is also why the estimate you receive is the one you pay: phasing, plant counts and material quantities are worked out before the first spade goes in.`,
    `The portfolio spans balconies and rooftop terraces right through to township-scale grounds of several acres. Designing material and plant stock are both selected to a single standard - nothing goes into a garden that we would not put into our own.`,
    `Because the plants come off our own farm, we know exactly how each one was raised and hardened. That is the difference between a garden that establishes in its first season and one that spends two years catching up.`,
  ],

  tags: [
    'Residential & Commercial',
    'Site Survey',
    'Planting Plans',
    'Lawn Laying',
    'Structures & Statuary',
    'FRP / Iron / Astroturf',
    'Costing & Phasing',
    'Township Scale',
    'State Govt. / CPWD',
    'Own Farm Stock',
  ],

  process: [
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
      desc: 'Plant counts, material quantities and labour, itemised. Large sites are broken into phases so the garden can be built as budget allows.',
    },
    {
      title: 'Build & handover',
      desc: 'Our own field crew executes the plan, then hands over with watering, mowing and feeding schedules - and an AMC if you want us to keep it.',
    },
  ],

  capabilities: [
    {
      title: 'Design & consultation',
      desc: 'Concept through to working layout, developed by qualified horticulturists and licensed landscape architects. The brief you give us drives the design; the site decides what will actually survive in it.',
      tags: ['Site survey', 'Planting plans', 'Species selection', 'Phasing'],
    },
    {
      title: 'Planting & softscape',
      desc: 'Ornamental trees, shrubs, seasonal flowering beds, topiary, creepers and ground cover - supplied straight off our own farm, hardened before they ever leave it.',
      tags: ['Trees & shrubs', 'Seasonal beds', 'Topiary', 'Ground cover'],
    },
    {
      title: 'Structures & statuary',
      desc: 'Pergolas, screens, edging, water features, planters and statues, fabricated in FRP, iron or Astroturf. Chosen for the exposure the piece has to take, not just how it looks on day one.',
      tags: ['FRP', 'Iron', 'Astroturf', 'Water features'],
    },
    {
      title: 'Lawns & turfing',
      desc: 'Grading, levelling and soil preparation, then turfing in Selection-I, Mexican or Doob grass - matched to the light the site gets and the footfall it has to carry.',
      tags: ['Grading', 'Soil prep', 'Turfing', 'First-season care'],
    },
  ],

  lawns: [
    {
      name: 'Selection-I',
      latin: 'Paspalum vaginatum',
      note: 'A fine, dense, deep-green turf - the closest thing to a formal lawn we lay. Wants an open site and regular mowing, and rewards both.',
      specs: [
        { label: 'Texture',  value: 'Fine, dense'      },
        { label: 'Light',    value: 'Full sun'         },
        { label: 'Best for', value: 'Formal lawns'     },
      ],
    },
    {
      name: 'Mexican grass',
      latin: 'Zoysia tenuifolia',
      note: 'Soft, cushiony and slow-growing, with a rolling surface that suits ornamental settings. The low-maintenance choice where footfall stays light.',
      specs: [
        { label: 'Texture',  value: 'Soft, cushiony'   },
        { label: 'Light',    value: 'Sun to part shade'},
        { label: 'Best for', value: 'Ornamental areas' },
      ],
    },
    {
      name: 'Doob grass',
      latin: 'Cynodon dactylon',
      note: 'The hardiest of the three. It takes heat, drought and heavy use, recovers fast from wear, and is what we lay on grounds that have to work.',
      specs: [
        { label: 'Texture',  value: 'Hard-wearing'     },
        { label: 'Light',    value: 'Full sun'         },
        { label: 'Best for', value: 'High footfall'    },
      ],
    },
  ],

  materials: [
    {
      name: 'FRP',
      desc: 'Fibre-reinforced plastic for planters, statuary and water features - light enough for terraces and slabs, and it will not rust or rot outdoors.',
    },
    {
      name: 'Iron',
      desc: 'Pergolas, trellises, arches and boundary screens fabricated to size, treated and finished for the exposure the piece will sit in.',
    },
    {
      name: 'Astroturf',
      desc: 'Synthetic turf for decks, play areas, terraces and any surface where a live lawn will not hold - laid over a prepared, drained base.',
    },
  ],

  sectors: [
    {
      title: 'Residential',
      desc: 'Private gardens, courtyards, balconies, terraces and rooftop spaces - designed around how the household actually lives outdoors, and sized to a real maintenance appetite.',
      points: [
        'Balconies, terraces and rooftop gardens',
        'Courtyards, front and back gardens',
        'Bungalow and farmhouse grounds',
        'Apartment common areas and podium gardens',
      ],
    },
    {
      title: 'Commercial & institutional',
      desc: 'Campus grounds, township landscapes and public spaces, delivered to drawing, schedule and budget - with phasing where a site has to stay open during the build.',
      points: [
        'IT park and corporate campus grounds',
        'Township and housing-estate landscapes',
        'Hotels, resorts and tourist lodges',
        'Institutional and heritage gardens',
      ],
    },
  ],

  credentials: {
    heading: 'An approved vendor for State Government and CPWD landscaping.',
    desc: 'Public-works projects come with their own tendering, documentation and inspection regime. We hold approved-vendor status with the West Bengal State Government and CPWD, and have executed under it across the state - which means the same crew that builds a private garden is cleared to work on public ground.',
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
  },

  farm: {
    heading: 'A 50-bigha farm at Bibirhut, and no middleman between it and your site.',
    desc: 'Plants and designing material come off our own ground at Ramdevpur. We know how every specimen was raised, fed and hardened - so nothing arrives on site with unknown growing conditions behind it.',
    figures: [
      { label: 'Own farm',   value: '50',    note: 'bighas at Bibirhut, Ramdevpur' },
      { label: 'Polyshed',   value: '2,500', note: 'sqm under poly cover'          },
      { label: 'Greenhouse', value: '2,000', note: 'sqm of controlled growing'     },
      { label: 'Fan-pad',    value: '200',   note: 'sqm climate-controlled house'  },
    ],
  },

  related: [
    { title: 'Garden Maintenance & Aftercare', slug: 'garden-maintenance' },
    { title: 'Roof Garden Design',             slug: 'roof-garden'        },
    { title: 'Vertical Garden Systems',        slug: 'vertical-garden'    },
  ],
}

export default function LandscapeDevelopmentPage() {
  return <LandscapeDevelopmentContent service={SERVICE} />
}
