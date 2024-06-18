document.addEventListener('DOMContentLoaded', function() {
  const customWorkoutsTile = document.getElementById('customWorkouts');

  // Event listener for clicking on Custom Workouts tile
  customWorkoutsTile.addEventListener('click', function() {
    window.location.href = 'custom_workouts.html';
  });
});
