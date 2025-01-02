// controllers/foodLogController.js
const FoodLog = require('../models/foodLog');

exports.addFoodToLog = async (req, res) => {
  try {
    const { date, foods } = req.body; // Ensure `foods` is destructured here

    // Debug logs for incoming data
    console.log('Incoming date:', date);
    console.log('Incoming foods:', foods);

    const userId = req.user?._id; // Assuming req.user is set by your authentication middleware
    if (!userId) {
      console.error('Unauthorized request, missing user ID.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let foodLog = await FoodLog.findOne({ userId, date });
    if (!foodLog) {
      foodLog = new FoodLog({ userId, date, foods: [] });
    }

    foodLog.foods.push(...foods); // Add the new foods to the existing array
    await foodLog.save();

    console.log('Food log saved successfully:', foodLog);
    res.status(200).json({ message: 'Food log saved successfully', foodLog });
  } catch (error) {
    console.error('Error adding food to log:', error);
    res.status(500).json({ error: 'Failed to save food log' });
  }
};






exports.getDailyLog = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const userId = req.user?._id;
    const logDate = new Date(date);

    console.log('Fetching log for user:', userId, 'on date:', logDate);

    const foodLog = await FoodLog.findOne({ userId, date: logDate });

    if (!foodLog) {
      console.error('No food log found for this date:', logDate);
      return res.status(404).json({ error: 'No food log found for this date' });
    }

    console.log('Fetched food log:', foodLog);

    res.status(200).json({ foods: foodLog.foods });
  } catch (error) {
    console.error('Error retrieving food log:', error);
    res.status(500).json({ error: 'Failed to retrieve food log' });
  }
};


