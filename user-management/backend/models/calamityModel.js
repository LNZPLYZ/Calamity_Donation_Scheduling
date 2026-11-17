const mongoose = require('mongoose')
const generateDocumentId = require('../utils/generateDocumentId')

// Describe calamities that donations may optionally be associated with.
const calamitySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => generateDocumentId('CAL'),
    },
    calamity_name: { type: String, required: true, trim: true },
    calamity_type: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    province: { type: String, trim: true },
    city_municipality: { type: String, trim: true },
    barangay: { type: String, trim: true },
    street: { type: String, trim: true },
    specific_address: { type: String, trim: true },
    start_date: { type: Date },
    status: {
        type: String,
        required: true,
        // These values describe the supported lifecycle states in this schema.
        enum: ['Active', 'Monitoring', 'Resolved'],
        default: 'Active',
    },
}, {
    // Store these documents in the calamities collection with created/updated timestamps.
    collection: 'calamities',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

// This model is currently used by donation validation and response population.
module.exports = mongoose.model('Calamity', calamitySchema, 'calamities')
