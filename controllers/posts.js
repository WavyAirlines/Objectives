let express = require('express');
let router = express.Router();

// Post model for CRUD
let Post = require('../models/post');

// global auth check
let authCheck = require('../authCheck');

/* GET: /posts => show main blog page */
router.get('/', async (req, res) => {
    try {
        let posts = await Post.find().sort({ timePeriod: -1 });
        res.render('posts/index', {
            title: 'Posts',
            posts: posts,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

/* GET: /posts/details/:_id => display selected post */
router.get('/details/:_id', async (req, res) => {
    try {
        let post = await Post.findById(req.params._id);
        res.render('posts/details', {
            title: 'Details',
            post: post,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(404).send('Post Not Found');
    }
});

/* GET: /posts/create => display new post form */
router.get('/create', authCheck, (req, res) => {
    res.render('posts/create', {
        title: 'Create New Post',
        user: req.user
    });
});

/* POST: /posts/create => process form submission to save new post */
router.post('/create', authCheck, async (req, res) => {
    try {
        let newPost = {
            username: req.body.username,
            user: req.user._id,
            movement: req.body.movement,
            timePeriod: req.body.timePeriod,
            weight: req.body.weight,
            reps: req.body.reps,
            rpe: req.body.rpe,
            comments: req.body.comments
        };

        await Post.create(newPost);
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to Create Post');
    }
});

/* GET: /posts/delete/:_id => remove selected doc & redirect */
router.get('/delete/:_id', authCheck, async (req, res) => {
    try {
        let post = await Post.findById(req.params._id);

        if (!post || req.user.username !== post.username) {
            return res.redirect('/auth/unauthorized');
        }

        await post.deleteOne();
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to Delete Post');
    }
});

/* GET: /posts/edit/:_id => display selected doc in form */
router.get('/edit/:_id', authCheck, async (req, res) => {
    try {
        let post = await Post.findById(req.params._id);

        if (!post || req.user.username !== post.username) {
            return res.redirect('/auth/unauthorized');
        }

        res.render('posts/edit', {
            title: 'Edit Post',
            post: post,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(404).send('Post Not Found');
    }
});

/* POST: /posts/edit/:_id => update doc from form submission */
router.post('/edit/:_id', authCheck, async (req, res) => {
    try {
        let updatedPost = {
            movement: req.body.movement,
            timePeriod: req.body.timePeriod,
            weight: req.body.weight,
            reps: req.body.reps,
            rpe: req.body.rpe,
            comments: req.body.comments
        };

        await Post.findByIdAndUpdate(req.params._id, updatedPost);
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to Update Post');
    }
});

/* POST: /posts/search => search posts by keyword */
router.post('/search', async (req, res) => {
    try {
        let posts = await Post.find({ $text: { $search: req.body.keyword } });
        res.render('posts/search', {
            title: 'Search Results',
            posts: posts,
            keyword: req.body.keyword
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to Search Posts');
    }
});

module.exports = router;
