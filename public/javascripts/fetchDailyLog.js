async function fetchDailyLog(date) {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const response = await fetch(`/food-log/daily?date=${formattedDate}`);
  
  const log = await response.json();
  console.log('Fetched log from server:', log);

  if (response.ok) {
    const logContainer = document.getElementById('logContainer');

    // Calculate totals for fats, carbs, protein, and calories
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    log.foods.forEach(food => {
      totalCalories += food.calories || 0;
      totalProtein += food.protein || 0;
      totalCarbs += food.carbs || 0;
      totalFat += food.fat || 0;
    });

    // Create the summary section
    const summaryHtml = `
      <div class="profileLog">
        <h3>Daily Intake Summary</h3>
        <p>Calories: ${totalCalories}</p>
        <p>Protein: ${totalProtein}g</p>
        <p>Carbs: ${totalCarbs}g</p>
        <p>Fat: ${totalFat}g</p>
      </div>
    `;

    // Create the individual logs section
    const logsHtml = log.foods
      .map(food => {
        console.log('Food item:', food); // Log individual food items for debugging
        return `<div class="profileLog">
          <h4>${food.name || 'No Name'}</h4>
          <p>${food.description || 'No Description'}</p>
          <p>Calories: ${food.calories || 0}, Protein: ${food.protein || 0}g, Carbs: ${food.carbs || 0}g, Fat: ${food.fat || 0}g</p>
        </div>`;
      })
      .join('');

    // Combine the summary and logs
    logContainer.innerHTML = summaryHtml + logsHtml;
  } else {
    alert('No food log found for this date');
  }
}
