// // Logging a new session
document.getElementById('sessionForm')?.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get session date and bodyweight
    const sessionDate = document.getElementById('sessionDate').value;
    const bodyweight = parseFloat(document.getElementById('bodyweight').value);
    const workoutType = document.querySelector('#workoutType select').value;
    console.log(workoutType);

    // Create an array to hold all workouts (exercises with sets)
    const workout = [];

    // Get all exercises from the container
    const exerciseDivs = document.querySelectorAll('.exercise');
    exerciseDivs.forEach(exerciseDiv => {
        // Get the selected exercise name
        const exerciseName = exerciseDiv.querySelector('select').value;

        // Collect all sets for this exercise
        const sets = [];
        const setDivs = exerciseDiv.querySelectorAll('.set');
        setDivs.forEach(setDiv => {
            const reps = parseInt(setDiv.querySelector('input[placeholder="Reps"]').value);
            const weight = parseFloat(setDiv.querySelector('input[placeholder="Weight (kg)"]').value);
            sets.push({ reps, weight });
        });

        // Add the exercise and its sets to the workout array
        workout.push({ name: exerciseName, sets });
    });

    // Create session data
    const sessionData = {
        date: sessionDate,
        bodyWeight: bodyweight,
        workoutType: workoutType,
        workout: workout, // Add the workout array to the session data
    };

    // Save session to the backend
    await saveSession(sessionData);

    // Clear the form after submission
    document.getElementById('sessionForm').reset();
    document.getElementById('exercisesContainer').innerHTML = ''; // Clear all added exercises
});

document.addEventListener('DOMContentLoaded', async function () {
    const exercisesContainer = document.getElementById('exercisesContainer');
    const addExerciseButton = document.getElementById('addExerciseButton');

    // Event listener for adding a new exercise
    addExerciseButton.addEventListener('click', addExercise(exercisesContainer));
});

// Function to save session data to the backend
async function saveSession(sessionData) {
    const sessionId = getSessionIdFromUrl();
    let response;
    if(sessionId== null){
    response = await fetch('http://localhost:3000/session', { // Adjust the URL as needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    });}else{
        response = await fetch(`http://localhost:3000/session/${sessionId}`, { // Adjust the URL as needed
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });
    }

    if (response.ok) {
        console.log('Session saved successfully!');
    } else {
        console.error('Error saving session:', response.statusText);
    }
}

function getSessionIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sessionId'); // Assuming the ID is passed as a query parameter
}

//Update session
async function populateSessionDetails() {
    const sessionId = getSessionIdFromUrl(); // Get the session ID from the URL
    const response = await fetch(`http://localhost:3000/session/${sessionId}`); // Fetch session data
    const sessionData = await response.json(); // Parse JSON response

    // Populate form fields with session data
    document.getElementById('sessionDate').value = sessionData.date.slice(0, 10);
    document.getElementById('bodyweight').value = sessionData.bodyWeight;
    // document.getElementById('workoutTypeSelect').value = sessionData.workoutType;
    document.querySelector('#workoutType select').value = sessionData.workoutType;

    const exercisesContainer = document.getElementById('exercisesContainer');
    const response2 = await fetch('http://localhost:3000/exercise');
    const availableExercises = await response2.json();

    sessionData.workout.forEach(exercise => {
        addExercise(exercisesContainer);
        const exerciseDropdown = exercisesContainer.querySelector('select');
        const setsContainer = exercisesContainer.querySelector('.setsContainer');

        // Populate exercise and sets
        exerciseDropdown.value = exercise.name;

        exercise.sets.forEach(set => {
            const setDiv = document.createElement('div');
        setDiv.classList.add('set');

        // Reps input
        const repsInput = document.createElement('input');
        repsInput.type = 'number';
        repsInput.placeholder = 'Reps';
        repsInput.min = 1;
        repsInput.required = true;

        // Weight input
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.placeholder = 'Weight (kg)';
        weightInput.min = 1;
        weightInput.required = true;

        // Add delete set button
        const deleteSetButton = document.createElement('button');
        deleteSetButton.type = 'button';
        deleteSetButton.textContent = '-';
        deleteSetButton.classList.add('deleteSetButton');

        // Append inputs and delete button to the set div
        setDiv.appendChild(repsInput);
        setDiv.appendChild(weightInput);
        setDiv.appendChild(deleteSetButton);

        // Append the set div to the sets container
        setsContainer.appendChild(setDiv);

        // Event listener for the "Delete Set" button
        deleteSetButton.addEventListener('click', () => {
            setsContainer.removeChild(setDiv);
        });
            setDiv.querySelector('input[placeholder="Reps"]').value = set.reps;
            setDiv.querySelector('input[placeholder="Weight (kg)"]').value = set.weight;
        });
    });

    
}

// Call populateSessionDetails when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateSessionDetails);


// Fetch and list all sessions
async function getSessions() {
    try {
        const response = await fetch('http://localhost:3000/session'); // Adjust the URL to your backend
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const sessions = await response.json();

        const sessionsList = document.getElementById('sessionsList');
        sessionsList.innerHTML = ''; // Clear any existing content

        // If no sessions are found, display a message
        if (sessions.length === 0) {
            sessionsList.innerHTML = '<li>No sessions found</li>';
            return;
        }

        // Loop through each session and add it as a clickable link
        sessions.forEach((session) => {
            const li = document.createElement('li');

            // Create a link element
            const link = document.createElement('a');
            link.href = `session-detail.html?sessionId=${session._id}`; // Pass session ID in the URL
            link.textContent = `${session.workoutType} - ${new Date(session.date).toDateString()}`; // Customize as needed

            li.appendChild(link);
            sessionsList.appendChild(li);
        });

    } catch (error) {
        console.error('Error fetching sessions:', error);
        const sessionsList = document.getElementById('sessionsList');
        sessionsList.innerHTML = '<li>Error loading sessions. Please try again later.</li>';
    }
}

// Call this function when the page loads
if (window.location.pathname.includes('get-sessions.html')) {
    window.onload = getSessions;
}


// Call this function when the page loads
if (window.location.pathname.includes('get-sessions.html')) {
    window.onload = getSessions;
}


// Get exercises and display them
async function getExercises() {
    const response = await fetch('http://localhost:3000/exercise'); // Adjust the URL as needed
    const exercises = await response.json();

    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = ''; // Clear the list
    var count = 1;
    exercises.forEach((exercise) => {
        const li = document.createElement('li');
        li.textContent = `${count++}. ${exercise.name}`;
        exerciseList.appendChild(li);
    });
}

// Call these functions on page load for 'Get Sessions' and 'Get Exercises' pages
if (window.location.pathname.includes('get-sessions.html')) {
    window.onload = getSessions;
}
if (window.location.pathname.includes('get-exercises.html')) {
    window.onload = getExercises;
}

document.getElementById('addExercise').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get values from the form
    const exerciseName = document.getElementById('exerciseName').value;

    // Create the exercise object
    const exerciseData = {
        name: exerciseName,
    };
    const messageContainer = document.getElementById('message');
    messageContainer.textContent = '';


    try {
        const response = await fetch('http://localhost:3000/exercise', { // Adjust the URL as needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exerciseData)
        });

        if (response.ok) {
            const result = await response.json();
            messageContainer.textContent = 'Exercise added successfully!'; 
            messageContainer.style.color = 'green'; // Success message
            console.log(result); // Log the response from the server
        } else {
            messageContainer.textContent = 'Failed to add exercise.'; // Error message
            messageContainer.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error); // Log any errors
    }

    // Clear the form
    document.getElementById('addExercise').reset();
});


