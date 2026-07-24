'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import ViewAction from '@/components/Application/Admin/ViewAction'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { DT_ENQUIRY_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import {
  ADMIN_ENQUIRY_DETAILS,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from '@/routes/AdminPanelRoute'
import { useCallback, useMemo } from 'react'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Enquiries' },
]

const EnquiriesPage = () => {
  const columns = useMemo(() => columnConfig(DT_ENQUIRY_COLUMN, true), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <ViewAction key="view" href={ADMIN_ENQUIRY_DETAILS(row.original._id)} />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Enquiries"
        description="Product enquiries submitted from the catalogue."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div className="rounded-md bg-card">
        <DatatableWrapper
          queryKey="enquiries-data"
          fetchUrl="/api/enquiry"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndpoint="/api/enquiry/export"
          deleteEndpoint="/api/enquiry/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=enquiries`}
          createAction={action}
        />
      </div>
    </div>
  )
}

export default EnquiriesPage
