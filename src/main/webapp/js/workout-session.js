document.addEventListener('DOMContentLoaded', function() {
    const selectedDay = localStorage.getItem('selectedDay');
    
    // Simplified XML structure for testing
    const xmlString = `
        <workouts>
            <day id="1">
                <workout>
                    <name>Push-ups</name>
                    <sets>3</sets>
                    <reps>15</reps>
                </workout>
                <workout>
                    <name>Squats</name>
                    <sets>3</sets>
                    <reps>12</reps>
                </workout>
                <!-- Add more workouts for Day 1 -->
            </day>
            <day id="2">
                <workout>
                    <name>Plank</name>
                    <sets>3</sets>
                    <reps>30 seconds</reps>
                </workout>
                <workout>
                    <name>Running</name>
                    <sets>1</sets>
                    <reps>30 minutes</reps>
                </workout>
                <!-- Add more workouts for Day 2 -->
            </day>
            <day id="3">
                <workout>
                    <name>Crunches</name>
                    <sets>3</sets>
                    <reps>20</reps>
                </workout>
                <workout>
                    <name>Lunges</name>
                    <sets>3</sets>
                    <reps>10 each leg</reps>
                </workout>
                <!-- Add more workouts for Day 3 -->
            </day>
            <!-- Add more days up to Day 30 -->
        </workouts>
    `;
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    
    const dayElement = xmlDoc.querySelector(`day[id="${selectedDay}"]`);
    if (!dayElement) {
        console.error(`Workouts not found for day ${selectedDay}.`);
        return;
    }

    let workouts = [];
    dayElement.querySelectorAll('workout').forEach(workout => {
        workouts.push({
            name: workout.querySelector('name').textContent,
            sets: workout.querySelector('sets').textContent,
            reps: workout.querySelector('reps').textContent
        });
    });

    let currentWorkoutIndex = 0;
    let totalWorkoutTimer;
    let currentWorkoutTimer;
    let totalWorkoutTime = 0;
    let workoutStartTime;
    let workoutTimers = []; // Array to store individual workout times

    const workoutDetailsContainer = document.getElementById('workout-details');
    const startWorkoutBtn = document.getElementById('start-workout');
    const doneWorkoutBtn = document.getElementById('done-workout');
    const skipWorkoutBtn = document.getElementById('skip-workout');
    const finishWorkoutBtn = document.getElementById('finish-workout');
    const currentWorkoutName = document.getElementById('current-workout-name');
    const currentWorkoutTimerDisplay = document.getElementById('current-workout-timer');
    const totalWorkoutTimerDisplay = document.getElementById('total-workout-timer');

    function displayWorkoutDetails() {
        let workoutListHTML = '<h3>Workout Details:</h3><ul>';
        workouts.forEach((workout, index) => {
            workoutListHTML += `<li><strong>${workout.name}</strong>: ${workout.sets} sets of ${workout.reps}</li>`;
        });
        workoutListHTML += '</ul>';
        workoutDetailsContainer.innerHTML = workoutListHTML;
    }

    function startWorkout() {
        if (currentWorkoutIndex < workouts.length) {
            const workout = workouts[currentWorkoutIndex];
            currentWorkoutName.textContent = workout.name;
            currentWorkoutTimerDisplay.textContent = '00:00'; // Reset current workout timer display
            totalWorkoutTimerDisplay.style.display = 'block'; // Show total workout timer
            currentWorkoutTimerDisplay.style.display = 'block'; // Show current workout timer
            workoutDetailsContainer.innerHTML = `
                <h3>Current Workout:</h3>
                <p><strong>${workout.name}</strong></p>
                <p>Sets: ${workout.sets}</p>
                <p>Reps: ${workout.reps}</p>
            `;
            startCurrentWorkoutTimer();
            showControls();
        }
    }

    function showControls() {
        if (currentWorkoutIndex === workouts.length - 1) {
            finishWorkoutBtn.style.display = 'inline-block';
            startWorkoutBtn.style.display = 'none';
            doneWorkoutBtn.style.display = 'none';
            skipWorkoutBtn.style.display = 'none';
        } else {
            finishWorkoutBtn.style.display = 'none';
            startWorkoutBtn.style.display = 'none';
            doneWorkoutBtn.style.display = 'inline-block';
            skipWorkoutBtn.style.display = 'inline-block';
        }
    }

    function startTotalWorkoutTimer() {
        totalWorkoutTime = 0;
        totalWorkoutTimerDisplay.textContent = `Total Time: ${formatTime(totalWorkoutTime)}`;
        totalWorkoutTimer = setInterval(function() {
            totalWorkoutTime++;
            totalWorkoutTimerDisplay.textContent = `Total Time: ${formatTime(totalWorkoutTime)}`;
        }, 1000);
    }

    function startCurrentWorkoutTimer() {
        workoutStartTime = Date.now();
        updateCurrentWorkoutTimer(); // Update immediately upon starting
        currentWorkoutTimer = setInterval(updateCurrentWorkoutTimer, 1000);
    }

    function updateCurrentWorkoutTimer() {
        const elapsedTime = Math.floor((Date.now() - workoutStartTime) / 1000);
        currentWorkoutTimerDisplay.textContent = `Time: ${formatTime(elapsedTime)}`;
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }

    startWorkoutBtn.addEventListener('click', function() {
        startWorkout();
        startTotalWorkoutTimer(); // Start the total workout timer
        startWorkoutBtn.style.display = 'none'; // Hide 'Start Workout' button after clicking
        doneWorkoutBtn.style.display = 'inline-block'; // Show 'Done' button
        skipWorkoutBtn.style.display = 'inline-block'; // Show 'Skip' button
    });

    doneWorkoutBtn.addEventListener('click', function() {
        clearInterval(currentWorkoutTimer);
        const elapsedTime = Math.floor((Date.now() - workoutStartTime) / 1000);
        workoutTimers.push(elapsedTime); // Store the time for this workout
        currentWorkoutIndex++;
        if (currentWorkoutIndex < workouts.length) {
            startWorkout();
        } else {
            showControls();
        }
    });

    skipWorkoutBtn.addEventListener('click', function() {
        currentWorkoutIndex++;
        if (currentWorkoutIndex < workouts.length) {
            startWorkout();
        } else {
            showControls();
        }
    });

    finishWorkoutBtn.addEventListener('click', function() {
        clearInterval(currentWorkoutTimer);
        clearInterval(totalWorkoutTimer); // Stop the total workout timer
        finishWorkoutBtn.disabled = true; // Disable the Finish Workout button
        const elapsedTime = Math.floor((Date.now() - workoutStartTime) / 1000);
        workoutTimers.push(elapsedTime); // Store the time for the last workout
        const caloriesBurnt = Math.floor(totalWorkoutTime / 60) * 5;
        let summary = `Workout Summary:\n`;
        workouts.forEach((workout, index) => {
            const workoutTime = workoutTimers[index] || 0; // Use 0 if workout was skipped
            summary += `${workout.name}: ${formatTime(workoutTime)}\n`;
        });
        summary += `Total Time: ${formatTime(totalWorkoutTime)}\n`;
        summary += `Calories Burnt: ${caloriesBurnt}`;
        alert(summary);
    });

    // Initial setup
    totalWorkoutTimerDisplay.style.display = 'none'; // Hide total workout timer initially
    currentWorkoutTimerDisplay.style.display = 'none'; // Hide current workout timer initially
    showControls(); // Initially hide 'Done' and 'Skip' buttons
    doneWorkoutBtn.style.display = 'none'; // Hide 'Done' button initially
    skipWorkoutBtn.style.display = 'none'; // Hide 'Skip' button initially
    startWorkoutBtn.style.display = 'inline-block'; // Show 'Start Workout' button initially
    
    displayWorkoutDetails(); // Display workout details initially
});
