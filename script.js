document.addEventListener('DOMContentLoaded', function() {
  const customWorkoutsTile = document.getElementById('customWorkouts');
  const customWorkoutPage = document.getElementById('customWorkoutPage');
  const homePage = document.getElementById('homePage');
  const summaryPage = document.getElementById('summaryPage');
  const workoutType = document.getElementById('workoutType');
  const exerciseInput = document.getElementById('exerciseInput');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const workoutSession = document.getElementById('workoutSession');
  const completeWorkoutBtn = document.getElementById('completeWorkoutBtn');
  const backHomeBtn = document.getElementById('backHomeBtn');
  const totalTimeElement = document.getElementById('totalTime');
  const caloriesBurnedElement = document.getElementById('caloriesBurned');
  const suggestions = document.getElementById('suggestions');

  let startTime;
  let endTime;
  let totalTime = 0;

  const exercises = {
    chest: ["Dumbbell Chest Press", "Chest Flys"],
    legs: ["Squats", "Lunges"],
    back: ["Pull-Ups", "Deadlifts"],
    biceps: ["Bicep Curls", "Hammer Curls"],
    triceps: ["Tricep Dips", "Skull Crushers"],
    abs: ["Crunches", "Planks"]
  };

  // Event listener for clicking on Custom Workouts tile
  customWorkoutsTile.addEventListener('click', function() {
    homePage.classList.add('hidden');
    customWorkoutPage.classList.remove('hidden');
    startTime = new Date();
  });

  // Event listener for typing in the exercise input
  exerciseInput.addEventListener('input', function() {
    const workoutTypeValue = workoutType.value;
    const input = exerciseInput.value.toLowerCase();
    suggestions.innerHTML = '';

    let filteredExercises = [];
    if (workoutTypeValue === 'all') {
      for (let type in exercises) {
        filteredExercises = filteredExercises.concat(exercises[type]);
      }
    } else {
      filteredExercises = exercises[workoutTypeValue];
    }

    filteredExercises.forEach(exercise => {
      if (exercise.toLowerCase().includes(input)) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = exercise;
        suggestionDiv.addEventListener('click', function() {
          addExercise(exercise);
        });
        suggestions.appendChild(suggestionDiv);
      }
    });
  });

  // Event listener for adding exercise
  addExerciseBtn.addEventListener('click', function() {
    const exercise = exerciseInput.value.trim();
    if (exercise !== '') {
      addExercise(exercise);
      exerciseInput.value = '';
      suggestions.innerHTML = ''; // Clear suggestions after adding exercise
    }
  });

  function addExercise(exercise) {
    workoutSession.innerHTML += `<div>${exercise} - Set 1 - Set 2 - Set 3 <button class="doneBtn">Done</button></div>`;
  }

  // Event listener for marking exercise as done
  workoutSession.addEventListener('click', function(event) {
    if (event.target.classList.contains('doneBtn')) {
      event.target.parentElement.style.textDecoration = 'line-through';
      event.target.disabled = true;
      // Implement time and calorie calculation here
      totalTime += 5; // Example time per exercise
    }
  });

  // Event listener for completing the workout
  completeWorkoutBtn.addEventListener('click', function() {
    endTime = new Date();
    const duration = (endTime - startTime) / 1000 / 60; // Duration in minutes
    const caloriesBurned = duration * 8; // Example calorie calculation (8 calories per minute)

    totalTimeElement.textContent = `Total Time: ${duration.toFixed(2)} minutes`;
    caloriesBurnedElement.textContent = `Calories Burned: ${caloriesBurned.toFixed(2)}`;

    customWorkoutPage.classList.add('hidden');
    summaryPage.classList.remove('hidden');
  });

  // Event listener for going back to home
  backHomeBtn.addEventListener('click', function() {
    summaryPage.classList.add('hidden');
    homePage.classList.remove('hidden');
    workoutSession.innerHTML = '';
    totalTime = 0;
  });
});
