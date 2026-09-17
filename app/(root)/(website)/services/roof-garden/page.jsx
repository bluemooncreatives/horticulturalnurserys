import ServiceDetailContent from '../ServiceDetailContent'
import { NURSERY_BIGHAS, POLYSHED_SQM, OPERATING_SINCE_YEAR } from '@/lib/companyInfo'
import JsonLd from '@/components/Application/Website/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/buildBreadcrumbSchema'

export const metadata = {
  title: 'Roof Garden Design - Services',
  description:
    'Specialist roof garden systems with geotextile net and drain-cell layers that protect the structural slab, planted with lightweight media and weather-proof planters across Kolkata.',
  alternates: {
    canonical: '/services/roof-garden',
  },
}

const SERVICE = {
  num: '03',
  title: 'Roof Garden Design',
  titleLines: ['Roof Garden', 'Design'],
  slug: 'roof-garden',
  tagline: 'Protecting your slab, transforming your sky.',
  accent: '#356B38',
  images: [
    'https://res.cloudinary.com/heog9fna/image/upload/w0zt9nz1h7pfhrbldqim', // potted palms along a covered terrace walkway
    'https://res.cloudinary.com/heog9fna/image/upload/d26uc3bvn8m14n80ctoo', // mature tree set against an apartment facade
  ],

  // Hero stat rail
  stats: [
    { label: 'Slab protection',  value: 'Geotextile root barrier'      },
    { label: 'Drainage system',  value: '30mm heavy-duty cell'         },
    { label: 'Growing media',    value: 'Engineered lightweight blend' },
    { label: 'Irrigation',       value: 'Automated drip & timer'       },
  ],

  intro:
    'A roof garden is not simply a ground-level garden placed on a flat slab - it is an engineered system. Every layer matters: waterproofing continuity, root-barrier geotextile, drainage cell, growing medium depth and the structural load budget. We get all of it right before a plant goes in.',

  body: [
    "The base assembly starts with a root-resistant geotextile membrane laid directly over the waterproofing layer, followed by a profiled drain-cell board that carries excess water to the outlet without pooling on the membrane. Growing medium is selected for low dry-weight - typically an expanded-shale or perlite blend - so the finished planted area stays within the slab's safe imposed load.",
    "Plant selection is calibrated to the microclimate: wind exposure at height, summer heat load from the exposed slab, available shade and the client's maintenance appetite. We favour species with deep proven performance on rooftops: ornamental grasses, agaves, select palms, hardy succulents and - where irrigation allows - flowering perennials and seasonal annuals for colour.",
    'Planters, edging and furniture are specified in fibreglass, aluminium or UV-stable resin - materials that handle the temperature extremes a roof surface experiences. We also design the irrigation layout, which is typically a drip system on a timer to reduce manual watering demand.',
    'Every roof garden we deliver is backed by rigorous gradient checks, anti-puncture detailing around parapets and drains, and post-installation monitoring to ensure lush rooftop vitality without risking structural slab integrity.',
  ],

  tags: [
    'Geotextile Layer',
    'Drain Cell',
    'Load Calculation',
    'Lightweight Media',
    'Drip Irrigation',
    'Weather-proof Planters',
    'Root Barrier',
    'Thermal Insulation',
    'Penthouses & Terraces',
    'Zero Leak Guarantee',
  ],

  processHeading: 'Four stages of engineered rooftop greening.',
  process: [
    {
      title: 'Slab audit & load analysis',
      desc: 'We inspect existing waterproofing, test slope-to-drain gradients, and calculate dead and live load allowances per square metre with structural drawings.',
    },
    {
      title: 'Root barrier & drain-cell base',
      desc: 'Laying heavy-duty root-resistant membranes followed by high-compressive-strength profiled drainage cells to ensure instant water evacuation without stagnation.',
    },
    {
      title: 'Geotextile & lightweight soil',
      desc: 'Installing non-woven geotextile filtration fabric and layering engineered growing media composed of perlite, vermiculite, cocopeat, and composted organics.',
    },
    {
      title: 'Planting & micro-irrigation',
      desc: 'Placing wind-hardy specimen plants, setting weather-proof FRP planters, and calibrating multi-zone drip lines with automated battery timers.',
    },
  ],

  capabilitiesHeading: 'Engineered layers tailored for high-wind, high-heat elevated microclimates.',
  capabilities: [
    {
      title: 'Structural load & waterproofing protection',
      desc: 'Every rooftop project begins with structural validation. We work within the slab load budget, installing root-impenetrable membranes over existing waterproofing to prevent leaks.',
      tags: ['Root barrier', 'Structural load check', 'Slab protection', 'Zero-puncture layout'],
    },
    {
      title: 'Sub-surface drainage cells & filtration',
      desc: 'Continuous interlocking 30mm drain cells covered by thermally bonded non-woven geotextile fabric allow storm water to escape rapidly while retaining vital soil particles.',
      tags: ['30mm drain cell', 'Geotextile filter', 'Anti-clog runoff', 'Gradient drainage'],
    },
    {
      title: 'Engineered lightweight growing media',
      desc: 'Custom blends with perlite, expanded clay aggregates, cocopeat, and aged organic humus keep dry and saturated soil weights up to 60% lighter than conventional topsoil.',
      tags: ['Low-density media', 'Expanded clay', 'Perlite-cocopeat blend', 'High aeration'],
    },
    {
      title: 'Automated micro-drip irrigation systems',
      desc: 'Pressure-compensating emitters and sub-surface soaker lines deliver targeted hydration directly to root zones on automated timers, cutting water waste and wind-spray evaporation.',
      tags: ['Drip emitters', 'Battery timers', 'Zero runoff', 'Water conservation'],
    },
  ],

  featureBand: {
    label: 'Layered engineering',
    heading: 'The anatomy of a leak-free, long-lived roof garden.',
    desc: 'A rooftop garden succeeds or fails on what lies beneath the surface. Our multi-layer build-up protects the structural slab indefinitely while keeping plants thriving.',
    items: [
      {
        name: 'Root-barrier membrane',
        sub: 'Layer 01 - Waterproofing Shield',
        note: 'Heavy-gauge polymer root barrier laid over the civil waterproofing membrane, preventing aggressive roots from invading slab micro-fissures.',
        specs: [
          { label: 'Material',         value: 'Virgin HDPE / Geotextile' },
          { label: 'Puncture rating',  value: 'High puncture resistance' },
          { label: 'Joints',           value: 'Overlapped & heat-welded' },
        ],
      },
      {
        name: 'Profiled drainage cells',
        sub: 'Layer 02 - Rapid Runoff Core',
        note: 'Interlocking high-density drainage cells creating a continuous subterranean void that channels monsoon downpours directly to roof drains.',
        specs: [
          { label: 'Compressive load',  value: '> 100 tonnes/sqm'         },
          { label: 'Void ratio',        value: '95% internal flow volume' },
          { label: 'Cell height',       value: '30mm profiled panels'     },
        ],
      },
      {
        name: 'Lightweight media & filter',
        sub: 'Layer 03 - Aerated Root Zone',
        note: 'Non-woven geotextile filter fabric preventing fine silt migration, topped by a formulated low-bulk-density substrate optimized for rooftop moisture retention.',
        specs: [
          { label: 'Dry weight',       value: 'Up to 60% lighter than soil'},
          { label: 'Composition',      value: 'Perlite, vermi & cocopeat' },
          { label: 'Substrate life',   value: 'Non-compacting matrix'     },
        ],
      },
    ],
  },

  materialsSection: {
    label: 'Hardscape & planters',
    heading: 'UV-stable, marine-grade materials built for rooftop exposure.',
    desc: 'Rooftops endure searing summer heat, UV degradation, and monsoon gales. Every planter, edging strip, and fixture we install is engineered specifically for elevated extremes.',
    items: [
      {
        name: 'Custom FRP planters',
        desc: 'High-tensile fibreglass reinforced polymer pots and troughs with integrated overflow drainage, custom-pigmented to match architectural palettes.',
      },
      {
        name: 'Non-woven geotextile',
        desc: 'Thermally bonded polypropylene filter fabric that allows free water percolation while retaining every particle of nutrient-rich soil.',
      },
      {
        name: 'Pressure-compensating drip',
        desc: 'UV-treated polyethylene drip tubing with self-cleaning drippers for uniform water delivery across varying rooftop elevations.',
      },
      {
        name: 'Hardwood & composite decking',
        desc: 'Weatherproof WPC and seasoned timber decking grids elevated on adjustable pedestals to maintain unobstructed slab drainage.',
      },
    ],
  },

  gallery: [
    { src: 'https://res.cloudinary.com/heog9fna/image/upload/xhtaniuqh96rt8qk7h3i', alt: 'A rock garden with palms on a raised deck' },
    { src: 'https://res.cloudinary.com/heog9fna/image/upload/s1fyp9pnjp21pcvdeplv', alt: 'A potted palm furnishing a terrace seating corner' },
    { src: 'https://res.cloudinary.com/heog9fna/image/upload/i87sf29jufprrgl5scjy', alt: 'A container plant styled into a home corner' },
  ],

  sectorsHeading: 'Penthouses, corporate terraces, and institutional green roofs.',
  sectors: [
    {
      title: 'Private residences & penthouses',
      desc: 'Transforming bare concrete terraces and penthouse decks into private green sanctuaries, dining alcoves, and evening entertaining spaces.',
      points: [
        'Custom lightweight planter boxes built to terrace dimensions',
        'Ambient evening LED lighting and pergola integration',
        'Zero structural leakage guarantee on all civil junctions',
        'Low-maintenance, wind-tolerant sensory planting palette',
      ],
    },
    {
      title: 'Commercial & hospitality terraces',
      desc: 'Rooftop dining zones, hotel pool surrounds, and corporate wellness terraces designed for heavy foot traffic and aesthetic impact.',
      points: [
        'Thermal insulation cooling upper floor workspaces beneath',
        'Compliance with building fire codes and wind uplift standards',
        'Durable commercial decking and integrated perimeter planters',
        'Turnkey maintenance options with dedicated horticultural staff',
      ],
    },
  ],

  credentials: {
    heading: 'Engineering elevated green spaces across Kolkata and eastern India.',
    desc: 'From high-rise residential towers along EM Bypass and New Town to banquet pavilions and private heritage rooftops, our roof gardens stand up to Kolkata weather year after year.',
    projects: [
      'EM Bypass High-Rise Penthouses',
      'New Town Luxury Terraces',
      'Soujanya Banquet Rooftop',
      'Alipore Private Bungalow Terraces',
      'Salt Lake Corporate Rooftops',
      'Heritage Mansion Restoration Terraces',
      'Ballygunge Circular Terrace Gardens',
      'Hospitality Poolside Decks',
    ],
  },

  farm: {
    heading: `${NURSERY_BIGHAS} bighas cultivating sun-hardened rooftop plant stock.`,
    desc: 'Plants intended for rooftops cannot come straight from a sheltered greenhouse. At Bibirhut, we condition specimens under full Kolkata sun and wind before they are delivered to your roof.',
    figures: [
      { label: 'Farm nursery',        value: `${NURSERY_BIGHAS}`,                   note: 'bighas of hardened plant production' },
      { label: 'Covered polyshed',    value: POLYSHED_SQM.toLocaleString('en-US'), note: 'sqm of controlled shade production'  },
      { label: 'Hardened varieties',  value: '150+',                                note: 'drought & wind-tolerant species'     },
      { label: 'Since',               value: `${OPERATING_SINCE_YEAR}`,             note: 'years executing elevated landscapes' },
    ],
  },

  related: [
    { title: 'Landscape Development',          slug: 'landscape-development' },
    { title: 'Garden Maintenance & Aftercare', slug: 'garden-maintenance'   },
    { title: 'Vertical Garden Systems',        slug: 'vertical-garden'      },
  ],

  cta: {
    eyebrow: 'Transform your roof',
    heading: 'Turn your empty terrace into a thriving elevated retreat.',
    desc: 'Our structural horticulturists conduct a comprehensive terrace survey, evaluate your slab capacity, and design a customized, leak-proof roof garden plan.',
    buttonText: 'Request a terrace consultation',
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

export default function RoofGardenPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ServiceDetailContent service={SERVICE} />
    </>
  )
}
