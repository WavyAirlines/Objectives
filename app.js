var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var index = require('./controllers/index');
var users = require('./controllers/users');
let auth = require('./controllers/auth');
let profile = require('./controllers/profile');
let posts = require('./controllers/posts');

let mongoose = require('mongoose');
let dotenv = require('dotenv');
let passport = require('passport');
let session = require('express-session');

const Profile = require('./models/profile');
const fatSecretRoutes = require('./models/fatRoutes');
const fatSecretController = require('./controllers/fatSecret');
const foodLogRoutes = require('./models/foodRoutes');
var app = express();

// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// MongoDB connection
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection to MongoDB failed', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallbackSecretForDevelopmentOnly',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTION_STRING,
    collectionName: 'sessions',
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
}));

// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());

let User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make user data available in all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Define routes
app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/fatsecret', fatSecretRoutes);
app.get('/fatsecret/token', fatSecretController.getToken);
app.get('/nutrition', fatSecretController.renderNutritionPage);
app.get('/food-search', fatSecretController.searchFood);
app.use('/food-log', foodLogRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Dynamic port for Render
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});


module.exports = app;
