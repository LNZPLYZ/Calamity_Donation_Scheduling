const mongoose = require('mongoose')
const generateDocumentId = require('../utils/generateDocumentId')

// Describe user profile, contact, role, and account-status fields in MongoDB.
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => generateDocumentId('USR'),
    },
    first_name: { type: String, required: true, trim: true },
    middle_name: { type: String, trim: true },
    last_name: { type: String, required: true, trim: true },
    suffix: { type: String, trim: true },
    birth_date: { type: Date },
    gender: { type: String, trim: true },
    // unique creates a database index so two users cannot share the same email address.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // This field stores a password hash, not a plain-text password.
    password_hash: { type: String, required: true },
    contact_number: { type: String, required: true, trim: true },
    house_number: { type: String, trim: true },
    street: { type: String, trim: true },
    barangay: { type: String, trim: true },
    city_municipality: { type: String, trim: true },
    province: { type: String, trim: true },
    postal_code: { type: String, trim: true },
    role: {
        type: String,
        required: true,
        // Roles identify the intended type of account in the data model.
        enum: ['Administrator', 'Donor', 'Volunteer', 'Receiver'],
    },
    account_status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, {
    // Mongoose maintains created_at and updated_at on user documents.
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

// The donation controller queries this model to confirm an active donor account.
module.exports = mongoose.model('User', userSchema, 'users')
