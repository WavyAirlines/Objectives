document.getElementById('foodLogForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('foodLogDate').value;

  if (!selectedFoods || selectedFoods.length === 0) {
    alert('No food selected to log!');
    return;
  }

  try {
    const response = await fetch('/food-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        food: selectedFoods,
      }),
    });

    if (response.ok) {
      alert('Food log saved!');
      selectedFoods = []; // Clear array after saving
      document.getElementById('selected-foods').innerHTML = ''; // Clear UI
    } else {
      const result = await response.json();
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error saving food log:', error);
    alert('An unexpected error occurred.');
  }
});
