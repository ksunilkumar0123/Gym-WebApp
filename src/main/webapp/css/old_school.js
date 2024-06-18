document.addEventListener("DOMContentLoaded", function() {
    // Fetch progress data from XML file
    fetch('oldschool/old_school_progress.xml')
        .then(response => response.text())
        .then(xmlString => {
            // Parse XML data
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const progressData = parseXML(xmlDoc);
            // Enable buttons up to the current day based on XML data
            enableWorkoutDays(progressData);
        })
        .catch(error => console.error('Error fetching or parsing XML file:', error));

    // Function to parse XML and extract day information
    function parseXML(xmlDoc) {
        const days = [];
        const dayNodes = xmlDoc.getElementsByTagName('day');
        for (let i = 0; i < dayNodes.length; i++) {
            const dayNumber = parseInt(dayNodes[i].textContent.trim().replace('day', ''));
            if (!isNaN(dayNumber) && dayNumber > 0 && dayNumber <= 30) {
                days.push(`day${dayNumber}`);
            }
        }
        return days;
    }

    // Function to enable workout days based on progress data
    function enableWorkoutDays(progressData) {
        const buttons = document.querySelectorAll('#workout-buttons button');
        let currentDay = 1;
        for (let dayId of progressData) {
            const dayNumber = parseInt(dayId.substring(3));
            if (dayNumber > 0 && dayNumber <= 30) {
                // Enable the button for this day
                buttons[dayNumber - 1].disabled = false;
                // Update currentDay to the latest enabled day
                currentDay = dayNumber;
            }
        }

        // Add click event listeners to each button
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function() {
                // Only progress if clicking on the next day's button
                if (i === currentDay - 1) {
                    // Update progress to the next day if available
                    if (currentDay < 30) {
                        currentDay++;
                        buttons[currentDay - 1].disabled = false;
                    }
                }
            });
        }
    }
});
