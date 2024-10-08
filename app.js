require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); 
const userRoutes = require("./routes/users")
const app = express();
const cors = require('cors');
// Middleware to parse JSON
app.use(express.json());
app.use(cors());

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
app.use('/api/users', userRoutes);
app.get("/", (req, res)=>{
  res.json({message:"Hello From server"})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
