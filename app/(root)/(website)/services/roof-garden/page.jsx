import ServiceDetailContent from '../ServiceDetailContent'

export const metadata = {
  title: 'Roof Garden Design — Services',
  description:
    'Specialist roof garden systems with geotextile net and drain-cell layers that protect the structural slab, planted with lightweight media and weather-proof planters.',
}

const SERVICE = {
  num: '03',
  title: 'Roof Garden Design',
  slug: 'roof-garden',
  tagline: 'Protecting your slab, transforming your sky.',
  accent: '#356B38',
  images: ['/assets/images/hero/03.jpg', '/assets/images/hero/01.jpg'],
  intro:
    `A roof garden is not simply a ground-level garden placed on a flat slab — it is an engineered system. Every layer matters: waterproofing continuity, root-barrier geotextile, drainage cell, growing medium depth and the structural load budget. We get all of it right before a plant goes in.`,
  body: [
    `The base assembly starts with a root-resistant geotextile membrane laid directly over the waterproofing layer, followed by a profiled drain-cell board that carries excess water to the outlet without pooling on the membrane. Growing medium is selected for low dry-weight — typically an expanded-shale or perlite blend — so the finished planted area stays within the slab's safe imposed load.`,
    `Plant selection is calibrated to the microclimate: wind exposure at height, summer heat load from the exposed slab, available shade and the client's maintenance appetite. We favour species with deep proven performance on rooftops: ornamental grasses, agaves, select palms, hardy succulents and — where irrigation allows — flowering perennials and seasonal annuals for colour.`,
    `Planters, edging and furniture are specified in fibreglass, aluminium or UV-stable resin — materials that handle the temperature extremes a roof surface experiences. We also design the irrigation layout, which is typically a drip system on a timer to reduce manual watering demand.`,
  ],
  tags: ['Geotextile Layer', 'Drain Cell', 'Load Calculation', 'Lightweight Media', 'Drip Irrigation', 'Weather-proof Planters'],
  highlights: [
    { icon: '🏗️', label: 'Key layers',     value: 'Geotextile → drain cell → lightweight media' },
    { icon: '⚖️', label: 'Load review',     value: 'Growing medium selected within slab budget'   },
    { icon: '💧', label: 'Irrigation',      value: 'Drip system with timer (reduced manual labour)'  },
    { icon: '🌬️', label: 'Plant palette',  value: 'Wind-hardy, heat-tolerant species'             },
  ],
  related: [
    { title: 'Landscape Development',          slug: 'landscape-development' },
    { title: 'Garden Maintenance & Aftercare', slug: 'garden-maintenance'   },
    { title: 'Vertical Garden Systems',        slug: 'vertical-garden'      },
  ],
}

export default function RoofGardenPage() {
  return <ServiceDetailContent service={SERVICE} />
}
