var express = require('express');
var router = express.Router();
const profileRoutes = require('../controllers/profile');
const authCheck = require('../authCheck');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OBJ' });
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// Apply authCheck to profile routes
router.use('/profile', authCheck, profileRoutes);

module.exports = router;
