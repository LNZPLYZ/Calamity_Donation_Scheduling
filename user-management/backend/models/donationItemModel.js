const mongoose = require('mongoose')
const generateDocumentId = require('../utils/generateDocumentId')

// Store each donated item separately so one donation can contain multiple items.
const donationItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => generateDocumentId('DIT'),
    },
    donation_id: {
        type: String,
        required: true,
        // This reference links the item back to the parent donation.
        ref: 'Donation',
        index: true,
    },
    item_name: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        // Restrict item categories to the options used by the donation form.
        enum: ['Food', 'Clothing', 'Medicine', 'Hygiene', 'Other'],
    },
    // The minimum prevents zero or negative quantities from being saved.
    quantity: { type: Number, required: true, min: 0.000001 },
    unit: { type: String, trim: true },
    item_condition: { type: String, trim: true },
}, {
    // created_at is recorded, but item documents do not need an updated_at field.
    collection: 'donation_items',
    timestamps: { createdAt: 'created_at', updatedAt: false },
})

// Export the model that reads and writes the donation_items collection.
module.exports = mongoose.model('DonationItem', donationItemSchema, 'donation_items')
