const mongoose = require('mongoose');

// define blog post model for CRUD
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    movement: {
        type: String, // E.g., "Squat", "Bench Press", "Deadlift"
        required: true
    },
    timePeriod: {
        type: String, 
        required: true
    },
    weight: {
        type: Number, // Weight lifted
        required: true
    },
    reps: {
        type: String, // Repetitions performed
        required: false
    },
    rpe: {
        type: Number, // Rate of Perceived Exertion
        required: false
    },
    comments: {
        type: String, // Optional notes about the workout
        required: false
    }
});

// Create an index for searching by user and movement
postSchema.index({ user: 1, movement: 1, timePeriod: 1 });

// make the model public so the controllers can use it
module.exports = mongoose.model('Post', postSchema);
