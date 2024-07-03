document.addEventListener('DOMContentLoaded', () => {
  fetch('serverside/custom_workouts/custom_workouts_list.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => displayPlans(data))
    .catch(error => console.error('Error fetching the workout plans:', error));
});

function displayPlans(plans) {
  const plansContainer = document.getElementById('plansContainer');
  plans.forEach(plan => {
    const planElement = document.createElement('div');
    planElement.className = 'plan';
    planElement.textContent = plan.name;
    plansContainer.appendChild(planElement);
  });
}
