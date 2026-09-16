import ServiceDetailContent from '../ServiceDetailContent'
import { NURSERY_BIGHAS, POLYSHED_SQM, OPERATING_SINCE_YEAR } from '@/lib/companyInfo'
import JsonLd from '@/components/Application/Website/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/buildBreadcrumbSchema'

export const metadata = {
  title: 'Garden Maintenance & Aftercare - Services',
  description:
    'Annual maintenance contracts (AMC) covering pruning, feeding, pest management, lawn upkeep and seasonal replanting for residential and commercial gardens across Kolkata and West Bengal.',
  alternates: {
    canonical: '/services/garden-maintenance',
  },
}

const SERVICE = {
  num: '02',
  title: 'Garden Maintenance & Aftercare',
  titleLines: ['Garden Maintenance', '& Aftercare'],
  slug: 'garden-maintenance',
  tagline:
    'Alive through every season - hands-on care by the team that raised the plants and built the landscape.',
  accent: '#A5B33D',
  images: ['/assets/images/hero/02.jpg', '/assets/images/hero/03.jpg'],

  // Hero stat rail
  stats: [
    { label: 'Contract type',  value: 'Annual (AMC)'               },
    { label: 'Field visits',   value: 'Scheduled & logged'         },
    { label: 'Inputs used',    value: '100% own counter stock'     },
    { label: 'Supervised by',  value: 'Qualified horticulturists'  },
  ],

  intro:
    "A garden that isn't maintained reverts faster than anyone expects. We offer annual maintenance contracts (AMC) for landscapes we've designed and built, and equally for existing residential and corporate grounds that need a fresh pair of expert hands.",

  body: [
    "Our field teams carry out scheduled visits for pruning and shaping, granular and foliar feeding, integrated pest and disease management, lawn mowing and edging, irrigation checks, and full seasonal replanting - swapping out warm-season annuals for cool-season varieties and vice versa.",
    "Inputs come exclusively from our own counter stock: the same organic composts, bio-stimulants and selective inorganic fertilisers we sell to retail customers across Kolkata. No third-party material of unknown provenance, no markup on chemicals sourced elsewhere.",
    "AMC pricing is set annually after a detailed site audit. Clients receive a written maintenance schedule, visit reports and a direct line to the supervising horticulturist for any between-visit queries or emergency plant consultations.",
    "Because maintenance is executed by trained horticultural staff rather than general casual labour, plants are treated according to their specific physiological growth stages - ensuring deep root establishment, vigorous flowering cycles, and multi-year longevity.",
  ],

  tags: [
    'Annual Contracts',
    'Pruning & Topiary',
    'Integrated Pest Management',
    'Lawn Mowing & Edging',
    'Seasonal Replanting',
    'Organic Counter Inputs',
    'Written Visit Logs',
    'Soil & Foliar Nutrition',
    'Residential & Commercial',
    'Own Farm Stock Backup',
  ],

  processHeading: 'Four stages of systematic garden care.',
  process: [
    {
      title: 'Site audit & soil test',
      desc: 'A senior horticulturist audits the site, examining soil health, pH, sunlight exposure, pest presence and irrigation efficiency.',
    },
    {
      title: 'Custom annual calendar',
      desc: 'We draft a month-by-month care plan mapping pruning cycles, fertilizer schedules, prophylactic sprays and seasonal replanting.',
    },
    {
      title: 'Scheduled field execution',
      desc: 'Our trained crew executes scheduled visits: precision trimming, root-zone aeration, weeding, foliar feeding and pest checks.',
    },
    {
      title: 'Seasonal changeover & log',
      desc: 'At each season change, spent beds are refreshed from our Bibirhut farm, soil is conditioned, and an updated status log is handed over.',
    },
  ],

  capabilitiesHeading: 'Complete care covering every plant, lawn and water feature.',
  capabilities: [
    {
      title: 'Pruning, hedging & topiary',
      desc: 'Formative and aesthetic pruning for ornamental shrubs, topiaries, boundary hedges, and trees to maintain clean geometry and encourage bushiness.',
      tags: ['Hedge trimming', 'Topiary care', 'Crown thinning', 'Deadheading'],
    },
    {
      title: 'Soil nutrition & fertilization',
      desc: 'Granular root feeding and micronutrient foliar sprays timed to vegetative and flowering stages, utilizing our own organic composts and bio-stimulants.',
      tags: ['Organic compost', 'Foliar nutrition', 'Soil aeration', 'Bio-stimulants'],
    },
    {
      title: 'Integrated pest management',
      desc: 'Prophylactic biological controls and targeted organic treatments against fungal leaf spot, mealybugs, aphids, and borers before infestations spread.',
      tags: ['Neem formulations', 'Fungal controls', 'Preventive sprays', 'Non-toxic care'],
    },
    {
      title: 'Lawn upkeep & irrigation audits',
      desc: 'Mowing, de-thatching, edging, and localized top-dressing for Selection-I, Mexican, and Doob lawns, coupled with nozzle inspection and pressure calibration.',
      tags: ['Mowing & edging', 'Lawn de-thatching', 'Sprinkler audits', 'Selective weeding'],
    },
  ],

  featureBand: {
    label: 'Seasonal calendars',
    heading: 'Three seasons. Tailored care for each.',
    desc: "Kolkata's tropical climate demands distinct horticultural strategies for monsoon humidity, winter flower production, and intense summer heat.",
    items: [
      {
        name: 'Monsoon protection',
        sub: 'July – September',
        note: 'Combatting waterlogging, fungal leaf spot, and root rot during torrential rains, with rapid weed clearing and prophylactic bio-fungicide sprays.',
        specs: [
          { label: 'Drainage check', value: 'Weekly root-zone audits'   },
          { label: 'Pest focus',     value: 'Slugs, snails & damping off'},
          { label: 'Feeding',        value: 'Slow-release root tonics'   },
        ],
      },
      {
        name: 'Winter flowering',
        sub: 'November – February',
        note: 'The flagship display period for Kolkata gardens: bed preparation, planting seasonal annuals, deadheading, and high-potash bloom nutrition.',
        specs: [
          { label: 'Replanting',     value: 'Petunias, marigolds, dahlias'},
          { label: 'Pruning',        value: 'Rose hard pruning & shape'  },
          { label: 'Feeding',        value: 'Weekly liquid organic feeds' },
        ],
      },
      {
        name: 'Summer heat shield',
        sub: 'March – June',
        note: 'Deep watering protocols, surface mulch application to preserve soil moisture, shade cloth deployment, and foliar anti-transpirants.',
        specs: [
          { label: 'Moisture care',  value: 'Mulch & drip calibration'   },
          { label: 'Lawn height',    value: 'Higher cut height (shade)'  },
          { label: 'Pest focus',     value: 'Red spider mites & thrips'  },
        ],
      },
    ],
  },

  materialsSection: {
    label: 'Inputs & equipment',
    heading: 'Only what we sell across our own counter.',
    desc: 'Every compost, manure, bio-fertilizer and spray applied to your garden is drawn from our own counter inventory at Alipore and Bibirhut. No substandard chemicals, no unverified blends.',
    items: [
      {
        name: 'Compost & vermi',
        desc: 'Fully matured, pathogen-free farm vermicompost and cow-dung manure for steady soil organic carbon enrichment.',
      },
      {
        name: 'Bio-pesticides',
        desc: 'Cold-pressed neem oil, Trichoderma viride, and organic botanical extracts safe for family residences and pets.',
      },
      {
        name: 'Stihl equipment',
        desc: 'Commercial battery and petrol hedge trimmers, pole pruners, and mowers for surgical, clean plant cuts without tearing bark.',
      },
      {
        name: 'Foliar nutrients',
        desc: 'Chelated micronutrient cocktails (Zinc, Boron, Iron, Magnesium) absorbed immediately through leaf stomata.',
      },
    ],
    image: '/assets/images/hero/03.jpg',
  },

  sectorsHeading: 'Private residences and commercial grounds, maintained with equal care.',
  sectors: [
    {
      title: 'Residential gardens & estates',
      desc: 'Bungalow grounds, villa landscapes, rooftop sit-outs, and private courtyards maintained with quiet, respectful professionalism.',
      points: [
        'Discreet, scheduled visit times aligned to household routine',
        'Zero chemical toxicity around children and family pets',
        'Fresh seasonal potted plants swapped in for family events',
        'Dedicated supervising horticulturist accessible for direct queries',
      ],
    },
    {
      title: 'Commercial campuses & townships',
      desc: 'High-visibility corporate headquarters, IT campuses, hotels, government parks, and housing township common gardens.',
      points: [
        'Full compliance with corporate vendor guidelines and safety norms',
        'Mechanized lawn mowing and boundary hedge maintenance',
        'Detailed monthly service logs and attendance reporting',
        'Rapid replacement of stressed specimens from our Bibirhut farm',
      ],
    },
  ],

  credentials: {
    heading: 'Maintaining landmark grounds and civic landscapes since 1989.',
    desc: 'From the historic botanicals of the National Library to the lake promenade at Rabindra Sarobar and private embassy residences, our maintenance teams protect the city’s green heritage.',
    projects: [
      'Alipore Zoological Gardens',
      'Rabindra Sarobar Lake grounds',
      'National Library Estate',
      'Krishnanagar IT Park',
      'West Bengal Legislative Assembly',
      'Soujanya Banquet Gardens',
      'Corporate IT Campuses',
      'Private Bungalows & Penthouses',
    ],
  },

  farm: {
    heading: `${NURSERY_BIGHAS} bighas backing every contract - zero delays on replacements.`,
    desc: 'When a specimen needs rejuvenation or seasonal beds require fresh annuals, stock is pulled immediately from our own nursery at Bibirhut without waiting on third-party traders.',
    figures: [
      { label: 'Farm backup',    value: `${NURSERY_BIGHAS}`,                          note: 'bighas of active nursery ground'    },
      { label: 'Shade houses',   value: POLYSHED_SQM.toLocaleString('en-US'),        note: 'sqm of acclimatized nursery stock'  },
      { label: 'Counter inputs', value: '100%',                                       note: 'own certified organic blends'       },
      { label: 'Since',          value: `${OPERATING_SINCE_YEAR}`,                    note: 'years caring for Kolkata landscapes'},
    ],
  },

  related: [
    { title: 'Landscape Development',   slug: 'landscape-development' },
    { title: 'Roof Garden Design',      slug: 'roof-garden'           },
    { title: 'Vertical Garden Systems', slug: 'vertical-garden'       },
  ],

  cta: {
    eyebrow: 'Book an audit',
    heading: 'Get a comprehensive garden health audit.',
    desc: 'A senior horticulturist inspects your space, diagnoses soil and pest conditions, and provides an itemized AMC proposal with no obligation.',
    buttonText: 'Schedule a garden audit',
    buttonUrl: '/contact',
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: SERVICE.title,
  name: SERVICE.title,
  description: SERVICE.intro,
  provider: { '@type': 'GardenStore', name: 'Horticultural Development Centre' },
  areaServed: { '@type': 'City', name: 'Kolkata' },
}

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: SERVICE.title },
])

export default function GardenMaintenancePage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ServiceDetailContent service={SERVICE} />
    </>
  )
}
