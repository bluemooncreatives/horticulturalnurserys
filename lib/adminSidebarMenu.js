import {
  LayoutDashboard,
  Layers3,

  Shirt,
  ClipboardList,
  ImageIcon,
  Star,
  Crown,
  Sparkles,
  MessageSquare,
  Quote,
} from 'lucide-react'
import {
  ADMIN_BESTSELLER_SHOW,
  ADMIN_FRESHLY_ARRIVED_SHOW,
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_CONTACTS_SHOW,
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
    title: 'Navigation',
    items: [
      {
        title: 'Dashboard',
        url: ADMIN_DASHBOARD,
        icon: LayoutDashboard,
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
        icon: Shirt,
        submenu: [
          {
            title: 'Add Product',
            url: ADMIN_PRODUCT_ADD,
            icon: Shirt,
          },
          {
            title: 'Add Variant',
            url: ADMIN_PRODUCT_VARIANT_ADD,
            icon: Shirt,
          },
          {
            title: 'All Products',
            url: ADMIN_PRODUCT_SHOW,
            icon: Shirt,
          },
          {
            title: 'Product Variants',
            url: ADMIN_PRODUCT_VARIANT_SHOW,
            icon: Shirt,
          },
        ],
      },

      {
        title: 'Enquiries',
        url: ADMIN_ENQUIRY_SHOW,
        icon: ClipboardList,
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
      {
        title: 'Contact Queries',
        url: ADMIN_CONTACTS_SHOW,
        icon: MessageSquare,
      },
    ],
  },
]
