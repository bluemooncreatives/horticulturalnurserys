import ServiceDetailContent from '../ServiceDetailContent'

export const metadata = {
  title: 'Landscape Development — Services',
  description:
    'Full-spectrum outdoor landscape design and execution. Township gardens, government parks, IT campus grounds, lake fronts and tourist lodges across West Bengal.',
}

const SERVICE = {
  num: '01',
  title: 'Landscape Development',
  slug: 'landscape-development',
  tagline: 'From concept to canopy — parks, estates and everything in between.',
  accent: '#C9F24E',
  images: ['/assets/images/hero/01.jpg', '/assets/images/hero/02.jpg'],
  intro:
    `Every landscape project starts with reading the land — light angles, soil profile, drainage paths and the way people will actually move through the space. Only then do we draw up a planting plan and a costing. We don't begin until the layout and estimate are agreed.`,
  body: [
    `Our portfolio spans balconies and rooftop terraces right through to township-scale grounds of several acres. The same team — qualified horticulturists, licensed landscape architects and our own field crew — handles projects at every scale.`,
    `Credentials include approved-vendor status with the West Bengal State Government and CPWD for public-works landscaping: parks, lake-front promenades, zoo and library grounds, IT park campuses, government tourist lodges and heritage gardens.`,
    `Materials and plants come directly from our 50-bigha farm at Bibirhut, Ramdevpur — 2,500 sqm of polyshed, 2,000 sqm of greenhouse and a 200 sqm fan-pad house. No middleman, no unknown growing conditions.`,
  ],
  tags: ['Site Survey', 'Planting Plans', 'Costing & Phasing', 'Township Scale', 'State Govt. / CPWD', 'Own Farm Stock'],
  highlights: [
    { icon: '📐', label: 'Process',        value: 'Site visit → Plan → Costing → Build' },
    { icon: '🏛️', label: 'Credentials',    value: 'State Govt. & CPWD approved vendor'  },
    { icon: '🌱', label: 'Plant source',    value: '50-bigha farm, Bibirhut'              },
    { icon: '📏', label: 'Project scale',   value: 'Balcony to township (multi-acre)'     },
  ],
  related: [
    { title: 'Garden Maintenance & Aftercare', slug: 'garden-maintenance'    },
    { title: 'Roof Garden Design',             slug: 'roof-garden'           },
    { title: 'Vertical Garden Systems',        slug: 'vertical-garden'       },
  ],
}

export default function LandscapeDevelopmentPage() {
  return <ServiceDetailContent service={SERVICE} />
}
