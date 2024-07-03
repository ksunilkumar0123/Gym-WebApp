document.addEventListener('DOMContentLoaded', function() {
  const selectedExercises = JSON.parse(localStorage.getItem('selectedExercises')) || [];
  const countdownTimer = document.getElementById('countdownTimer');
  const workoutDetails = document.getElementById('workoutDetails');
  const workoutName = document.getElementById('workoutName');
  const workoutTimer = document.getElementById('workoutTimer');
  const nextWorkoutName = document.getElementById('nextWorkoutName');
  const doneButton = document.getElementById('doneButton');
  const skipButton = document.getElementById('skipButton');
  const skipCountdownButton = document.getElementById('skipCountdownButton');
  const finishButton = document.getElementById('finishButton');
  const summary = document.getElementById('summary');
  const totalTimerElement = document.getElementById('totalTimer');

  let totalSeconds = 0;
  let workoutIndex = 0;
  let workoutTimers = [];
  let skippedWorkouts = [];

  let countdownInterval;

  // Start countdown initially
  startCountdown();

  function startCountdown() {
    countdownTimer.textContent = '10'; // Initial countdown value
    countdownInterval = setInterval(() => {
      let currentCountdown = parseInt(countdownTimer.textContent);
      currentCountdown--;
      countdownTimer.textContent = currentCountdown;

      if (currentCountdown === 3) {
        document.body.classList.remove('beep'); // Remove beep effect after initial countdown
      }

      if (currentCountdown <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').style.display = 'none'; // Hide countdown section
        startNextWorkout();
      }
    }, 1000);
  }

  skipCountdownButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    document.getElementById('countdown').style.display = 'none'; // Hide countdown section immediately
    startNextWorkout();
  });

  function startNextWorkout() {
  if (workoutIndex < selectedExercises.length) {
    const currentExercise = selectedExercises[workoutIndex];
    workoutName.textContent = currentExercise.name; // Access the 'name' property
    workoutTimer.textContent = '00:00:00';
    workoutDetails.classList.remove('hidden');

    // Display next workout details if available
    if (workoutIndex < selectedExercises.length - 1) {
      nextWorkoutName.textContent = selectedExercises[workoutIndex + 1].name; // Access the 'name' property
    } else {
      nextWorkoutName.textContent = 'End of workout list';
      finishButton.classList.remove('hidden');
      doneButton.style.display = 'none'; // Hide Done button for the last workout
      skipButton.style.display = 'none'; // Hide Skip button for the last workout
    }

    startWorkoutTimer(workoutIndex);

    doneButton.addEventListener('click', handleDoneButton);
    skipButton.addEventListener('click', handleSkipButton);
  }
}


  function handleDoneButton() {
    clearInterval(workoutTimers[workoutIndex].interval);
    workoutIndex++;
    if (workoutIndex < selectedExercises.length) {
      startNextWorkout();
    } else {
      displayFinishButton();
    }
  }

  function handleSkipButton() {
    skippedWorkouts.push(selectedExercises[workoutIndex]);
    clearInterval(workoutTimers[workoutIndex].interval);
    workoutIndex++;
    if (workoutIndex < selectedExercises.length) {
      startNextWorkout();
    } else {
      displayFinishButton();
    }
  }

  function startWorkoutTimer(index) {
    workoutTimers[index] = {
      seconds: 0,
      interval: setInterval(() => {
        workoutTimers[index].seconds++;
        updateTimeDisplay(workoutTimer, workoutTimers[index].seconds);
        updateTimeDisplay(totalTimerElement, ++totalSeconds);
      }, 1000)
    };
  }

  function updateTimeDisplay(element, seconds) {
    let displaySeconds = seconds % 60;
    let displayMinutes = Math.floor(seconds / 60) % 60;
    let displayHours = Math.floor(seconds / 3600);
    element.textContent = `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  }

  function displayFinishButton() {
    finishButton.classList.remove('hidden');
    finishButton.addEventListener('click', () => {
      clearInterval(workoutTimers[workoutIndex].interval);
      displaySummary();
    });
  }

  function displaySummary() {
  let summaryHTML = `<h2>Workout Summary</h2>`;
  workoutTimers.forEach((timer, index) => {
    if (!skippedWorkouts.includes(selectedExercises[index].name)) { // Use 'name' property
      let workoutTime = `${Math.floor(timer.seconds / 3600)}h ${Math.floor((timer.seconds % 3600) / 60)}m ${timer.seconds % 60}s`;
      summaryHTML += `<p>${selectedExercises[index].name}: ${workoutTime}</p>`; // Use 'name' property
    }
  });

  summary.innerHTML = summaryHTML;
  summary.classList.remove('hidden');
}

});
