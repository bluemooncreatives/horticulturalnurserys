'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import useFetch from '@/hooks/useFetch'
import {
  ADMIN_CONTACTS_GENERAL_SHOW,
  ADMIN_CONTACTS_SERVICE_SHOW,
  ADMIN_DASHBOARD,
} from '@/routes/AdminPanelRoute'
import { ArrowRight, Handshake, MessageCircleQuestion } from 'lucide-react'
import Link from 'next/link'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Contact Queries' },
]

const StatCard = ({ href, icon: Icon, title, description, count, loading, accent }) => (
  <Link
    href={href}
    className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md sm:p-6"
  >
    <div className="flex items-start justify-between">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="size-5" />
      </span>
      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>

    <div className="mt-5">
      <p className="text-2xl font-semibold text-foreground">
        {loading ? '—' : count ?? 0}
      </p>
      <h3 className="mt-1 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </Link>
)

const ContactsOverviewPage = () => {
  const { data: generalData, loading: generalLoading } = useFetch(
    '/api/contact?kind=general&size=1&start=0&deleteType=SD'
  )
  const { data: serviceData, loading: serviceLoading } = useFetch(
    '/api/contact?kind=service&size=1&start=0&deleteType=SD'
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Contact Queries"
        description="All leads submitted through the website — general contact messages and service-specific enquiries."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          href={ADMIN_CONTACTS_GENERAL_SHOW}
          icon={MessageCircleQuestion}
          title="General Enquiry"
          description="Messages submitted through the general contact form, without a specific service selected."
          count={generalData?.meta?.totalRowCount}
          loading={generalLoading}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          href={ADMIN_CONTACTS_SERVICE_SHOW}
          icon={Handshake}
          title="Service Enquiry"
          description="Leads for Landscape Development, Garden Maintenance & Aftercare, Roof Garden Design, and Vertical Garden Systems."
          count={serviceData?.meta?.totalRowCount}
          loading={serviceLoading}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  )
}

export default ContactsOverviewPage
