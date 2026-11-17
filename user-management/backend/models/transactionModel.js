const mongoose = require('mongoose')
const generateDocumentId = require('../utils/generateDocumentId')

// Describe activity related to donations, such as pickup or collection history.
const transactionSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => generateDocumentId('TRX'),
    },
    donation_id: { type: String, required: true, ref: 'Donation', index: true },
    user_id: { type: String, required: true, ref: 'User', index: true },
    transaction_type: {
        type: String,
        required: true,
        // Limit transaction types to the stages defined by this project's data model.
        enum: ['Pickup', 'Collection', 'Receiving', 'Distribution'],
    },
    transaction_status: {
        type: String,
        required: true,
        // The schema supports these statuses, although no transaction API route is present yet.
        enum: ['Pending', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    destination_house_number: { type: String, trim: true },
    destination_street: { type: String, trim: true },
    destination_barangay: { type: String, trim: true },
    destination_city_municipality: { type: String, trim: true },
    destination_province: { type: String, trim: true },
    destination_postal_code: { type: String, trim: true },
    requested_date: { type: Date },
    scheduled_date: { type: Date },
    transaction_date: { type: Date },
    remarks: { type: String, trim: true },
}, {
    // Use the transactions collection and record both creation and update times.
    collection: 'transactions',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

// The donation controller checks this model to protect donations with recorded history.
module.exports = mongoose.model('Transaction', transactionSchema, 'transactions')
