const mongoose = require('mongoose')
const generateDocumentId = require('../utils/generateDocumentId')

// Define the allowed fields, defaults, and validation rules for a donation document.
const donationSchema = new mongoose.Schema({
    _id: {
        // Give each donation an application-readable ID such as DON<year><UUID>.
        type: String,
        default: () => generateDocumentId('DON'),
    },
    // ref names let Mongoose populate related donor and calamity documents.
    donor_id: { type: String, required: true, ref: 'User', index: true },
    calamity_id: { type: String, ref: 'Calamity', default: null, index: true },
    pickup_house_number: { type: String, trim: true },
    pickup_street: { type: String, trim: true },
    pickup_barangay: { type: String, trim: true },
    pickup_city_municipality: { type: String, trim: true },
    pickup_province: { type: String, trim: true },
    pickup_postal_code: { type: String, trim: true },
    donation_date: { type: Date, default: Date.now },
    donation_status: {
        type: String,
        required: true,
        // Mongoose rejects statuses outside this list when validating writes.
        enum: ['Pending', 'Pickup Requested', 'Collected', 'Received', 'Cancelled'],
        default: 'Pending',
    },
    remarks: { type: String, trim: true },
}, {
    // Keep the MongoDB collection name and timestamp field names consistent with the data model.
    collection: 'donations',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

// Export the model used by the controller to query and update the donations collection.
module.exports = mongoose.model('Donation', donationSchema, 'donations')
