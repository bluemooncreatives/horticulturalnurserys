'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import ViewAction from '@/components/Application/Admin/ViewAction'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { DT_CONTACT_SERVICE_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import {
  ADMIN_CONTACT_DETAILS,
  ADMIN_CONTACTS_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from '@/routes/AdminPanelRoute'
import { useCallback, useMemo } from 'react'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CONTACTS_SHOW, label: 'Contact Queries' },
  { href: '', label: 'Service Enquiry' },
]

const ServiceEnquiryPage = () => {
  const columns = useMemo(() => columnConfig(DT_CONTACT_SERVICE_COLUMN, true), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <ViewAction key="view" href={ADMIN_CONTACT_DETAILS(row.original._id, 'service')} />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Service Enquiry"
        description="Leads submitted against one of the 4 services: Landscape Development, Garden Maintenance & Aftercare, Roof Garden Design, and Vertical Garden Systems."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div>
        <DatatableWrapper
          queryKey="contacts-service-data"
          fetchUrl="/api/contact?kind=service"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndpoint="/api/contact/export?kind=service"
          deleteEndpoint="/api/contact/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=contacts`}
          createAction={action}
        />
      </div>
    </div>
  )
}

export default ServiceEnquiryPage
