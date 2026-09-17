'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Mountain,
  Scissors,
  Building2,
  Layers,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  Check,
  ArrowRight,
  Loader2,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'
import { PhoneInput } from '@/components/ui/phone-input'

export const SERVICES = [
  {
    id: 'landscape-development',
    title: 'Landscape Development',
    tagline: 'Master planning & build',
    desc: 'Site survey, soil conditioning, hardscaping, custom planting plans, and lawn creation.',
    icon: Mountain,
    placeholder:
      'Tell us about the site area, current terrain, sunlight exposure, and your preferred landscape vision...',
    note: 'Includes horticulturist site audit, custom planting layout, itemised costing, and farm stock backup.',
  },
  {
    id: 'garden-maintenance',
    title: 'Garden Maintenance & Aftercare',
    tagline: 'Annual maintenance contracts (AMC)',
    desc: 'Scheduled pruning, soil feeding, organic pest management, lawn upkeep, and seasonal replanting.',
    icon: Scissors,
    placeholder:
      'Tell us about existing plant beds, lawn area, current plant health issues, and visit frequency needed...',
    note: 'Includes scheduled visit logs, 100% own counter organic composts, Stihl tools, and farm plant replacement.',
  },
  {
    id: 'roof-garden',
    title: 'Roof Garden Design',
    tagline: 'Slab protection & lightweight media',
    desc: 'Root-barrier geotextile, 30mm drain cells, lightweight aerated soil, and weather-proof planters.',
    icon: Building2,
    placeholder:
      'Tell us about your rooftop slab condition, floor level, water access, and intended terrace use...',
    note: 'Includes structural load calculation, zero-puncture drainage layout, and wind-tolerant plant palette.',
  },
  {
    id: 'vertical-garden',
    title: 'Vertical Garden Systems',
    tagline: 'Modular living walls & facades',
    desc: 'Modular polymer trays, felt pockets, architectural wire trellises, and automated drip irrigation.',
    icon: Layers,
    placeholder:
      'Tell us about wall dimensions (height × width), indoor or outdoor facade, sunlight levels, and water supply...',
    note: 'Includes rust-proof sub-frame mounting, moisture isolation barrier, and automated micro-drip manifold.',
  },
]

const SCALES = [
  { id: 'small', label: '< 500 sq ft' },
  { id: 'medium', label: '500 – 2,000 sq ft' },
  { id: 'large', label: '2,000 – 10,000 sq ft' },
  { id: 'campus', label: '10,000+ sq ft' },
  { id: 'custom', label: 'Custom / Other' },
]

const TIMELINES = [
  'Immediate (Next 7 days)',
  'Within 1 month',
  '1 – 3 months',
  'Planning stage / Future',
]

