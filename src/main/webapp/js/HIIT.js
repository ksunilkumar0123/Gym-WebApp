document.addEventListener('DOMContentLoaded', function() {
  const workoutsList = document.getElementById('workouts-list');
  const addWorkoutBtn = document.getElementById('addWorkoutBtn');
  const startWorkoutBtn = document.getElementById('startWorkoutBtn');

  let workouts = [];

  addWorkoutBtn.addEventListener('click', function() {
    const workoutName = document.getElementById('workoutName').value.trim();
    const workoutTime = parseInt(document.getElementById('workoutTime').value);
    const restTime = parseInt(document.getElementById('restTime').value);

    if (workoutName && workoutTime && !isNaN(restTime)) {
      workouts.push({ name: workoutName, time: workoutTime, rest: restTime });
      renderWorkouts();
      document.getElementById('workoutName').value = '';
      document.getElementById('workoutTime').value = '';
      document.getElementById('restTime').value = '';
    } else {
      alert('Please enter valid workout details.');
    }
  });

  function renderWorkouts() {
    workoutsList.innerHTML = '';
    workouts.forEach((workout, index) => {
      const workoutItem = document.createElement('div');
      workoutItem.classList.add('workout-item');
      workoutItem.innerHTML = `
        <div>${workout.name} - ${workout.time} seconds</div>
        <div>Rest Interval: ${workout.rest} seconds</div>
      `;
      workoutsList.appendChild(workoutItem);
    });
  }

  startWorkoutBtn.addEventListener('click', function() {
    if (workouts.length === 0) {
      alert('Add at least one workout to start the session.');
      return;
    }

    // Store workouts in localStorage
    localStorage.setItem('workouts', JSON.stringify(workouts));

    // Redirect to HIIT session page
    window.location.href = 'HIIT-Session.html';
  });
});
