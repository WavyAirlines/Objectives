// controllers/profileController.js
const Profile = require('../models/profile');
const authCheck = require('../authCheck');
const User = require('../models/user');
let express = require('express');
let router = express.Router();
let Post = require('../models/post');


// GET route to display the edit profile page
router.get('/edit-profile', authCheck, async (req, res) => {
  const userId = req.user._id; // Get the logged-in user's ID
  try {
    const profile = await Profile.findOne({ user: userId }).populate('user');
    if (!profile) {
      return res.status(404).render('error', { message: 'Profile not found' });
    }
    res.render('posts/edit-profile', { profile }); // Render the edit profile view
  } catch (error) {
    console.error('Error fetching profile for edit:', error);
    res.status(500).render('error', { message: 'Error fetching profile for edit' });
  }
});

// Search users by username or other fields
router.get('/search', authCheck, async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request
  try {
    // Search in the User collection
    const users = await User.find({
      username: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search
    });

    // Render a search results page
    res.render('posts/search-results', { users, searchQuery });
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).render('error', { message: 'Error searching for users' });
  }
});

router.get('/:id', authCheck, async (req, res) => {
  const userId = req.params.id;

  try {
    const profile = await Profile.findOne({ user: userId }).populate('user');
    if (!profile) {
      return res.status(404).render('error', { message: 'Profile not found' });
    }

    const posts = await Post.find({ user: userId });
    const isOwnProfile = req.user && req.user._id.toString() === userId;

    // Extract unique movements from posts
    const movements = [...new Set(posts.map(post => post.movement))];

    // Default chart for the first movement or an empty string if no movements
    const defaultMovement = movements.length > 0 ? movements[0] : '';
    const chartUrl = defaultMovement
      ? `https://charts.mongodb.com/charts-project-0-yprnfpd/embed/charts?id=ecfa233e-6db7-44b4-b5ad-444cbe8a21ba&filter=${encodeURIComponent(
          JSON.stringify({ user: userId, movement: defaultMovement })
        )}&theme=light`
      : '';

    res.render('posts/profile', { profile, posts, isOwnProfile, chartUrl, movements });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).render('error', { message: 'Error fetching profile' });
  }
});



// Update all profile fields at once
router.post('/update-all', authCheck, async (req, res) => {
  const userId = req.user._id;

  try {
    const updatedData = {
      status: req.body.status,
      'split.monday': req.body['split.monday'],
      'split.tuesday': req.body['split.tuesday'],
      'split.wednesday': req.body['split.wednesday'],
      'split.thursday': req.body['split.thursday'],
      'split.friday': req.body['split.friday'],
      'split.saturday': req.body['split.saturday'],
      'split.sunday': req.body['split.sunday'],
      'prs.squat.weight': req.body['prs.squat.weight'],
      'prs.squat.reps': req.body['prs.squat.reps'],
      'prs.benchPress.weight': req.body['prs.benchPress.weight'],
      'prs.benchPress.reps': req.body['prs.benchPress.reps'],
      'prs.deadlift.weight': req.body['prs.deadlift.weight'],
      'prs.deadlift.reps': req.body['prs.deadlift.reps'],
      favoriteExercises: req.body.favoriteExercises,
      experience: req.body.experience,
      motivation: req.body.motivation,
    };

    // Update the profile
    await Profile.findOneAndUpdate({ user: userId }, updatedData, { new: true });

    // Redirect to the profile page
    res.redirect(`/profile/${userId}`);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).render('error', { message: 'Error updating profile' });
  }
});

module.exports = router;
