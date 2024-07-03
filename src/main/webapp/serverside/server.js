const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the webapp directory
app.use(express.static(path.join(__dirname, '..', 'webapp')));

app.get('/custom_workouts_list.json', (req, res) => {
  const filePath = path.join(__dirname, 'custom_workouts', 'custom_workouts_list.json');
  console.log('Serving JSON file from:', filePath);
  res.sendFile(filePath);
});

app.post('/saveWorkout', (req, res) => {
  const workoutData = req.body;
  console.log('Received workout data:', workoutData);

  const filePath = path.join(__dirname, 'custom_workouts', 'custom_workouts_list.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file.');
    }

    let workouts = [];
    try {
      workouts = JSON.parse(data);
      console.log('Existing workouts:', workouts);
    } catch (e) {
      console.log('Error parsing JSON, initializing with empty array.');
      workouts = [];
    }

    const isDuplicate = workouts.some(workout => workout.name === workoutData.name);
    if (isDuplicate) {
      return res.status(400).send('Workout with this name already exists.');
    }

    workouts.push(workoutData);
    console.log('Workouts after push:', workouts);

    fs.writeFile(filePath, JSON.stringify(workouts, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing to the file.');
      }
      res.status(200).send('Workout saved successfully!');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
