document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.day-button');

    // Disable all buttons except Day 1
    for (let i = 1; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // Fetch progress data from XML file
    fetch('oldschool/old_school_progress.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const progressData = parseXML(xmlDoc);
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
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const dayNumber = i + 1;
            if (progressData.includes(`day${dayNumber}`)) {
                button.disabled = false;
                button.classList.remove('locked');
                button.addEventListener("click", function() {
                    if (i < buttons.length - 1 && buttons[i + 1].classList.contains('locked')) {
                        buttons[i + 1].classList.remove('locked');
                        buttons[i + 1].disabled = false;
                    }
                });
            }
        }
    }
});
