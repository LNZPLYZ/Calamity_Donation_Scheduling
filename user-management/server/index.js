require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Atlas connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Start Express server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
