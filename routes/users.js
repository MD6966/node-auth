const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/getAll', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Excluding password from the results
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password'); // Excluding password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});

// router.post('/', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const newUser = new User({
//             name,
//             email,
//             password,
//         });

//         const user = await newUser.save();
//         res.status(201).json(user);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server error');
//     }
// });

router.put('/:id', async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email;
        if (address) userFields.address = address;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'User deleted' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
