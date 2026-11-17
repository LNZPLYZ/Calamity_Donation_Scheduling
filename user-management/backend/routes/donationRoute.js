const express = require('express')
const {
    getDonations,
    getDonation,
    createDonation,
    deleteDonation,
    updateDonation,
} = require('../controllers/donationController')


// Keep URL-to-handler mapping separate from the business and database logic.
const router = express.Router()

// The server mounts this router at /api/donations, so this serves GET /api/donations.
router.get('/', getDonations)

// The :id path parameter identifies one donation document.
router.get('/:id', getDonation)

// Accept a donation and its item list in a JSON request body.
router.post('/', createDonation)

// Deletion is rejected by the controller when transaction history exists.
router.delete('/:id', deleteDonation)

// Apply allowed donation fields from a JSON request body.
router.patch('/:id', updateDonation)









module.exports = router