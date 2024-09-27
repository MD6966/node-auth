const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function for sending error responses
const sendError = (res, message) => {
  return res.status(400).json({ msg: message });
};

router.post('/signup', async (req, res) => {
  const { name, address, email, password } = req.body;

  // Check for missing fields
  if (!name || !address || !email || !password) {
    return sendError(res, 'All fields (name, address, email, password) are required');
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return sendError(res, 'User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      address,
      email,
      password: hashedPassword
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h'
    });

    res.status(201).json({ token, message: 'User Created Successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return sendError(res, 'Email and password are required');
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
