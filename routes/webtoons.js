const express = require('express');
const Webtoon = require('../models/Webtoon');
const User = require('../models/User');
const router = express.Router();

// Get all webtoons route
router.get('/', async (req, res) => {
    try {
        const webtoons = await Webtoon.find();
        res.json(webtoons);
    } catch (error) {
        res.status(500).send('Error fetching webtoons');
    }
});

// Get a specific webtoon by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const webtoon = await Webtoon.findById(id);
        if (!webtoon) {
            return res.status(404).send('Webtoon not found');
        }
        res.json(webtoon);
    } catch (error) {
        res.status(500).send('Error fetching webtoon');
    }
});



// Add to favorites route
router.post('/favorites/:webtoonId', async (req, res) => {
    const { userId } = req.body;
    const { webtoonId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        // Check if already in favorites
        if (user.favorites.includes(webtoonId)) {
            return res.status(400).send('Webtoon is already in favorites');
        }

        user.favorites.push(webtoonId);
        await user.save();
        res.status(200).send('Webtoon added to favorites');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Get favorites route
router.get('/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('favorites');
        if (!user) return res.status(404).send('User not found');

        res.json(user.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
