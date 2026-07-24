import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    // Optional now: customer accounts have been removed, so reviews are
    // admin-managed. Legacy reviews still reference a real User; new
    // admin-authored reviews carry an `authorName` instead.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },

    // Display name for admin-authored reviews (used when there is no linked user).
    authorName: {
        type: String,
        trim: true,
        default: '',
    },

    rating: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },

    deletedAt: {
        type: Date,
        default: null,
        index: true
    },

}, { timestamps: true })

reviewSchema.index({ product: 1, deletedAt: 1 })
reviewSchema.index({ user: 1, product: 1, deletedAt: 1 })

const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema, 'reviews')
export default ReviewModel
