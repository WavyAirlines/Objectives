const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodId: String,
  name: String,
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: { type: Date, required: true },
  foods: [foodSchema], // Array of food subdocuments
});

module.exports = mongoose.model('FoodLog', foodLogSchema);
