// Function to submit forms via AJAX
function submitFormViaAjax(formId, actionUrl) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
  
      const formData = new FormData(form);
  
      fetch(actionUrl, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert('Profile updated successfully');
            
            // Update the display data dynamically based on the form
            if (formId === 'status-form') {
              document.getElementById('status-display').textContent = data.status;
            } else if (formId === 'squatPB-form') {
              document.getElementById('squatPB-display').textContent = `Squat: ${data.prs.squat.weight} lbs for ${data.prs.squat.reps} reps`;
            } else if (formId === 'benchPB-form') {
              document.getElementById('benchPB-display').textContent = `Bench Press: ${data.prs.benchPress.weight} lbs for ${data.prs.benchPress.reps} reps`;
            } else if (formId === 'deadliftPB-form') {
              document.getElementById('deadliftPB-display').textContent = `Deadlift: ${data.prs.deadlift.weight} lbs for ${data.prs.deadlift.reps} reps`;
            } else if (formId === 'favoriteExercises-form') {
              document.getElementById('favoriteExercises-display').textContent = data.favoriteExercises;
            } else if (formId === 'experience-form') {
              document.getElementById('experience-display').textContent = data.experience;
            } else if (formId === 'motivation-form') {
              document.getElementById('motivation-display').textContent = data.motivation;
            }
            
            // Optionally, you can reset the form after successful submission
            form.reset(); // Resets the form fields
          } else {
            alert('Error updating profile: ' + data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred while updating your profile.');
        });
    });
  }
  
  // Bind form submission handlers for each form on the page
  document.addEventListener('DOMContentLoaded', () => {
    submitFormViaAjax('status-form', '/profile/update-status');
    submitFormViaAjax('split-form', '/profile/update-split');
    submitFormViaAjax('squatPB-form', '/profile/update-prs');
    submitFormViaAjax('benchPB-form', '/profile/update-prs');
    submitFormViaAjax('deadliftPB-form', '/profile/update-prs');
    submitFormViaAjax('favoriteExercises-form', '/profile/update-favoriteExercises');
    submitFormViaAjax('experience-form', '/profile/update-experience');
    submitFormViaAjax('motivation-form', '/profile/update-motivation');
  });
  