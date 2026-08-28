import ServiceDetailContent from '../ServiceDetailContent'

export const metadata = {
  title: 'Garden Maintenance & Aftercare - Services',
  description:
    'Annual maintenance contracts covering pruning, feeding, pest management, lawn upkeep and seasonal replanting for gardens across Kolkata and West Bengal.',
}

const SERVICE = {
  num: '02',
  title: 'Garden Maintenance & Aftercare',
  slug: 'garden-maintenance',
  tagline: 'Alive through every season - hands-on care by the team that built it.',
  accent: '#A5B33D',
  images: ['/assets/images/hero/02.jpg', '/assets/images/hero/03.jpg'],
  intro:
    `A garden that isn't maintained reverts faster than anyone expects. We offer annual maintenance contracts (AMC) for gardens we've designed and built, and equally for existing spaces that need a fresh pair of expert hands.`,
  body: [
    `Our field teams carry out scheduled visits for pruning and shaping, granular and foliar feeding, integrated pest and disease management, lawn mowing and edging, irrigation checks, and full seasonal replanting - swapping out warm-season annuals for cool-season varieties and vice versa.`,
    `Inputs come from our own counter stock: the same organic composts, bio-stimulants and selective inorganic fertilisers we sell to retail customers. No third-party material of unknown provenance, no markup on chemicals sourced elsewhere.`,
    `AMC pricing is set annually after a site audit. Clients receive a written maintenance schedule, visit reports and a direct line to the supervising horticulturist for any between-visit queries.`,
  ],
  tags: ['Annual Contracts', 'Pruning & Shaping', 'Pest Management', 'Lawn Upkeep', 'Seasonal Replanting', 'Organic Inputs'],
  highlights: [
    { icon: '📋', label: 'Contract',      value: 'Annual (site-audited, written schedule)'  },
    { icon: '🧪', label: 'Inputs',        value: 'Own-stocked organic & selective fertilisers' },
    { icon: '📊', label: 'Reporting',     value: 'Visit log + supervising horticulturist contact' },
    { icon: '🔄', label: 'Coverage',      value: 'New builds & existing gardens'             },
  ],
  related: [
    { title: 'Landscape Development',   slug: 'landscape-development' },
    { title: 'Roof Garden Design',      slug: 'roof-garden'           },
    { title: 'Vertical Garden Systems', slug: 'vertical-garden'       },
  ],
}

export default function GardenMaintenancePage() {
  return <ServiceDetailContent service={SERVICE} />
}
