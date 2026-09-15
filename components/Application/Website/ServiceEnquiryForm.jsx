'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Mountain,
  Scissors,
  Building2,
  Layers,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  Clock,
  Maximize2,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  CalendarCheck,
  ShieldCheck,
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
  { id: 'small', label: '< 500 sq ft', desc: 'Balcony / Sit-out' },
  { id: 'medium', label: '500 – 2,000 sq ft', desc: 'Terrace / Villa' },
  { id: 'large', label: '2,000 – 10,000 sq ft', desc: 'Estate / Commercial' },
  { id: 'campus', label: '10,000+ sq ft', desc: 'Campus / Township' },
  { id: 'custom', label: 'Custom / Other', desc: 'Audit needed' },
]

const TIMELINES = [
  'Immediate (Next 7 days)',
  'Within 1 month',
  '1 – 3 months',
  'Planning stage / Future',
]

export default function ServiceEnquiryForm({ defaultService = 'landscape-development' }) {
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
    const param = searchParams?.get('service')
    if (param) {
      const match = SERVICES.find((s) => s.id === param || s.title.toLowerCase().includes(param.toLowerCase()))
      if (match) {
        setSelectedServiceId(match.id)
      }
    }
  }, [searchParams])

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
    <div className="relative w-full">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-64 w-full max-w-5xl rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--brand-lime) 0%, var(--brand-primary) 60%, transparent 80%)',
        }}
      />

      {/* Header */}
      <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 px-4 py-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
            <Sparkles className="size-3.5 text-[var(--brand-primary)]" />
            Book a Site Consultation
          </span>

          <h3 className="mt-5 font-neue text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--brand-primary)]">
            Request an on-site horticultural audit.
          </h3>

          <p className="mt-3 max-w-2xl text-[0.92rem] leading-[1.75] text-[var(--muted-foreground)]">
            Choose from our 4 core services below. A senior horticulturist will examine light, soil,
            and drainage on your site and draw an itemised plan with zero obligation.
          </p>
        </div>

        {/* ══ Success Screen ══════════════════════════════════ */}
        {ticketId ? (
          <div className="mt-10 rounded-[var(--radius-3xl)] border border-[var(--brand-primary)]/25 bg-[var(--background)] p-8 sm:p-10 text-center" role="status" aria-live="polite">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--brand-lime)]/20 text-[var(--brand-primary)]">
              <CheckCircle2 className="size-8" />
            </div>

            <h4 className="mt-5 font-neue text-[clamp(1.5rem,3vw,2rem)] font-medium text-[var(--brand-primary)]">
              Enquiry Received for {submittedService?.title || 'Service'}
            </h4>

            <p className="mx-auto mt-3 max-w-lg text-[0.9rem] leading-[1.75] text-[var(--muted-foreground)]">
              Thank you for reaching out. We have registered your request and emailed a confirmation to your address.
              Our supervising horticulturist will contact you within 24 hours to coordinate the site inspection.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:p-5">
              <div className="text-left">
                <p className="text-[0.7rem] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">
                  Your Enquiry Reference
                </p>
                <p className="font-mono text-xl font-bold tracking-wider text-[var(--brand-primary)]">
                  {ticketId}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--brand-primary)]/40 hover:bg-[var(--secondary)]"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy Ref
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-primary)] px-6 py-3 text-[0.85rem] font-medium text-white transition-all hover:bg-[var(--brand-primary-hover)]"
              >
                Submit another enquiry
              </button>
            </div>
          </div>
        ) : (
          /* ══ Form Screen ════════════════════════════════════ */
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">
            {/* Step 1: 4 Types of Services Selector */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                  1. Select a Service <span className="text-[var(--brand-primary)]">*</span>
                </label>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Click to switch services
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((s) => {
                  const Icon = s.icon
                  const isSelected = selectedServiceId === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`group relative flex items-start gap-2.5 rounded-[var(--radius-xl)] border p-3 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] ${
                        isSelected
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 shadow-md ring-1 ring-[var(--brand-primary)]/30'
                          : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand-primary)]/30 hover:bg-[var(--card)]'
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] transition-colors duration-300 ${
                          isSelected
                            ? 'bg-[var(--brand-primary)] text-white'
                            : 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)]/15'
                        }`}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`font-neue text-[0.92rem] font-medium leading-tight ${
                            isSelected ? 'text-[var(--brand-primary)]' : 'text-[var(--foreground)]'
                          }`}
                        >
                          {s.title}
                        </h4>
                        <p className="mt-0.5 text-[0.72rem] leading-[1.4] text-[var(--muted-foreground)] line-clamp-1">
                          {s.tagline}
                        </p>
                      </div>

                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                            : 'border-[var(--border)] bg-transparent opacity-40'
                        }`}
                      >
                        {isSelected && <Check className="size-2.5" strokeWidth={2.5} />}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Service Guidance Pill */}
              <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-[var(--brand-primary)]/15 bg-[var(--brand-primary)]/5 px-4 py-2.5 text-xs text-[var(--brand-primary)]">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--brand-primary)]" />
                <p className="leading-relaxed">
                  <strong className="font-semibold">{currentService.title}:</strong> {currentService.note}
                </p>
              </div>
            </div>

            {/* Step 2: Contact & Location Info */}
            <div className="flex flex-col gap-4">
              <label className="text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                2. Contact & Site Details
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sv-name" className="text-xs font-semibold text-[var(--foreground)]">
                    Full Name <span className="text-rose-500">*</span>
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
                      className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pr-11 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                    />
                    <User className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/60" />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sv-email" className="text-xs font-semibold text-[var(--foreground)]">
                    Email Address <span className="text-rose-500">*</span>
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
                      className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pr-11 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                    />
                    <Mail className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/60" />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sv-phone" className="text-xs font-semibold text-[var(--foreground)]">
                    Mobile Number <span className="text-rose-500">*</span>
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
                      className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pr-11 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                      codeOffset="1rem"
                    />
                    <Phone className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/60 z-[4]" />
                  </div>
                </div>

                {/* Site Address / Locality */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sv-address" className="text-xs font-semibold text-[var(--foreground)]">
                    Site Location / Locality <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
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
                      className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pr-11 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                    />
                    <MapPin className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Project Scope & Timing */}
            <div className="flex flex-col gap-4">
              <label className="text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                3. Approximate Area & Timeline
              </label>

              {/* Scale Pills */}
              <div>
                <span className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Approximate Area / Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SCALES.map((scale) => {
                    const active = form.projectScale === scale.label
                    return (
                      <button
                        key={scale.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, projectScale: scale.label }))}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                          active
                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-xs'
                            : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--secondary)]'
                        }`}
                      >
                        <Maximize2 className="size-3" />
                        <span>{scale.label}</span>
                        <span className={`text-[0.68rem] opacity-75 ${active ? 'text-white' : 'text-[var(--muted-foreground)]'}`}>
                          ({scale.desc})
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Timeline Selector */}
              <div>
                <span className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Preferred Project Timeline:
                </span>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => {
                    const active = form.preferredTimeline === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, preferredTimeline: t }))}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                          active
                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-xs'
                            : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--secondary)]'
                        }`}
                      >
                        <Clock className="size-3" />
                        <span>{t}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Step 4: Project Brief / Requirements */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sv-message" className="text-xs font-semibold text-[var(--foreground)]">
                Project Details & Requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="sv-message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder={currentService.placeholder}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              <p className="text-[0.72rem] text-[var(--muted-foreground)]">
                Include any special considerations such as high wind, full shade, pet-friendly plants, or existing irrigation.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                <CalendarCheck className="size-4 text-[var(--brand-primary)]" />
                <span>Zero obligation &middot; Direct response from senior horticulturists</span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-primary)] px-8 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_12px_30px_-10px_rgba(29,64,32,0.6)] disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Service Enquiry</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
    </div>
  )
}
