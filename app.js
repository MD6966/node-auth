require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import your authentication routes

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    }
  };

connectDB();

app.use('/api/auth', authRoutes);
app.get("/", (req, res)=>{
  res.json({message:"Hello From server"})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
