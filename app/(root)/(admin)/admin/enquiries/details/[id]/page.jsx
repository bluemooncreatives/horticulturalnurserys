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
import { Mail, User, Calendar, Phone, MapPin, Package, StickyNote, SearchX } from 'lucide-react'
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
  const [status, setStatus] = useState('new')
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)
  const { data, loading } = useFetch(`/api/enquiry/get/${id}`)

  useEffect(() => {
    if (data?.success) {
      setEnquiry(data.data)
      setStatus(data.data.status || 'new')
      setAdminNote(data.data.adminNote || '')
    }
  }, [data])

  const saveChanges = async () => {
    setSaving(true)
    try {
      const { data: res } = await axios.put('/api/enquiry/update-status', { id, status, adminNote })
      if (!res.success) throw new Error(res.message)
      setEnquiry(res.data)
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

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="View Enquiry"
        description="Full details of this product enquiry."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                {enquiry.ticketId && (
                  <span className="font-mono text-sm font-semibold tracking-wide">{enquiry.ticketId}</span>
                )}
                <Badge variant="status" style={statusChipStyle(enquiry.status)} className="capitalize">
                  {enquiry.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{dayjs(enquiry.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
              </div>
            </div>

            {/* Contact grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border p-4 flex gap-3">
                <User className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">From</p>
                  <p className="font-medium text-sm">{enquiry.name}</p>
                </div>
              </div>
              <div className="rounded-lg border p-4 flex gap-3">
                <Mail className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">Email</p>
                  <a href={`mailto:${enquiry.email}`} className="text-sm font-medium text-primary hover:underline">{enquiry.email}</a>
                </div>
              </div>
              <div className="rounded-lg border p-4 flex gap-3">
                <Phone className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">Mobile</p>
                  <a href={`tel:${enquiry.phone}`} className="text-sm font-medium text-primary hover:underline">{enquiry.phone}</a>
                </div>
              </div>
              <div className="rounded-lg border p-4 flex gap-3">
                <MapPin className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">Location</p>
                  <p className="font-medium text-sm">{locationParts.length ? locationParts.join(', ') : <span className="text-muted-foreground italic">Not provided</span>}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="rounded-lg border p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="size-4 text-muted-foreground" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Products requested ({enquiry.products?.length || 0})
                </p>
              </div>
              <div className="divide-y">
                {enquiry.products?.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      {(p.size || p.color) && (
                        <p className="text-xs text-muted-foreground">{[p.size, p.color].filter(Boolean).join(' / ')}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0 tabular-nums">Qty {p.qty}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer note */}
            {enquiry.message && (
              <div className="rounded-lg border p-5 mb-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Customer note</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
              </div>
            )}

            {/* Manage: status + internal note */}
            <div className="rounded-lg border p-5 mb-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-4">
                <StickyNote className="size-4 text-muted-foreground" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Manage enquiry</p>
              </div>

              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() => setStatus(s)}
                    style={status === s ? statusRingStyle(s) : undefined}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      status === s
                        ? ''
                        : 'border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Internal note (not shown to customer)</label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a private note - quoted amount, call outcome, follow-up date…"
                className="min-h-[90px]"
                maxLength={2000}
              />

              <div className="mt-4">
                <Button onClick={saveChanges} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </div>

            {/* Reply CTA */}
            <Button asChild variant="outline">
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
