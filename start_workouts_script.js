document.addEventListener('DOMContentLoaded', function() {
  const selectedExercises = JSON.parse(localStorage.getItem('selectedExercises')) || [];
  const workoutList = document.getElementById('workoutList');
  const summary = document.getElementById('summary');
  const finishButton = document.getElementById('finishButton');
  const totalTimerElement = document.getElementById('totalTimer');
  const homeButton = document.getElementById('homeButton');

  let totalSeconds = 0;
  let workoutIndex = 0;
  let workoutTimers = [];

  // Total timer
  const totalInterval = setInterval(() => {
    totalSeconds++;
    updateTimeDisplay(totalTimerElement, totalSeconds);
  }, 1000);

  selectedExercises.forEach((exercise, index) => {
    const workoutDiv = document.createElement('div');
    workoutDiv.innerHTML = `
      <h2>${exercise}</h2>
      <div class="workout-timer" id="workout-timer-${index}">00:00:00</div>
      <button class="completeBtn" id="completeBtn-${index}" ${index === 0 ? '' : 'disabled'}>Complete</button>
    `;
    workoutList.appendChild(workoutDiv);

    workoutTimers.push({
      timerElement: document.getElementById(`workout-timer-${index}`),
      seconds: 0,
      interval: null
    });
  });

  function startWorkoutTimer(index) {
    workoutTimers[index].interval = setInterval(() => {
      workoutTimers[index].seconds++;
      updateTimeDisplay(workoutTimers[index].timerElement, workoutTimers[index].seconds);
    }, 1000);
  }

  function updateTimeDisplay(element, seconds) {
    let displaySeconds = seconds % 60;
    let displayMinutes = Math.floor(seconds / 60) % 60;
    let displayHours = Math.floor(seconds / 3600);
    element.textContent = `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  }

  // Start the first workout timer
  startWorkoutTimer(workoutIndex);

  workoutList.addEventListener('click', function(event) {
    if (event.target.classList.contains('completeBtn')) {
      clearInterval(workoutTimers[workoutIndex].interval);
      event.target.disabled = true;
      
      workoutIndex++;
      if (workoutIndex < selectedExercises.length) {
        startWorkoutTimer(workoutIndex);
        document.getElementById(`completeBtn-${workoutIndex}`).disabled = false;
      } else {
        clearInterval(totalInterval);
        displaySummary();
      }
    }
  });

  function displaySummary() {
    let totalTime = `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m ${totalSeconds % 60}s`;
    let caloriesBurned = totalSeconds * 0.1;

    let summaryHTML = `<h2>Workout Summary</h2>`;
    workoutTimers.forEach((timer, index) => {
      let workoutTime = `${Math.floor(timer.seconds / 3600)}h ${Math.floor((timer.seconds % 3600) / 60)}m ${timer.seconds % 60}s`;
      summaryHTML += `<p>${selectedExercises[index]}: ${workoutTime}</p>`;
    });

    summaryHTML += `<p>Total Time: ${totalTime}</p>`;
    summaryHTML += `<p>Calories Burned: ${caloriesBurned.toFixed(2)}</p>`;

    summary.innerHTML = summaryHTML;
    summary.classList.remove('hidden');
  }

  finishButton.addEventListener('click', () => {
    if (workoutIndex < selectedExercises.length) {
      alert('Please complete all workouts first.');
    } else {
      displaySummary();
    }
  });

  homeButton.addEventListener('click', () => {
    if (workoutIndex < selectedExercises.length) {
      if (confirm('Do you want to quit the workout?')) {
        window.location.href = 'index.html';
      }
    } else {
      window.location.href = 'index.html';
    }
  });
});
