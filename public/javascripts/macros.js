// Function to search for food
async function searchFood() {
  const query = document.getElementById('food-query').value;
  try {
    const response = await fetch(`/fatsecret/food-search?query=${query}`);
    const data = await response.json();

    // Check if the response contains food data
    if (Array.isArray(data) && data.length > 0) {
      displayFoodResults(data); // Pass the array of food objects to the display function
    } else {
      console.error('No food results found or unexpected response structure:', data);
      alert('No results found.');
    }
  } catch (error) {
    console.error('Error fetching food search:', error);
    alert('Error fetching food search');
  }
}

// Array to hold selected foods
let selectedFoods = [];

// Function to handle food selection
function selectFood(food) {
  selectedFoods.push({
    foodId: food.food_id,
    name: food.food_name,
    description: food.food_description,
    calories: parseInt(food.food_description.match(/Calories: (\d+)/)?.[1] || 0),
    protein: parseFloat(food.food_description.match(/Protein: ([\d.]+)g/)?.[1] || 0),
    carbs: parseFloat(food.food_description.match(/Carbs: ([\d.]+)g/)?.[1] || 0),
    fat: parseFloat(food.food_description.match(/Fat: ([\d.]+)g/)?.[1] || 0),
  });

  console.log('Updated selectedFoods array:', selectedFoods); // Debug log


  // Update the UI to show selected foods
  const selectedFoodsDiv = document.getElementById('selected-foods');
  selectedFoodsDiv.innerHTML = selectedFoods
    .map(
      (item, index) =>
        `<div class="selected-food" id="selected-food-${index}">
           <h3>${item.name}</h3>
           <p>${item.description}</p>
           <button onclick="removeFood(${index})">Remove</button>
         </div>`
    )
    .join('');
}

function removeFood(index) {
  selectedFoods.splice(index, 1); // Remove food from array
  // Update the UI to reflect changes
  const selectedFoodsDiv = document.getElementById('selected-foods');
  selectedFoodsDiv.innerHTML = selectedFoods
    .map(
      (item, index) =>
        `<div class="selected-food" id="selected-food-${index}">
           <h3>${item.name}</h3>
           <p>${item.description}</p>
           <button onclick="removeFood(${index})">Remove</button>
         </div>`
    )
    .join('');
}


document.getElementById('foodLogForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('foodLogDate').value;
  console.log('Date selected:', date);

  // Debug log for selected foods
  console.log('Foods being submitted:', selectedFoods);

  if (!selectedFoods.length) {
    alert('No foods selected. Please add foods before saving.');
    return;
  }

  const response = await fetch('/food-log/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date, foods: selectedFoods }),
  });

  const result = await response.json();
  if (response.ok) {
    alert('Food log saved successfully');
  } else {
    alert(`Error: ${result.error}`);
  }
});





// Function to display food results
function displayFoodResults(foods) {
  const resultsDiv = document.getElementById('food-results');
  resultsDiv.innerHTML = foods
    .map((food, index) => {
      return `
        <div class="food-item" id="food-item-${index}">
          <h3>${food.food_name}</h3>
          <p>${food.food_description}</p>
          <button data-index="${index}" class="select-food-btn macrobutton">Select</button>
        </div>
      `;
    })
    .join('');

  // Attach event listeners to all buttons after rendering
  document.querySelectorAll('.select-food-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      const selectedFood = foods[index];
      selectFood(selectedFood);
    });
  });
}
