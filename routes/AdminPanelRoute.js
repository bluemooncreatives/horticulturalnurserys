export const ADMIN_LOGIN = '/admin/login'
export const ADMIN_DASHBOARD = '/admin/dashboard'

// Media routes 
export const ADMIN_MEDIA_SHOW = '/admin/media'
export const ADMIN_MEDIA_EDIT = (id) => id ? `/admin/media/edit/${id}` : ''

// Parent routes

export const ADMIN_PARENT_ADD = '/admin/parent/add'
export const ADMIN_PARENT_SHOW = '/admin/parent'
export const ADMIN_PARENT_EDIT = (id) => id ? `/admin/parent/edit/${id}` : ''

// Category routes

export const ADMIN_CATEGORY_ADD = '/admin/category/add'
export const ADMIN_CATEGORY_SHOW = '/admin/category'
export const ADMIN_CATEGORY_EDIT = (id) => id ? `/admin/category/edit/${id}` : ''

// Product routes 

export const ADMIN_PRODUCT_ADD = '/admin/product/add'
export const ADMIN_PRODUCT_SHOW = '/admin/product'
export const ADMIN_PRODUCT_EDIT = (id) => id ? `/admin/product/edit/${id}` : ''


// Product Variant routes 

export const ADMIN_PRODUCT_VARIANT_ADD = '/admin/product-variant/add'
export const ADMIN_PRODUCT_VARIANT_SHOW = '/admin/product-variant'
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) => id ? `/admin/product-variant/edit/${id}` : ''


// Bestseller route
export const ADMIN_BESTSELLER_SHOW = '/admin/bestseller'

// Freshly Arrived route
export const ADMIN_FRESHLY_ARRIVED_SHOW = '/admin/freshly-arrived'


// Customer route
export const ADMIN_CUSTOMERS_SHOW = '/admin/customers'


// Review route
export const ADMIN_REVIEW_SHOW = '/admin/review'
export const ADMIN_REVIEW_ADD = '/admin/review/add'

// Testimonial route (homepage "Customer Reviews" / "What They Say" section)
export const ADMIN_TESTIMONIAL_SHOW = '/admin/testimonial'

// Enquiry (product enquiry / lead) routes

export const ADMIN_ENQUIRY_SHOW = '/admin/enquiries'
export const ADMIN_ENQUIRY_DETAILS = (id) => id ? `/admin/enquiries/details/${id}` : ''


// Contact Queries routes (mega section: General Enquiry + Service Enquiry)
export const ADMIN_CONTACTS_SHOW = '/admin/contacts'
export const ADMIN_CONTACTS_GENERAL_SHOW = '/admin/contacts/general'
export const ADMIN_CONTACTS_SERVICE_SHOW = '/admin/contacts/service'
export const ADMIN_CONTACT_DETAILS = (id, from) => {
  if (!id) return ''
  return from ? `/admin/contacts/details/${id}?from=${from}` : `/admin/contacts/details/${id}`
}

// Trash route

export const ADMIN_TRASH = '/admin/trash'
