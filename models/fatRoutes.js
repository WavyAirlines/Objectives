// routes/fatSecretRoutes.js
const express = require('express');
const router = express.Router();
const fatSecretController = require('../controllers/fatSecret');

// Route to fetch token
router.get('/token', fatSecretController.getToken);

// Route to search food
router.get('/food-search', fatSecretController.searchFood); // Make sure it matches the controller method

module.exports = router;


// Route to get food data
router.get('/food-entries', async (req, res) => {
  const token = req.session.fatSecretToken;
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  // Fetch user macro data using token
  try {
    const response = await fetch('https://platform.fatsecret.com/rest/server.api?method=food_entries.get&format=json', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching food entries:', error);
    res.status(500).json({ error: 'Failed to fetch food entries' });
  }
});

module.exports = router;
