document.addEventListener('DOMContentLoaded', function() {
  const workoutType = document.getElementById('workoutType');
  const exerciseInput = document.getElementById('exerciseInput');
  const workoutSession = document.getElementById('workoutSession');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const suggestions = document.getElementById('suggestions');
  const saveWorkoutBtn = document.getElementById('saveWorkoutBtn');
  const saveWorkoutBtnInSummary = document.getElementById('saveWorkoutBtnInSummary');
  const startWorkoutPage = document.getElementById('startWorkoutPage');
  const customWorkoutPage = document.getElementById('customWorkoutPage');
  const exerciseDetails = document.getElementById('exerciseDetails');

  let exerciseCount = 0;
  const exercises = {
    chest: ["Dumbbell Chest Press", "Chest Flys"],
    legs: ["Squats", "Lunges"],
    back: ["Pull-Ups", "Deadlifts"],
    biceps: ["Bicep Curls", "Hammer Curls"],
    triceps: ["Tricep Dips", "Skull Crushers"],
    abs: ["Crunches", "Planks"],
    'Select Variation': [] // Dummy category with no workouts
  };

  function refreshSuggestions() {
    const workoutTypeValue = workoutType.value;
    const input = exerciseInput.value.toLowerCase();
    suggestions.innerHTML = '';

    let filteredExercises = [];
    if (workoutTypeValue === 'all') {
      for (let type in exercises) {
        if (type !== 'Select Variation') {
          filteredExercises = filteredExercises.concat(exercises[type]);
        }
      }
    } else {
      filteredExercises = exercises[workoutTypeValue];
    }

    filteredExercises.forEach(exercise => {
      if (exercise.toLowerCase().includes(input)) {
        const suggestionBox = document.createElement('div');
        suggestionBox.classList.add('suggestion-box');

        const exerciseText = document.createElement('span');
        exerciseText.textContent = exercise;
        suggestionBox.appendChild(exerciseText);

        const addIcon = document.createElement('i');
        addIcon.classList.add('fas', 'fa-plus');
        addIcon.addEventListener('click', function() {
          addExercise(exercise);
        });
        suggestionBox.appendChild(addIcon);

        suggestions.appendChild(suggestionBox);
      }
    });
  }

  exerciseInput.addEventListener('input', refreshSuggestions);
  workoutType.addEventListener('change', refreshSuggestions);

  addExerciseBtn.addEventListener('click', function() {
    const exercise = exerciseInput.value.trim();
    if (exercise !== '') {
      addExercise(exercise);
      exerciseInput.value = '';
      suggestions.innerHTML = '';
    }
  });

  function addExercise(exercise) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise-box');
    exerciseDiv.textContent = exercise;

    const removeIcon = document.createElement('span');
    removeIcon.classList.add('remove-icon');
    removeIcon.innerHTML = '&#128465;'; 
    removeIcon.addEventListener('click', function() {
      exerciseDiv.remove();
      exerciseCount--;
      updateSaveWorkoutBtn();
    });
    exerciseDiv.appendChild(removeIcon);

    workoutSession.appendChild(exerciseDiv);

    exerciseCount++;
    updateSaveWorkoutBtn();
  }

  function updateSaveWorkoutBtn() {
    if (exerciseCount > 0) {
      saveWorkoutBtn.classList.remove('hidden');
    } else {
      saveWorkoutBtn.classList.add('hidden');
    }
  }

  saveWorkoutBtn.addEventListener('click', function() {
    customWorkoutPage.style.display = 'none';
    startWorkoutPage.style.display = 'block';
    populateExerciseDetails();
  });

function populateExerciseDetails() {
  exerciseDetails.innerHTML = '';
  const exercisesArray = Array.from(workoutSession.children);
  exercisesArray.forEach((exerciseDiv, index) => {
    const exerciseName = exerciseDiv.textContent.replace('🗑', '').trim();

    const exerciseDetail = document.createElement('div');
    exerciseDetail.classList.add('exercise-detail');
    exerciseDetail.innerHTML = `
      <h3>Exercise ${index + 1}: ${exerciseName}</h3>
      <div class="set-entry">
        <label>Set 1</label>
        <input type="number" placeholder="KG">
        <input type="number" placeholder="REPS">
      </div>
      <button class="add-set-btn">+ Add a set</button>
    `;

    exerciseDetails.appendChild(exerciseDetail);
  });
}


document.body.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-set-btn')) {
    const exerciseDetail = event.target.parentElement;
    const setEntries = exerciseDetail.querySelectorAll('.set-entry');
    const newSetNumber = setEntries.length + 1;

    const newSetEntry = document.createElement('div');
    newSetEntry.classList.add('set-entry');
    newSetEntry.innerHTML = `
      <label>Set ${newSetNumber}</label>
      <input type="number" placeholder="KG">
      <input type="number" placeholder="REPS">
    `;

    exerciseDetail.insertBefore(newSetEntry, event.target);
  }
});



 saveWorkoutBtnInSummary.addEventListener('click', function() {
  const workoutName = prompt('Enter a name for your workout:');
  if (workoutName) {
    saveSelectedExercises(workoutName);
  }
});


function saveSelectedExercises(workoutName) {
  const exercisesArray = Array.from(exerciseDetails.children);
  const exerciseData = exercisesArray.map(exerciseDiv => {
    const exerciseName = exerciseDiv.querySelector('h3').textContent.split(': ')[1].trim();
    const sets = Array.from(exerciseDiv.querySelectorAll('.set-entry')).map(setEntry => {
      const setNumber = setEntry.querySelector('label').textContent;
      return {
        number: setNumber, // Include the set label
        kg: setEntry.querySelector('input[placeholder="KG"]').value,
        reps: setEntry.querySelector('input[placeholder="REPS"]').value
      };
    });
    return { name: exerciseName, sets: sets };
  });

  const workoutData = {
    name: workoutName,
    exercises: exerciseData
  };

  // Send workoutData to server endpoint
  fetch('http://localhost:3000/saveWorkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData),
  })
  .then(response => {
    if (response.ok) {
      alert('Workout saved successfully!');
      window.location.href = 'index.html'; // Redirect to index.html
    } else if (response.status === 400) {
      alert('Workout with this name already exists.');
    } else {
      alert('Failed to save workout.');
    }
  })
  .catch(error => {
    console.error('Error saving workout:', error);
    alert('Failed to save workout. Please try again.');
  });
}



});
