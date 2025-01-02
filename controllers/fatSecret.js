const client = require('../public/config/fatsecretConfig');

// Helper function to fetch a new token
async function fetchNewToken() {
  const tokenParams = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.FATSECRET_CLIENT_ID,
    client_secret: process.env.FATSECRET_CLIENT_SECRET,
  });

  const response = await client.post('', tokenParams.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (response && response.data && response.data.access_token) {
    return response.data.access_token;
  } else {
    throw new Error('Failed to fetch access token');
  }
}

// Route to get the token (for debugging, optional)
exports.getToken = async (req, res) => {
  try {
    const token = await fetchNewToken();
    req.session.fatSecretToken = token; // Store token in session
    res.json({ token });
  } catch (error) {
    console.error('Access Token Error:', error.message);
    res.status(500).json({ error: 'Unable to fetch token' });
  }
};

// Route to render the nutrition page
exports.renderNutritionPage = (req, res) => {
  res.render('nutrition', {
    title: 'Track Your Nutrition',
    user: req.user, // Pass user data if necessary for the session
  });
};

// Search for foods using FatSecret API
exports.searchFood = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Retrieve token from session
    let token = req.session.fatSecretToken;

    // If no token or token invalid, fetch a new one
    if (!token) {
      try {
        token = await fetchNewToken();
        req.session.fatSecretToken = token; // Update session
      } catch (tokenError) {
        console.error('Error fetching new token:', tokenError.message);
        return res.status(401).json({ error: 'Failed to authenticate with FatSecret API' });
      }
    }

    // Perform the food search
    const url = `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(query)}&format=json`;
    const response = await client.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('API Response:', response.data);

    // Check for expected response structure
    if (response.data.foods && response.data.foods.food) {
      res.json(response.data.foods.food);
    } else {
      res.status(404).json({ error: 'No foods found for the query' });
    }
  } catch (error) {
    console.error('Error in searchFood:', error.message);
    res.status(500).json({ error: 'Food search failed' });
  }
};
