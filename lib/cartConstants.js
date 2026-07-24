// Single source of truth for enquiry-list quantity limits. Used by the cart
// (enquiry list) reducer, the product detail buy-box, the enquiry-list stepper
// AND the server-side enquiry validation so the UI cap and the backend guard can
// never drift apart. This is a catalogue + enquiry site (not a store), and
// customers routinely request bulk quantities of a plant, so the cap is high.
export const MAX_CART_QTY = 999
export const MIN_CART_QTY = 1
