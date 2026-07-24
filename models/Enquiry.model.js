import mongoose from 'mongoose'

// Allowed lifecycle states for a product enquiry (a sales lead). Kept as a
// frozen list so the API, the admin status dropdown and the datatable badge all
// read from one source and can never drift.
export const enquiryStatus = Object.freeze([
  'new',        // just submitted, not yet actioned
  'contacted',  // admin has reached out to the customer
  'quoted',     // a price/quote has been shared
  'closed',     // resolved — won, lost, or abandoned
])

// A single line on an enquiry. Deliberately price-free: this site is a
// catalogue + enquiry workflow, not a store, so an enquiry captures WHAT and
// HOW MANY the customer wants — the admin quotes the price out-of-band. All
// display fields (name/size/color) are a server-verified snapshot taken at
// submit time so the enquiry stays readable even if the product later changes
// or is deleted.
const enquiryItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, default: '' },
    size: { type: String, trim: true, default: '' },
    color: { type: String, trim: true, default: '' },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const enquirySchema = new mongoose.Schema(
  {
    // Human-readable reference (e.g. MS-A7K3Q2XY) shown to the customer and the
    // admin. Sparse so any legacy document without one can't violate uniqueness.
    ticketId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    // Delivery-ish details are all OPTIONAL — the enquiry model favours low
    // friction; the admin collects exact fulfilment details when following up.
    address: { type: String, trim: true, maxlength: 300, default: '' },
    city: { type: String, trim: true, maxlength: 100, default: '' },
    state: { type: String, trim: true, maxlength: 100, default: '' },
    pincode: { type: String, trim: true, maxlength: 20, default: '' },
    country: { type: String, trim: true, maxlength: 100, default: '' },
    // Free-text note from the customer (requirements, timeline, etc.).
    message: { type: String, trim: true, maxlength: 2000, default: '' },

    products: {
      type: [enquiryItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'An enquiry must contain at least one product.',
      },
    },

    status: {
      type: String,
      enum: enquiryStatus,
      default: 'new',
      index: true,
    },
    // Admin-only internal note (call outcomes, quoted amount, etc.). Never shown
    // to the customer.
    adminNote: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
)

enquirySchema.index({ deletedAt: 1, createdAt: -1 })
enquirySchema.index({ email: 1 })
enquirySchema.index({ status: 1, deletedAt: 1 })

const EnquiryModel =
  mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema, 'enquiries')

export default EnquiryModel
