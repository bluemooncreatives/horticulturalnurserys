import ServiceDetailContent from '../ServiceDetailContent'

export const metadata = {
  title: 'Vertical Garden Systems - Services',
  description:
    'Modular living-wall and trellis systems for building facades, interiors and boundary screens - custom-designed for light, irrigation and plant species.',
}

const SERVICE = {
  num: '04',
  title: 'Vertical Garden Systems',
  slug: 'vertical-garden',
  tagline: 'Walls that breathe - living surfaces for every scale.',
  accent: '#C9F24E',
  images: ['/assets/images/hero/02.jpg', '/assets/images/hero/01.jpg'],
  intro:
    'Vertical gardens turn unused wall surface into productive planting area - reducing ambient temperature around a building, improving air quality indoors, and delivering a visual impact that no other finish can match. The system we design is engineered for long-term plant health, not just the day-one photograph.',
  body: [
    'Systems are modular and custom-sized to the wall, available in panel formats (pocket fabric, rigid tray or polypropylene cell) or as structural trellis frames for climbers. Each installation is designed around the specific light conditions - full sun facades, semi-shaded atriums, north-facing interior walls - with species chosen accordingly.',
    'Irrigation is built into the system from day one: typically a top-fed drip line that gravity-distributes moisture through the panel depth, with a collection tray or drainage connection at the base. We integrate moisture sensors and automated timers where feasible to reduce maintenance demand.',
    'Interior installations use species proven to tolerate low-light and HVAC-controlled air: tropical aroids, pothos, philodendrons, peace lilies and select ferns. Exterior facades use weather-hardy perennials, ornamental grasses, junipers and seasonal flowering climbers depending on the climate exposure.',
    'Each system comes with a commissioning visit once plants are established, a written care guide and an optional AMC for ongoing maintenance.',
  ],
  tags: ['Modular Panels', 'Trellis Frames', 'Built-in Drip Irrigation', 'Interior Systems', 'Facade Planting', 'AMC Available'],
  highlights: [
    { icon: '🧩', label: 'System type',    value: 'Pocket fabric, rigid tray or trellis'        },
    { icon: '💧', label: 'Irrigation',     value: 'Top-fed drip + moisture sensor option'       },
    { icon: '🌿', label: 'Interior spec',  value: 'Aroids, pothos, ferns (low-light tolerant)'  },
    { icon: '🌸', label: 'Exterior spec',  value: 'Grasses, junipers, flowering climbers'       },
  ],
  related: [
    { title: 'Landscape Development',          slug: 'landscape-development' },
    { title: 'Garden Maintenance & Aftercare', slug: 'garden-maintenance'   },
    { title: 'Roof Garden Design',             slug: 'roof-garden'          },
  ],
}

export default function VerticalGardenPage() {
  return <ServiceDetailContent service={SERVICE} />
}
