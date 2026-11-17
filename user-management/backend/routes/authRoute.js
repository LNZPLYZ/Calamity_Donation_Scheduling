const express = require('express')
const { 
    login,
    signup 
} = require('../controllers/authController')

// Keep authentication URLs separate from donation management URLs.
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

module.exports = router