function addSet(setsContainer) {
    const setDiv = document.createElement('div');
    setDiv.classList.add('set');

    // Reps input
    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.placeholder = 'Reps';
    repsInput.min = 1;
    repsInput.required = true;

    // Weight input
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.placeholder = 'Weight (kg)';
    weightInput.min = 1;
    weightInput.required = true;

    // Add delete set button
    const deleteSetButton = document.createElement('button');
    deleteSetButton.type = 'button';
    deleteSetButton.textContent = '-';
    deleteSetButton.classList.add('deleteSetButton');

    // Append inputs and delete button to the set div
    setDiv.appendChild(repsInput);
    setDiv.appendChild(weightInput);
    setDiv.appendChild(deleteSetButton);

    // Append the set div to the sets container
    setsContainer.appendChild(setDiv);

    // Event listener for the "Delete Set" button
    deleteSetButton.addEventListener('click', () => {
        setsContainer.removeChild(setDiv);
    });
}

async function addExercise(exercisesContainer) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise');

    // Add the exercise dropdown
    const exerciseDropdown = document.createElement('select');
    exerciseDropdown.required = true;
    // List of available exercises
    const response = await fetch('http://localhost:3000/exercise');
    const availableExercises = await response.json();
    exerciseDropdown.innerHTML = `
        <option value="" disabled selected>Select Exercise</option>
        ${availableExercises.map(exercise => `<option value="${exercise.name}">${exercise.name}</option>`).join('')}
    `;
    exerciseDiv.appendChild(exerciseDropdown);

    // Add container for sets
    const setsContainer = document.createElement('div');
    setsContainer.classList.add('setsContainer');
    exerciseDiv.appendChild(setsContainer);

    // Add "Add Set" button
    const addSetButton = document.createElement('button');
    addSetButton.type = 'button';
    addSetButton.textContent = '+ Add Set';
    addSetButton.classList.add('addSetButton');
    exerciseDiv.appendChild(addSetButton);

    // Add "Delete Exercise" button
    const deleteExerciseButton = document.createElement('button');
    deleteExerciseButton.type = 'button';
    deleteExerciseButton.textContent = 'Delete Exercise';
    deleteExerciseButton.classList.add('deleteExerciseButton');
    exerciseDiv.appendChild(deleteExerciseButton);

    // Append the entire exercise section to the container
    exercisesContainer.appendChild(exerciseDiv);

    // Event listener for the "Add Set" button
    addSetButton.addEventListener('click', () => {
        addSet(setsContainer);
    });

    // Event listener for the "Delete Exercise" button
    deleteExerciseButton.addEventListener('click', () => {
        exercisesContainer.removeChild(exerciseDiv);
    });
}


