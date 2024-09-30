require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import your authentication routes
const serverless = require('serverless-http'); // Import serverless-http

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

connectDB();

// Define routes
app.use('/api/auth', authRoutes);

// Export the handler for Vercel
module.exports.handler = serverless(app);
