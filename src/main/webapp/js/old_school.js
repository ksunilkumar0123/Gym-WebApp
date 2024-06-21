function toggleDay(dayNumber) {
    var dayDetails = document.getElementById('day' + dayNumber);
    if (dayDetails.style.display === 'none') {
        dayDetails.style.display = 'block';
    } else {
        dayDetails.style.display = 'none';
    }
}
