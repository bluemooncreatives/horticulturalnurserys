import ServiceDetailContent from '../ServiceDetailContent'
import { NURSERY_BIGHAS, POLYSHED_SQM, OPERATING_SINCE_YEAR } from '@/lib/companyInfo'

export const metadata = {
  title: 'Vertical Garden Systems - Services',
  description:
    'Modular living-wall and trellis systems for building facades, interiors and boundary screens across Kolkata - custom-designed for light, irrigation and plant species.',
}

const SERVICE = {
  num: '04',
  title: 'Vertical Garden Systems',
  titleLines: ['Vertical Garden', 'Systems'],
  slug: 'vertical-garden',
  tagline: 'Walls that breathe - living surfaces for every scale.',
  accent: '#C9F24E',
  images: ['/assets/images/hero/02.jpg', '/assets/images/hero/01.jpg'],

  // Hero stat rail
  stats: [
    { label: 'System formats',  value: 'Rigid trays, felt & trellis' },
    { label: 'Irrigation',      value: 'Automated top-fed drip'      },
    { label: 'Environments',    value: 'Interior & exterior facades' },
    { label: 'Aftercare',       value: 'Comprehensive AMC options'   },
  ],

  intro:
    'Vertical gardens turn unused wall surface into productive planting area - reducing ambient temperature around a building, improving air quality indoors, and delivering a visual impact that no other finish can match. The system we design is engineered for long-term plant health, not just the day-one photograph.',

  body: [
    'Systems are modular and custom-sized to the wall, available in panel formats (pocket fabric, rigid tray or polypropylene cell) or as structural trellis frames for climbers. Each installation is designed around the specific light conditions - full sun facades, semi-shaded atriums, north-facing interior walls - with species chosen accordingly.',
    'Irrigation is built into the system from day one: typically a top-fed drip line that gravity-distributes moisture through the panel depth, with a collection tray or drainage connection at the base. We integrate moisture sensors and automated timers where feasible to reduce maintenance demand.',
    'Interior installations use species proven to tolerate low-light and HVAC-controlled air: tropical aroids, pothos, philodendrons, peace lilies and select ferns. Exterior facades use weather-hardy perennials, ornamental grasses, junipers and seasonal flowering climbers depending on the climate exposure.',
    'Each system comes with a commissioning visit once plants are established, a written care guide and an optional AMC for ongoing maintenance.',
  ],

  tags: [
    'Modular Panels',
    'Trellis Frames',
    'Built-in Drip Irrigation',
    'Interior Systems',
    'Facade Planting',
    'AMC Available',
    'Living Architecture',
    'Air Purification',
    'Acoustic Buffering',
    'UV-Treated Polypropylene',
  ],

  processHeading: 'Four stages from bare facade to a living vertical ecosystem.',
  process: [
    {
      title: 'Wall & light intensity survey',
      desc: 'We assess structural wall load, ambient light levels (lux meter), HVAC air flow for interiors, and sun/wind trajectory for exterior facades.',
    },
    {
      title: 'Framework & moisture barrier',
      desc: 'Mounting corrosion-resistant powder-coated aluminium or GI sub-frames with waterproof backing boards to isolate the living wall from building masonry.',
    },
    {
      title: 'Module & irrigation assembly',
      desc: 'Fixing modular polypropylene trays or multi-layer geotextile cells, integrating pressure-compensating drip manifolds, and plumbing bottom catch basins.',
    },
    {
      title: 'Plant installation & calibration',
      desc: 'Inserting mature nursery-grown plants in custom root media, programming cycle timers, and balancing water runoff for even vertical hydration.',
    },
  ],

  capabilitiesHeading: 'Engineered living wall systems for high-impact architecture.',
  capabilities: [
    {
      title: 'Indoor low-light botanical walls',
      desc: 'Specially designed interior living walls engineered for air-conditioned lobbies and atriums, featuring lush tropical foliage that thrives under artificial grow lights.',
      tags: ['HVAC tolerant', 'Aroids & ferns', 'Air purification', 'Zero wall dampness'],
    },
    {
      title: 'Exterior architectural facades',
      desc: 'Heavy-duty weather-proof modular panels built to withstand Kolkata summer heat, torrential monsoons, and high winds while creating a dynamic green envelope.',
      tags: ['UV-stabilized trays', 'Wind-load tested', 'Thermal insulation', 'Facade cooling'],
    },
    {
      title: 'Architectural trellis & green screens',
      desc: 'High-tensile marine-grade stainless steel cables and wire-mesh trellis systems that guide vigorous climbing vines for natural privacy screens and shading.',
      tags: ['Stainless wire trellis', 'Living privacy screens', 'Climbing flora', 'Low maintenance'],
    },
    {
      title: 'Automated micro-irrigation & fertigation',
      desc: 'Gravity-assisted drip lines connected to digital timers with integrated nutrient injectors, keeping vertical root zones consistently nourished with zero wastage.',
      tags: ['Automated timers', 'Even moisture distribution', 'Catchment gutters', 'Water recycling'],
    },
  ],

  featureBand: {
    label: 'Modular engineering',
    heading: 'Three system architectures for every architectural surface.',
    desc: 'Every building surface has unique structural, thermal, and maintenance requirements. We specify the precise vertical system best suited to your architectural envelope.',
    items: [
      {
        name: 'Rigid modular polymer trays',
        sub: 'Format 01 - High-Traffic & Facades',
        note: 'Heavy-duty UV-stabilized polypropylene cassette boxes that allow individual plant replacement without disturbing surrounding modules.',
        specs: [
          { label: 'Material',       value: '100% recyclable virgin PP' },
          { label: 'Plant density',  value: '32 - 40 plants / sqm'       },
          { label: 'Replacement',    value: 'Independent pot swap'       },
        ],
      },
      {
        name: 'Multi-layer geotextile felt',
        sub: 'Format 02 - Continuous Organic Flow',
        note: 'Multi-pocket synthetic capillary felt layers mounted on PVC backing boards for continuous root expansion and seamless foliage coverage.',
        specs: [
          { label: 'Structure',      value: 'Dual-layer needle felt'     },
          { label: 'Weight',         value: '< 25 kg/sqm saturated'      },
          { label: 'Aesthetics',     value: 'Curved wall compatibility'  },
        ],
      },
      {
        name: 'Structural cable trellis',
        sub: 'Format 03 - Passive Green Shading',
        note: 'Architectural grade 316 stainless steel cable grids and mesh panels that support climbing creepers to shade glass facades and soften concrete.',
        specs: [
          { label: 'Cable material', value: 'Marine grade 316 SS'        },
          { label: 'Span capacity',  value: 'Multi-storey spans'         },
          { label: 'Maintenance',    value: 'Minimal moving parts'       },
        ],
      },
    ],
  },

  materialsSection: {
    label: 'Components & hardware',
    heading: 'Commercial-grade hardware built for zero leaks.',
    desc: 'A vertical garden lives or dies by its engineering tolerances. We use only industrial-grade brackets, UV-treated polymer trays, and precision drip lines that prevent water seepage into walls.',
    items: [
      {
        name: 'UV-stabilized polymer modules',
        desc: 'High-impact polypropylene modules with built-in drainage weep holes and root retaining baffles.',
      },
      {
        name: 'Pressure-compensating drippers',
        desc: 'Precision emitters ensuring identical water volume across the top row and bottom row, regardless of water line pressure.',
      },
      {
        name: 'Aluminium mounting sub-frame',
        desc: 'Lightweight, rust-proof extruded aluminium tracks that keep the living wall 50mm away from the building surface for continuous ventilation.',
      },
      {
        name: 'Stainless catch basins',
        desc: 'Bottom gutter trays in powder-coated aluminium or stainless steel that catch excess drip runoff and channel it to floor drains.',
      },
    ],
    image: '/assets/images/hero/01.jpg',
  },

  sectorsHeading: 'Corporate lobbies, luxury residences, and public facades.',
  sectors: [
    {
      title: 'Commercial lobbies & atriums',
      desc: 'Dramatic statement living walls that elevate corporate brand identity, reduce acoustic reverberation, and purify indoor office air.',
      points: [
        'Acoustic sound dampening in open reverberant atriums',
        'Supplementary full-spectrum grow light integration',
        'Full AMC support with monthly plant health reviews',
        'Clean, mess-free operation with concealed water catchment',
      ],
    },
    {
      title: 'Residential balconies & courtyards',
      desc: 'Turning boundary walls, balcony enclosures, and compact courtyard walls into lush, vertical private sanctuaries.',
      points: [
        'Maximizes green footprint without sacrificing floor area',
        'Natural air cooling and dust filtration for urban balconies',
        'Quiet automated watering routines that run without manual hassle',
        'Choice of flowering accents and dramatic sculptural foliage',
      ],
    },
  ],

  credentials: {
    heading: 'Elevating architectural spaces across Kolkata with living walls.',
    desc: 'From high-profile IT campuses in Salt Lake Sector V to luxury banquet reception halls and boutique private residences, our living walls thrive year-round.',
    projects: [
      'Sector V Corporate Lobbies',
      'New Town Hospitality Atriums',
      'Soujanya Reception Wall',
      'Alipore Luxury Villa Courtyards',
      'Ballygunge Penthouse Balcony Walls',
      'Park Street Restaurant Interiors',
      'Kolkata Commercial Office Facades',
      'Institutional Building Entrances',
    ],
  },

  farm: {
    heading: `${NURSERY_BIGHAS} bighas cultivating specialized vertical garden foliage.`,
    desc: 'Vertical gardens require plants with compact root systems and dense, cascading habit. We propagate and acclimatize thousands of shade-tolerant and sun-hardy specimens at Bibirhut.',
    figures: [
      { label: 'Farm nursery',     value: `${NURSERY_BIGHAS}`,                   note: 'bighas of proprietary nursery ground' },
      { label: 'Covered polyshed', value: POLYSHED_SQM.toLocaleString('en-US'), note: 'sqm of shade-house acclimatization'   },
      { label: 'Wall varieties',   value: '45+',                                 note: 'vetted high-performing cultivars'     },
      { label: 'Since',            value: `${OPERATING_SINCE_YEAR}`,             note: 'years crafting living ecosystems'     },
    ],
  },

  related: [
    { title: 'Landscape Development',          slug: 'landscape-development' },
    { title: 'Garden Maintenance & Aftercare', slug: 'garden-maintenance'   },
    { title: 'Roof Garden Design',             slug: 'roof-garden'          },
  ],

  cta: {
    eyebrow: 'Install a living wall',
    heading: 'Bring your walls to life with living architecture.',
    desc: 'Our specialized living wall engineers evaluate your wall structure, light levels, and water connections to design a bespoke modular system tailored to your space.',
    buttonText: 'Schedule a vertical garden consultation',
    buttonUrl: '/contact',
  },
}

export default function VerticalGardenPage() {
  return <ServiceDetailContent service={SERVICE} />
}
