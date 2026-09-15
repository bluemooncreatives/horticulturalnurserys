import {
  LayoutDashboard,
  Layers3,
  FolderTree,

  Sprout,
  Package,
  Inbox,
  ClipboardList,
  ImageIcon,
  Star,
  Crown,
  Sparkles,
  MessageCircleQuestion,
  Handshake,
  Quote,
} from 'lucide-react'
import {
  ADMIN_BESTSELLER_SHOW,
  ADMIN_FRESHLY_ARRIVED_SHOW,
  ADMIN_PARENT_ADD,
  ADMIN_PARENT_SHOW,
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_CONTACTS_GENERAL_SHOW,
  ADMIN_CONTACTS_SERVICE_SHOW,
  ADMIN_ENQUIRY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_SHOW,

  ADMIN_REVIEW_SHOW,
  ADMIN_TESTIMONIAL_SHOW,
} from '@/routes/AdminPanelRoute'

export const adminNavGroups = [
  {
    items: [
      {
        title: 'Dashboard',
        url: ADMIN_DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: 'Parent',
        url: ADMIN_PARENT_SHOW,
        icon: FolderTree,
        submenu: [
          {
            title: 'Add Parent',
            url: ADMIN_PARENT_ADD,
            icon: FolderTree,
          },
          {
            title: 'All Parent',
            url: ADMIN_PARENT_SHOW,
            icon: FolderTree,
          },
        ],
      },
      {
        title: 'Category',
        url: ADMIN_CATEGORY_SHOW,
        icon: Layers3,
        submenu: [
          {
            title: 'Add Category',
            url: ADMIN_CATEGORY_ADD,
            icon: Layers3,
          },
          {
            title: 'All Category',
            url: ADMIN_CATEGORY_SHOW,
            icon: Layers3,
          },
        ],
      },
      {
        title: 'Products',
        url: ADMIN_PRODUCT_SHOW,
        icon: Sprout,
        submenu: [
          {
            title: 'Add Product',
            url: ADMIN_PRODUCT_ADD,
            icon: Sprout,
          },
          {
            title: 'Add Variant',
            url: ADMIN_PRODUCT_VARIANT_ADD,
            icon: Package,
          },
          {
            title: 'All Products',
            url: ADMIN_PRODUCT_SHOW,
            icon: Sprout,
          },
          {
            title: 'Product Variants',
            url: ADMIN_PRODUCT_VARIANT_SHOW,
            icon: Package,
          },
        ],
      },

      {
        title: 'Enquiries',
        url: ADMIN_ENQUIRY_SHOW,
        icon: Inbox,
        submenu: [
          {
            title: 'Product Enquiries',
            url: ADMIN_ENQUIRY_SHOW,
            icon: ClipboardList,
          },
          {
            title: 'General Enquiry',
            url: ADMIN_CONTACTS_GENERAL_SHOW,
            icon: MessageCircleQuestion,
          },
          {
            title: 'Service Enquiry',
            url: ADMIN_CONTACTS_SERVICE_SHOW,
            icon: Handshake,
          },
        ],
      },
      {
        title: 'Bestsellers',
        url: ADMIN_BESTSELLER_SHOW,
        icon: Crown,
      },
      {
        title: 'Freshly Arrived',
        url: ADMIN_FRESHLY_ARRIVED_SHOW,
        icon: Sparkles,
      },

      {
        title: 'Rating & Review',
        url: ADMIN_REVIEW_SHOW,
        icon: Star,
      },
      {
        title: 'Testimonials',
        url: ADMIN_TESTIMONIAL_SHOW,
        icon: Quote,
      },
      {
        title: 'Media',
        url: ADMIN_MEDIA_SHOW,
        icon: ImageIcon,
      },
    ],
  },
]
