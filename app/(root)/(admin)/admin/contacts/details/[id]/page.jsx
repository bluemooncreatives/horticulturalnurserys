'use client'
import { use, useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ADMIN_CONTACTS_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { Mail, User, MessageSquare, Calendar, Tag, Phone, MapPin, SearchX, ArrowLeft } from 'lucide-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { statusChipStyle } from '@/lib/adminStatus'
import { FormSkeleton } from '@/components/Application/Admin/Loaders'
import EmptyState from '@/components/Application/Admin/EmptyState'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CONTACTS_SHOW, label: 'Contact Queries' },
  { href: '', label: 'View Message' },
]

const ContactDetail = ({ params }) => {
  const { id } = use(params)
  const [contact, setContact] = useState(null)
  const { data, loading } = useFetch(`/api/contact/get/${id}`)

  useEffect(() => {
    if (data?.success) {
      setContact(data.data)
    }
  }, [data])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="View Message"
        description="Full details of this contact query submission."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
        actions={
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href={ADMIN_CONTACTS_SHOW} className="inline-flex items-center gap-1.5">
              <ArrowLeft className="size-4" />
              Back to Messages
            </Link>
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-xs">
        {loading && (
          <div className="p-5 sm:p-6">
            <FormSkeleton fields={4} />
          </div>
        )}

        {!loading && !contact && (
          <EmptyState
            icon={SearchX}
            title="Message not found"
            description="This contact query may have been deleted or moved to the recycle bin."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href={ADMIN_CONTACTS_SHOW}>Back to contact queries</Link>
              </Button>
            }
          />
        )}

        {contact && (
          <div className="p-6 max-w-3xl">

            {/* Status + date row */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-border/70">
              <div className="flex items-center gap-3">
                {contact.ticketId && (
                  <span className="font-mono text-sm font-semibold tracking-wide bg-muted/60 border border-border/70 px-2.5 py-1 rounded-md">
                    {contact.ticketId}
                  </span>
                )}
                {/* Same token pair the enquiry statuses use, so "Read" here
                    and "Closed" there are the same green. */}
                <Badge
                  variant="status"
                  style={statusChipStyle(contact.isRead ? 'closed' : 'new')}
                  className="capitalize"
                >
                  {contact.isRead ? 'Read' : 'New'}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{dayjs(contact.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">From</p>
                  <p className="font-semibold text-sm text-foreground truncate">{contact.name}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-medium text-primary hover:underline truncate block"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Mobile</p>
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm font-medium text-primary hover:underline truncate block"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <p className="font-medium text-sm text-muted-foreground italic">Not provided</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Address</p>
                  <p className="font-medium text-sm text-foreground">{contact.address || <span className="text-muted-foreground italic">Not provided</span>}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex gap-3.5 items-start transition-colors hover:border-primary/30 sm:col-span-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Tag className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Subject</p>
                  <p className="font-semibold text-sm text-foreground">{contact.subject || <span className="text-muted-foreground italic">No subject</span>}</p>
                </div>
              </div>
            </div>

            {/* Message body */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-5 mb-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <MessageSquare className="size-3.5" />
                </span>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Message</p>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{contact.message}</p>
            </div>

            {/* Reply CTA */}
            <Button asChild className="cursor-pointer">
              <a href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}`}>
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

export default ContactDetail
