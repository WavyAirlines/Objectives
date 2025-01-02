// models/profile.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  status: { type: String, default: '' },
  split: {
    monday: { type: String, default: '' },
    tuesday: { type: String, default: '' },
    wednesday: { type: String, default: '' },
    thursday: { type: String, default: '' },
    friday: { type: String, default: '' },
    saturday: { type: String, default: '' },
    sunday: { type: String, default: '' },
  },
  prs: {
    squat: { weight: { type: Number, default: 0 }, reps: { type: Array, default: 0 } },
    benchPress: { weight: { type: Number, default: 0 }, reps: { type: Array, default: 0 } },
    deadlift: { weight: { type: Number, default: 0 }, reps: { type: Array, default: 0 } },
  },
  favoriteExercises: { type: String, default: '' },
  experience: { type: String, default: '' },
  motivation: { type: String, default: '' },
});

module.exports = mongoose.model('Profile', ProfileSchema);
