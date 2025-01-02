// routes/foodLogRoutes.js
const express = require('express');
const { addFoodToLog, getDailyLog } = require('../controllers/foodLogs');
const FoodLog = require('../models/foodLog');
const authCheck = require('../authCheck');
const router = express.Router();

router.post('/add', authCheck, addFoodToLog); // Save a food to the daily log
router.get('/daily', authCheck, getDailyLog); // Retrieve the food log for a specific date

router.post('/add', async (req, res) => {
    try {
      const { date, foods } = req.body;
  
      if (!date || !foods || !Array.isArray(foods)) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const formattedFoods = foods.map(food => ({
        foodId: food.foodId,
        name: food.name,
        description: food.description,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      }));
  
      const foodLog = new FoodLog({
        userId: req.user._id,
        date: new Date(date),
        foods: formattedFoods, // Use formatted foods array
      });
  
      await foodLog.save();
      res.status(201).json({ message: 'Food log saved successfully' });
    } catch (error) {
      console.error('Error saving food log:', error);
      res.status(500).json({ error: 'Failed to save food log' });
    }
  });
  
  
  

module.exports = router;
