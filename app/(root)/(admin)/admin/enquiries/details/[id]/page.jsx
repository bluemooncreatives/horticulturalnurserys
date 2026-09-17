'use client'
import { use, useEffect, useState } from 'react'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { showToast } from '@/lib/showToast'
import { ADMIN_ENQUIRY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import { Mail, User, Calendar, Phone, MapPin, Package, StickyNote, SearchX, ArrowLeft, Minus, Plus } from 'lucide-react'
import dayjs from 'dayjs'
import { ENQUIRY_STATUSES, statusChipStyle, statusRingStyle } from '@/lib/adminStatus'
import { FormSkeleton } from '@/components/Application/Admin/Loaders'
import EmptyState from '@/components/Application/Admin/EmptyState'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_ENQUIRY_SHOW, label: 'Enquiries' },
  { href: '', label: 'View Enquiry' },
]

// Status colours live in lib/adminStatus so this page, the dashboard widget
// and the contacts screen cannot drift apart again.
const STATUS_OPTIONS = ENQUIRY_STATUSES

const EnquiryDetail = ({ params }) => {
  const { id } = use(params)
  const [enquiry, setEnquiry] = useState(null)
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('new')
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)
  const { data, loading } = useFetch(`/api/enquiry/get/${id}`)

  useEffect(() => {
    if (data?.success) {
      setEnquiry(data.data)
      setProducts(data.data.products || [])
      setStatus(data.data.status || 'new')
      setAdminNote(data.data.adminNote || '')
    }
  }, [data])

  const updateProductQty = (index, delta) => {
    setProducts((prev) => {
      const next = [...prev]
      const current = Number(next[index]?.qty) || 1
      const newQty = Math.min(999, Math.max(1, current + delta))
      next[index] = { ...next[index], qty: newQty }
      return next
    })
  }

  const setProductQtyDirect = (index, val) => {
    const n = parseInt(val, 10)
    setProducts((prev) => {
      const next = [...prev]
      const newQty = isNaN(n) ? 1 : Math.min(999, Math.max(1, n))
      next[index] = { ...next[index], qty: newQty }
      return next
    })
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      const { data: res } = await axios.put('/api/enquiry/update-status', {
        id,
        status,
        adminNote,
        products,
      })
      if (!res.success) throw new Error(res.message)
      setEnquiry(res.data)
      setProducts(res.data.products || [])
      showToast('success', 'Enquiry updated.')
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  const locationParts = enquiry
    ? [enquiry.address, enquiry.city, enquiry.state, enquiry.pincode, enquiry.country].filter(Boolean)
    : []

  const totalUnits = products.reduce((sum, p) => sum + (Number(p.qty) || 0), 0)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="View Enquiry"
        description="Full details of this customer product enquiry."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
        actions={
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href={ADMIN_ENQUIRY_SHOW} className="inline-flex items-center gap-1.5">
              <ArrowLeft className="size-4" />
              Back to Enquiries
            </Link>
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-xs">
        {loading && (
          <div className="p-5 sm:p-6">
            <FormSkeleton fields={5} />
          </div>
        )}

        {!loading && !enquiry && (
          <EmptyState
            icon={SearchX}
            title="Enquiry not found"
            description="This enquiry may have been deleted or moved to the recycle bin."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href={ADMIN_ENQUIRY_SHOW}>Back to enquiries</Link>
              </Button>
            }
          />
        )}

        {enquiry && (
          <div className="p-6 max-w-4xl">

            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-border/70">
              <div className="flex items-center gap-3">
                {enquiry.ticketId && (
                  <span className="font-mono text-sm font-semibold bg-muted/60 border border-border/70 px-2.5 py-1 rounded-md">
                    {enquiry.ticketId}
                  </span>
                )}
                <Badge variant="status" style={statusChipStyle(enquiry.status)} className="capitalize">
                  {enquiry.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{dayjs(enquiry.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
              </div>
            </div>

            {/* Contact grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase text-muted-foreground font-medium mb-0.5">From</p>
                  <p className="font-semibold text-sm text-foreground truncate">{enquiry.name}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase text-muted-foreground font-medium mb-0.5">Email</p>
                  <a href={`mailto:${enquiry.email}`} className="text-sm font-medium text-primary hover:underline truncate block">
                    {enquiry.email}
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase text-muted-foreground font-medium mb-0.5">Mobile</p>
                  <a href={`tel:${enquiry.phone}`} className="text-sm font-medium text-primary hover:underline truncate block">
                    {enquiry.phone}
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase text-muted-foreground font-medium mb-0.5">Location</p>
                  <p className="font-medium text-sm text-foreground">
                    {locationParts.length ? locationParts.join(', ') : <span className="text-muted-foreground italic">Not provided</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="rounded-xl border border-border/80 bg-card p-5 mb-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Package className="size-3.5" />
                  </span>
                  <p className="text-xs uppercase font-medium text-muted-foreground">
                    Products requested ({products.length} {products.length === 1 ? 'item' : 'items'} · {totalUnits} {totalUnits === 1 ? 'unit' : 'units'})
                  </p>
                </div>
              </div>
              <div className="divide-y divide-border/60">
                {products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                      {(p.size || p.color) && (
                        <p className="text-xs text-muted-foreground mt-0.5">{[p.size, p.color].filter(Boolean).join(' / ')}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground font-medium mr-1">Qty:</span>
                      <div className="inline-flex h-8 items-center rounded-lg border border-border/80 bg-background shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={p.qty <= 1}
                          onClick={() => updateProductQty(i, -1)}
                          className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={p.qty}
                          onChange={(e) => setProductQtyDirect(i, e.target.value)}
                          className="w-12 border-none bg-transparent text-center text-xs font-semibold tabular-nums focus:outline-hidden"
                        />
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={p.qty >= 999}
                          onClick={() => updateProductQty(i, 1)}
                          className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer note */}
            {enquiry.message && (
              <div className="rounded-xl border border-border/80 bg-muted/20 p-5 mb-6 shadow-2xs">
                <p className="text-xs uppercase font-medium text-muted-foreground mb-2">Customer note</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{enquiry.message}</p>
              </div>
            )}

            {/* Manage: status + internal note */}
            <div className="rounded-xl border border-border bg-card p-5 mb-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <StickyNote className="size-3.5" />
                </span>
                <p className="text-xs uppercase font-medium text-muted-foreground">Manage enquiry</p>
              </div>

              <label className="block text-xs font-medium text-muted-foreground mb-2">Status</label>
              <div className="flex flex-wrap gap-2 mb-5">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() => setStatus(s)}
                    style={status === s ? statusRingStyle(s) : undefined}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                      status === s
                        ? 'shadow-xs'
                        : 'border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-medium text-muted-foreground mb-2">Internal note (not shown to customer)</label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a private note - quoted amount, call outcome, follow-up date…"
                className="min-h-[100px] mb-4"
                maxLength={2000}
              />

              <div>
                <Button onClick={saveChanges} disabled={saving} className="cursor-pointer">
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </div>

            {/* Reply CTA */}
            <Button asChild variant="outline" className="cursor-pointer">
              <a href={`mailto:${enquiry.email}?subject=Re: Your enquiry ${enquiry.ticketId || ''}`}>
                <Mail className="size-4 mr-2" />
                Reply via Email
              </a>
            </Button>

          </div>
        )}
      </div>
    </div>
  )
}

export default EnquiryDetail
