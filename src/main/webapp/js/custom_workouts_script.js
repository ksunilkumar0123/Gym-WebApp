document.addEventListener('DOMContentLoaded', function() {
  const workoutType = document.getElementById('workoutType');
  const exerciseInput = document.getElementById('exerciseInput');
  const workoutSession = document.getElementById('workoutSession');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const suggestions = document.getElementById('suggestions');

  const exercises = {
    chest: ["Dumbbell Chest Press", "Chest Flys"],
    legs: ["Squats", "Lunges"],
    back: ["Pull-Ups", "Deadlifts"],
    biceps: ["Bicep Curls", "Hammer Curls"],
    triceps: ["Tricep Dips", "Skull Crushers"],
    abs: ["Crunches", "Planks"],
    'Select Variation': [] // Dummy category with no workouts
  };

  // Function to refresh suggestions based on workout type and input
  function refreshSuggestions() {
    const workoutTypeValue = workoutType.value;
    const input = exerciseInput.value.toLowerCase();
    suggestions.innerHTML = '';

    // Populate exercises based on the filter condition
    let filteredExercises = [];
    if (workoutTypeValue === 'all') {
      // Concatenate all exercises if 'all' is selected
      for (let type in exercises) {
        if (type !== 'Select Variation') {
          filteredExercises = filteredExercises.concat(exercises[type]);
        }
      }
    } else {
      // Get exercises for the selected workout type
      filteredExercises = exercises[workoutTypeValue];
    }

    // Filter exercises based on input
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
  }

  // Event listener for typing in the exercise input
  exerciseInput.addEventListener('input', refreshSuggestions);

  // Event listener for adding exercise
  addExerciseBtn.addEventListener('click', function() {
    const exercise = exerciseInput.value.trim();
    if (exercise !== '') {
      const sets = prompt("How many sets?");
      if (sets !== null && !isNaN(sets) && sets > 0) {
        addExercise(exercise, sets);
        exerciseInput.value = '';
        suggestions.innerHTML = ''; // Clear suggestions after adding exercise
      } else {
        alert("Please enter a valid number of sets.");
      }
    }
  });

  function addExercise(exercise, sets = null) {
    if (sets === null) {
      sets = prompt("How many sets?");
      if (sets === null || isNaN(sets) || sets <= 0) {
        alert("Please enter a valid number of sets.");
        return;
      }
    }
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise-box'); // Add a class for styling
    // Generate a random color for the background
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    exerciseDiv.style.backgroundColor = randomColor;
    // Set exercise and sets text
    exerciseDiv.innerHTML = `<span>${exercise} - Sets: ${sets}</span> <button class="removeBtn">Remove</button>`;
    workoutSession.appendChild(exerciseDiv);
  }

  // Event listener for removing exercise
  workoutSession.addEventListener('click', function(event) {
    if (event.target.classList.contains('removeBtn')) {
      event.target.parentElement.remove();
    }
  });

  // Event listener for moving to Start Workouts
  document.getElementById('moveToStartWorkoutsBtn').addEventListener('click', function() {
    // Get selected exercises
    const selectedExercises = Array.from(workoutSession.children).map(child => child.textContent);
    // Store selected exercises in localStorage to pass to Start Workouts page
    localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
    // Redirect to Start Workouts page
    window.location.href = 'start_workouts.html';
  });

  // Event listener for going back to home
  document.getElementById('backHomeBtn').addEventListener('click', function() {
    customWorkoutPage.classList.add('hidden');
    homePage.classList.remove('hidden');
    workoutSession.innerHTML = '';
  });
});
