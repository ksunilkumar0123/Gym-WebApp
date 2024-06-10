document.addEventListener('DOMContentLoaded', function() {
  const customWorkoutsTile = document.getElementById('customWorkouts');
  const customWorkoutPage = document.getElementById('customWorkoutPage');
  const exerciseInput = document.getElementById('exerciseInput');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const workoutSession = document.getElementById('workoutSession');
  
  // Event listener for clicking on Custom Workouts tile
  customWorkoutsTile.addEventListener('click', function() {
    customWorkoutPage.classList.remove('hidden');
  });

  // Event listener for adding exercise
  addExerciseBtn.addEventListener('click', function() {
    const exercise = exerciseInput.value;
    if (exercise.trim() !== '') {
      workoutSession.innerHTML += `<div>${exercise} - Set 1 - Set 2 - Set 3 <button class="doneBtn">Done</button></div>`;
      exerciseInput.value = '';
    }
  });

  // Event listener for marking exercise as done
  workoutSession.addEventListener('click', function(event) {
    if (event.target.classList.contains('doneBtn')) {
      // Code to note the time and calculate calories
      // This is a placeholder, you need to implement the actual functionality
      console.log('Exercise completed');
    }
  });
});
