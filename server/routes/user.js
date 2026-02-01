
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/user/me
// @desc    Get current user profile & data
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/user/sync
// @desc    Sync local progress to server
// @access  Private
router.put('/sync', auth, async (req, res) => {
    const { progress, notes } = req.body; // Expecting { "React": {...}, "Spring": {...} }

    try {
        let user = await User.findById(req.user.id);

        if (progress) {
            // Update progress map (merge or overwrite?)
            // For now, let's assume client sends full state for simplicity, or we deep merge.
            // Mongoose Map update:
            for (const [tech, data] of Object.entries(progress)) {
                user.progress.set(tech, data);
            }
        }

        if (notes) {
            // Replace notes or append? Let's generic replace for now for full sync
            user.notes = notes;
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
