'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import ViewAction from '@/components/Application/Admin/ViewAction'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { DT_CONTACT_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import {
  ADMIN_CONTACT_DETAILS,
  ADMIN_ENQUIRY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from '@/routes/AdminPanelRoute'
import { useCallback, useMemo } from 'react'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_ENQUIRY_SHOW, label: 'Enquiries' },
  { href: '', label: 'General Enquiry' },
]

const GeneralEnquiryPage = () => {
  const columns = useMemo(() => columnConfig(DT_CONTACT_COLUMN, true), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <ViewAction key="view" href={ADMIN_CONTACT_DETAILS(row.original._id, 'general')} />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="General Enquiry"
        description="Messages submitted through the general contact form, without a specific service selected."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div>
        <DatatableWrapper
          queryKey="contacts-general-data"
          fetchUrl="/api/contact?kind=general"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndpoint="/api/contact/export?kind=general"
          deleteEndpoint="/api/contact/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=contacts`}
          createAction={action}
        />
      </div>
    </div>
  )
}

export default GeneralEnquiryPage
