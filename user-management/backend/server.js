require('dotenv').config()

const express = require('express')
const donationRoute = require('./routes/donationRoute')
const authRoute = require('./routes/authRoute')
const mongoose = require('mongoose')

// Start the Express application that receives requests from the React frontend.
const app = express()

// Parse JSON request bodies so controllers can read submitted data from req.body.
app.use(express.json())

// Log the method and path of each incoming request while the server is running.
app.use((req,res,next)=>{   
 console.log(req.path, req.method)
next()
})

// Send donation-related URLs to the router; its paths are relative to /api/donations.
app.use('/api/donations', donationRoute)

// Mount the sign-in endpoint separately from donation operations.
app.use('/api/auth', authRoute)

// Convert errors passed by controllers into a JSON response in one place.
app.use((error, req, res, next) => {
    console.error(error)
    res.status(error.statusCode || 500).json({
        error: error.statusCode ? error.message : 'An unexpected server error occurred',
    })
})

// Connect to MongoDB before accepting requests, so handlers can use Mongoose models.
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
    // PORT is read from the backend environment configuration.
    app.listen(process.env.PORT, () => {
        console.log('connected to database & listening on port', process.env.PORT )
})

})
// Report connection failures; the server does not start when the database is unavailable.
    .catch((error) => {
        console.log(error)
})
