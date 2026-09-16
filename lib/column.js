import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import userIcon from '@/public/assets/images/user.png'
export const DT_PARENT_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Parent Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
]

export const DT_CATEGORY_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Category Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'parent',
        header: 'Parent',
    },
]

export const DT_PRODUCT_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Product Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },

]


export const DT_PRODUCT_VARIANT_COLUMN = [
    {
        accessorKey: 'product',
        header: 'Product Name',
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'size',
        header: 'Size',
        // Size is optional; an empty cell reads as missing data rather than
        // "this product deliberately has no size".
        cell: ({ row }) => row.original.size || <span className="text-muted-foreground">-</span>,
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },


]


export const DT_CUSTOMERS_COLUMN = [
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        Cell: ({ renderedCellValue }) => (
            <Avatar>
                <AvatarImage src={renderedCellValue?.url || userIcon.src} />
            </Avatar>
        )
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'isEmailVerified',
        header: 'Is Verified',
        Cell: ({ renderedCellValue }) => (
            renderedCellValue
                ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">Verified</Badge>
                : <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">Not Verified</Badge>
        )
    },


]

export const DT_REVIEW_COLUMN = [

    {
        accessorKey: 'product',
        header: 'Product',
    },

    {
        accessorKey: 'user',
        header: 'Reviewer',
    },

    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
    },
    {
        accessorKey: 'review',
        header: 'Review',
    },
]

export const DT_CONTACT_COLUMN = [
  {
    accessorKey: 'ticketId',
    header: 'Query ID',
    Cell: ({ renderedCellValue }) => (
      <span className="font-medium whitespace-nowrap">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Mobile',
    Cell: ({ renderedCellValue }) => <span>{renderedCellValue || '-'}</span>,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    Cell: ({ renderedCellValue }) => (
      <span className="max-w-[200px] truncate block text-muted-foreground">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    Cell: ({ renderedCellValue }) => (
      <span className="max-w-[200px] truncate block">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'message',
    header: 'Message',
    Cell: ({ renderedCellValue }) => (
      <span className="max-w-[260px] truncate block text-muted-foreground">
        {renderedCellValue?.length > 80 ? renderedCellValue.slice(0, 80) + '…' : renderedCellValue}
      </span>
    ),
  },
  {
    accessorKey: 'isRead',
    header: 'Status',
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">Read</Badge>
      ) : (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">New</Badge>
      ),
  },
]

export const DT_CONTACT_SERVICE_COLUMN = [
  {
    accessorKey: 'ticketId',
    header: 'Query ID',
    Cell: ({ renderedCellValue }) => (
      <span className="font-medium whitespace-nowrap">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Mobile',
    Cell: ({ renderedCellValue }) => <span>{renderedCellValue || '-'}</span>,
  },
  {
    accessorKey: 'serviceType',
    header: 'Service',
    Cell: ({ renderedCellValue }) => (
      <span className="max-w-[180px] truncate block font-medium">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'projectScale',
    header: 'Scale',
    Cell: ({ renderedCellValue }) => <span>{renderedCellValue || '-'}</span>,
  },
  {
    accessorKey: 'preferredTimeline',
    header: 'Timeline',
    Cell: ({ renderedCellValue }) => (
      <span className="max-w-[160px] truncate block text-muted-foreground">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'isRead',
    header: 'Status',
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">Read</Badge>
      ) : (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">New</Badge>
      ),
  },
]

export const DT_ENQUIRY_COLUMN = [
  {
    accessorKey: 'ticketId',
    header: 'Enquiry ID',
    Cell: ({ renderedCellValue }) => (
      <span className="font-medium whitespace-nowrap">{renderedCellValue || '-'}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Mobile',
    Cell: ({ renderedCellValue }) => <span>{renderedCellValue || '-'}</span>,
  },
  {
    accessorKey: 'totalItem',
    header: 'Items',
    Cell: ({ row }) => <span>{row?.original?.totalItem ?? row?.original?.products?.length ?? 0}</span>,
  },
  {
    accessorKey: 'city',
    header: 'City',
    Cell: ({ renderedCellValue }) => <span>{renderedCellValue || '-'}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ renderedCellValue }) => {
      const map = {
        new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        quoted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      }
      const cls = map[renderedCellValue] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      return <Badge className={`${cls} capitalize hover:${cls}`}>{renderedCellValue || 'new'}</Badge>
    },
  },
  {
    accessorKey: 'isRead',
    header: 'Read',
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">Read</Badge>
      ) : (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">New</Badge>
      ),
  },
]
