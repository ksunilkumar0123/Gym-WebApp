document.addEventListener('DOMContentLoaded', function() {
  const hiitSession = document.getElementById('session-info');
  const restSession = document.getElementById('rest-info');
  const nextWorkoutSection = document.getElementById('next-workout');

  let workouts = [];
  let currentWorkoutIndex = 0;
  let workoutTimer;
  let restTimer;

  function startHIITSession() {
    // Retrieve workouts from localStorage
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      workouts = JSON.parse(storedWorkouts);
    } else {
      alert('No workouts found. Add workouts before starting the session.');
      return;
    }

    hiitSession.classList.remove('hidden');

    showNextWorkout();

    // Initial countdown before starting the first workout
    let countdown = 10;
    const countdownInterval = setInterval(() => {
      document.getElementById('workoutTimer').textContent = countdown;
      countdown--;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        startWorkout();
      }
    }, 1000);
  }

  function startWorkout() {
    const currentWorkout = workouts[currentWorkoutIndex];
    document.getElementById('currentWorkoutName').textContent = currentWorkout.name;

    let timeLeft = currentWorkout.time;
    workoutTimer = setInterval(() => {
      document.getElementById('workoutTimer').textContent = timeLeft;
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(workoutTimer);
        showRestInterval();
      }
    }, 1000);
  }

  function showRestInterval() {
    restSession.classList.remove('hidden');
    hiitSession.classList.add('hidden');

    const currentWorkout = workouts[currentWorkoutIndex];
    document.getElementById('nextWorkoutName').textContent = workouts[currentWorkoutIndex + 1] ? workouts[currentWorkoutIndex + 1].name : 'Session Complete';

    let timeLeft = currentWorkout.rest;
    restTimer = setInterval(() => {
      document.getElementById('restTimer').textContent = timeLeft;
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(restTimer);
        restSession.classList.add('hidden');
        hiitSession.classList.remove('hidden');

        currentWorkoutIndex++;
        if (currentWorkoutIndex < workouts.length) {
          showNextWorkout();
          startWorkout();
        } else {
          // All workouts completed
          alert('Congratulations! You completed the HIIT session.');
          resetSession();
        }
      }
    }, 1000);
  }

  function showNextWorkout() {
    nextWorkoutSection.classList.remove('hidden');
    const nextWorkout = workouts[currentWorkoutIndex + 1];
    document.getElementById('nextWorkoutName').textContent = nextWorkout ? nextWorkout.name : 'Session Complete';
  }

  function resetSession() {
    hiitSession.classList.add('hidden');
    restSession.classList.add('hidden');
    workouts = [];
    currentWorkoutIndex = 0;
    clearInterval(workoutTimer);
    clearInterval(restTimer);
  }

  // Event listeners for buttons
  document.getElementById('pauseBtn').addEventListener('click', function() {
    clearInterval(workoutTimer);
    document.getElementById('resumeBtn').classList.remove('hidden');
  });

  document.getElementById('resumeBtn').addEventListener('click', function() {
    startWorkout();
    document.getElementById('resumeBtn').classList.add('hidden');
  });

  document.getElementById('pauseRestBtn').addEventListener('click', function() {
    clearInterval(restTimer);
    document.getElementById('resumeRestBtn').classList.remove('hidden');
  });

  document.getElementById('resumeRestBtn').addEventListener('click', function() {
    showRestInterval();
    document.getElementById('resumeRestBtn').classList.add('hidden');
  });

  document.getElementById('skipBtn').addEventListener('click', function() {
    clearInterval(workoutTimer);
    clearInterval(restTimer);
    currentWorkoutIndex++;
    showNextWorkout();
    startWorkout();
  });

  // Start the HIIT session
  startHIITSession();
});