export default function ServiceEnquiryForm({ defaultService = 'landscape-development', lockService = false }) {
  const searchParams = useSearchParams()
  const [selectedServiceId, setSelectedServiceId] = useState(defaultService)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    projectScale: '< 500 sq ft',
    preferredTimeline: 'Immediate (Next 7 days)',
    message: '',
  })

  const [ticketId, setTicketId] = useState(null)
  const [submittedService, setSubmittedService] = useState(null)

  // Pre-select service from URL query param if present (e.g. ?service=roof-garden)
  useEffect(() => {
    if (lockService) return
    const param = searchParams?.get('service')
    if (param) {
      const match = SERVICES.find((s) => s.id === param || s.title.toLowerCase().includes(param.toLowerCase()))
      if (match) {
        setSelectedServiceId(match.id)
      }
    }
  }, [searchParams, lockService])

  const currentService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Please provide your name.')
      return
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      toast.error('Please provide a valid email address.')
      return
    }
    if (!form.phone || form.phone.trim().length < 8) {
      toast.error('Please enter a valid mobile number.')
      return
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error('Please provide project details (at least 10 characters).')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          ...form,
          serviceType: currentService.title,
        }

        const res = await fetch('/api/service-enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()

        if (data.success) {
          const ref = data.data?.ticketId || 'MS-RECEIVED'
          setTicketId(ref)
          setSubmittedService(currentService)
          toast.success('Enquiry submitted successfully!')
          setForm({
            name: '',
            email: '',
            phone: '',
            address: '',
            projectScale: '< 500 sq ft',
            preferredTimeline: 'Immediate (Next 7 days)',
            message: '',
          })
        } else {
          toast.error(data.message || 'Failed to submit enquiry. Please try again.')
        }
      } catch {
        toast.error('Network error. Please check your connection.')
      }
    })
  }

  const handleCopyRef = async () => {
    if (!ticketId) return
    try {
      await navigator.clipboard.writeText(ticketId)
      setCopied(true)
      toast.success('Reference ID copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy automatically. Please copy manually.')
    }
  }

  const handleReset = () => {
    setTicketId(null)
    setSubmittedService(null)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className={`flex flex-col ${lockService ? 'items-start text-left' : 'items-center text-center'}`}>
        <h3 className="font-neue text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.2] text-[var(--brand-primary)]">
          Request an on-site horticultural audit
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-[1.75] text-[var(--muted-foreground)]">
          {lockService
            ? `A senior horticulturist will examine light, soil, and drainage on your site for ${currentService.title} and draw an itemised plan with zero obligation.`
            : 'Choose a service below. A senior horticulturist will examine light, soil, and drainage on your site and draw an itemised plan with zero obligation.'}
        </p>
      </div>

      {/* ══ Success Screen ══════════════════════════════════ */}
      {ticketId ? (
        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center" role="status" aria-live="polite">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--brand-primary)]">
            <CheckCircle2 className="size-6" />
          </div>

          <h4 className="mt-4 font-neue text-xl font-medium text-[var(--brand-primary)]">
            Enquiry received for {submittedService?.title || 'Service'}
          </h4>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-[1.75] text-[var(--muted-foreground)]">
            Thank you for reaching out. We have registered your request and emailed a confirmation to your address.
            Our supervising horticulturist will contact you within 24 hours to coordinate the site inspection.
          </p>

          <div className="mx-auto mt-6 flex max-w-md flex-col items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row">
            <div className="text-left">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Your enquiry reference
              </p>
              <p className="font-mono text-lg font-semibold text-[var(--brand-primary)]">
                {ticketId}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyRef}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy ref
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              Submit another enquiry
            </button>
          </div>
        </div>
      ) : (
        /* ══ Form Screen ════════════════════════════════════ */
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-7">
          {/* Service (selector, or locked badge on individual service pages) */}
          {lockService ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)] text-white">
                <currentService.icon className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {currentService.title}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {currentService.note}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-[var(--foreground)]">
                Select a service <span className="text-rose-500">*</span>
              </label>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((s) => {
                  const Icon = s.icon
                  const isSelected = selectedServiceId === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] ${
                        isSelected
                          ? 'border-[var(--brand-primary)] bg-[var(--secondary)]'
                          : 'border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]'
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? 'bg-[var(--brand-primary)] text-white'
                            : 'bg-[var(--secondary)] text-[var(--brand-primary)]'
                        }`}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-neue text-sm font-medium leading-tight text-[var(--foreground)]">
                          {s.title}
                        </h4>
                        <p className="mt-0.5 text-xs leading-[1.35] text-[var(--muted-foreground)] line-clamp-1">
                          {s.tagline}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                {currentService.note}
              </p>
            </div>
          )}

          {/* Contact & Location */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Contact & site details
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sv-name" className="text-xs text-[var(--foreground)]">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="sv-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Ananya Sen"
                    value={form.name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 pr-10 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none"
                  />
                  <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/50" />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sv-email" className="text-xs text-[var(--foreground)]">
                  Email address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="sv-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 pr-10 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none"
                  />
                  <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/50" />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sv-phone" className="text-xs text-[var(--foreground)]">
                  Mobile number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <PhoneInput
                    native
                    id="sv-phone"
                    name="phone"
                    required
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-10 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none"
                    codeOffset="0.875rem"
                  />
                  <Phone className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/50 z-[4]" />
                </div>
              </div>

              {/* Site Address / Locality */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sv-address" className="text-xs text-[var(--foreground)]">
                  Site location / locality <span className="text-[var(--muted-foreground)]">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="sv-address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="e.g. Alipore, New Town, Salt Lake"
                    value={form.address}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 pr-10 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none"
                  />
                  <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Scope & Timing */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Approximate area & timeline
            </label>

            {/* Scale */}
            <div>
              <span className="mb-2 block text-xs text-[var(--muted-foreground)]">
                Approximate area / size
              </span>
              <div className="flex flex-wrap gap-2">
                {SCALES.map((scale) => {
                  const active = form.projectScale === scale.label
                  return (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, projectScale: scale.label }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                      }`}
                    >
                      {scale.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <span className="mb-2 block text-xs text-[var(--muted-foreground)]">
                Preferred project timeline
              </span>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map((t) => {
                  const active = form.preferredTimeline === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, preferredTimeline: t }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                      }`}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Project Brief */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sv-message" className="text-xs text-[var(--foreground)]">
              Project details & requirements <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="sv-message"
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder={currentService.placeholder}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3.5 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none"
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              Include any special considerations such as high wind, full shade, pet-friendly plants, or existing irrigation.
            </p>
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">
            <p className="text-xs text-[var(--muted-foreground)]">
              Zero obligation &middot; Direct response from senior horticulturists
            </p>

            <button
              type="submit"
              disabled={isPending}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] px-8 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[var(--brand-primary-hover)] disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting enquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit service enquiry</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
