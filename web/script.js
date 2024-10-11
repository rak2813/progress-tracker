const API_BASE_URL = 'https://painful-merna-rak2813-5768956c.koyeb.app';
// const API_BASE_URL = 'http://localhost';

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

    if (exercisesContainer && addExerciseButton) {
        // Event listener for adding a new exercise
        addExerciseButton.addEventListener('click', async function () {
            await addExercise(exercisesContainer); 
        });}
});

// Function to save session data to the backend
async function saveSession(sessionData) {
    const sessionId = getSessionIdFromUrl();
    let response;
    if(sessionId== null){
    response = await fetch(`${API_BASE_URL}/session`, { // Adjust the URL as needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    });}else{
        response = await fetch(`${API_BASE_URL}/session/${sessionId}`, { // Adjust the URL as needed
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
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}`); // Fetch session data
    const sessionData = await response.json(); // Parse JSON response

    // Populate form fields with session data
    document.getElementById('sessionDate').value = sessionData.date.slice(0, 10);
    document.getElementById('bodyweight').value = sessionData.bodyWeight;
    // document.getElementById('workoutTypeSelect').value = sessionData.workoutType;
    document.querySelector('#workoutType select').value = sessionData.workoutType;

    const exercisesContainer = document.getElementById('exercisesContainer');
    const response2 = await fetch(`${API_BASE_URL}/exercise`);
    const availableExercises = await response2.json();

    sessionData.workout.forEach(async exercise => {
        const newExerciseDiv = await addExercise(exercisesContainer);
        const exerciseDropdown = newExerciseDiv.querySelector('select');
        const setsContainer = newExerciseDiv.querySelector('.setsContainer');

        // Populate exercise and sets
        exerciseDropdown.value = exercise.name;
        const maxWeight = availableExercises.find(ex => ex.name === exercise.name).maxWeight;
        const maxWeightReps = availableExercises.find(ex => ex.name === exercise.name).maxReps;
        const lastWeight = availableExercises.find(ex => ex.name === exercise.name).lastWeight;
        const lastWeightReps = availableExercises.find(ex => ex.name === exercise.name).lastReps;
        const maxWeightNode = document.createTextNode(`Max: ${maxWeight}kg x ${maxWeightReps}`);
        const lastWeightNode = document.createTextNode(` | Last: ${lastWeight}kg x ${lastWeightReps}`);
        newExerciseDiv.appendChild(maxWeightNode);
        newExerciseDiv.appendChild(lastWeightNode);

        exerciseDropdown.addEventListener('change', async () => {
            maxWeightNode.deleteData(0, maxWeightNode.length);
            lastWeightNode.deleteData(0, lastWeightNode.length);

            const selectedExercise = exerciseDropdown.value;
            maxWeight = availableExercises.find(ex => ex.name === selectedExercise.name).maxWeight;
            maxWeightReps = availableExercises.find(ex => ex.name === selectedExercise.name).maxReps;
            lastWeight = availableExercises.find(ex => ex.name === selectedExercise.name).lastWeight;
            lastWeightReps = availableExercises.find(ex => ex.name === selectedExercise.name).lastReps;
        });

        

        exercise.sets.forEach(async set => {
            const setDiv = await addSet(setsContainer);
            setDiv.querySelector('input[placeholder="Reps"]').value = set.reps;
            setDiv.querySelector('input[placeholder="Weight (kg)"]').value = set.weight;
        });
    });

    
}

// Call populateSessionDetails when the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', populateSessionDetails);


// Fetch and list all sessions
async function getSessions() {
    try {
        const response = await fetch(`${API_BASE_URL}/session`); // Adjust the URL to your backend
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

            const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = '-';
        deleteButton.classList.add('deleteButton');
        li.appendChild(deleteButton);

        deleteButton.addEventListener('click', async () => {
            const response = await fetch(`${API_BASE_URL}/session/${session._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                sessionsList.removeChild(li);
            } else {
                console.error('Error deleting session:', response.statusText);
            }
        });

            
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

// if(window.location.pathname.includes('session-detail.html')){
//     window.onload = populateSessionDetails;
// }

if (window.location.pathname.includes('session-detail.html')) {
    window.onload = () => {
        populateSessionDetails(); // Call function every time the page loads or refreshes
    };
}




// Get exercises and display them
async function getExercises() {
    const response = await fetch(`${API_BASE_URL}/exercise`); // Adjust the URL as needed
    const exercises = await response.json();

    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = ''; // Clear the list
    var count = 1;
    exercises.forEach((exercise) => {
        const li = document.createElement('li');
        li.textContent = `${count++}. ${exercise.name}`;
        exerciseList.appendChild(li);

        const maxText = document.createTextNode(` | Max: ${exercise.maxWeight || '0'} kg x ${exercise.maxReps || '0'}`);
        const lastText = document.createTextNode(` | Last: ${exercise.lastWeight || '0'} kg x ${exercise.lastReps || '0'}`);
        // Append the text node to the list item
        li.appendChild(maxText);
        li.appendChild(lastText);

        // const deleteButton = document.createElement('button');
        // deleteButton.type = 'button';
        // deleteButton.textContent = '-';
        // deleteButton.classList.add('deleteButton');
        // li.appendChild(deleteButton);

        // deleteButton.addEventListener('click', async () => {
        //     const response = await fetch(`${API_BASE_URL}/exercise/${exercise._id}`, {
        //         method: 'DELETE',
        //     });

        //     if (response.ok) {
        //         exerciseList.removeChild(li);
        //     } else {
        //         console.error('Error deleting exercise:', response.statusText);
        //     }
        // });

    });
}

// Call these functions on page load for 'Get Sessions' and 'Get Exercises' pages
if (window.location.pathname.includes('get-sessions.html')) {
    window.onload = getSessions;
}
if (window.location.pathname.includes('get-exercises.html')) {
    window.onload = getExercises;
}

if(window.location.pathname.includes('add-exercise.html')){document.getElementById('addExercise').addEventListener('submit', async (event) => {

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
        const response = await fetch(`${API_BASE_URL}/exercise`, { // Adjust the URL as needed
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
});}


async function addSet(setsContainer) {
    const setDiv = document.createElement('div');
    setDiv.classList.add('set');

    // Weight input
    const weightInput = document.createElement('input');
    weightInput.type = 'float';
    weightInput.placeholder = 'Weight (kg)';
    weightInput.required = true;

    // Reps input
    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.placeholder = 'Reps';
    repsInput.required = true;

    // Add delete set button
    const deleteSetButton = document.createElement('button');
    deleteSetButton.type = 'button';
    deleteSetButton.textContent = '-';
    deleteSetButton.classList.add('deleteSetButton');

    // Append inputs and delete button to the set div
    setDiv.appendChild(weightInput);
    setDiv.appendChild(repsInput);
    setDiv.appendChild(deleteSetButton);

    // Append the set div to the sets container
    setsContainer.appendChild(setDiv);

    // Event listener for the "Delete Set" button
    deleteSetButton.addEventListener('click', () => {
        setsContainer.removeChild(setDiv);
    });
    return setDiv;
}

async function addExercise(exercisesContainer) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise');

    // Add the exercise dropdown
    const exerciseDropdown = document.createElement('select');
    exerciseDropdown.required = true;
    // List of available exercises
    const response = await fetch(`${API_BASE_URL}/exercise`);
    const availableExercises = await response.json();
    exerciseDropdown.innerHTML = `
        <option value="" disabled selected>Select Exercise</option>
        ${availableExercises.map(exercise => `<option value="${exercise.name}">${exercise.name}</option>`).join('')}
    `;
    exerciseDiv.appendChild(exerciseDropdown);

    exerciseDropdown.addEventListener('change', async () => {
        const selectedExercise = exerciseDropdown.value;
    
        // Remove any existing stats wrapper before adding new data
        const existingStats = exerciseDiv.querySelector('.exercise-stats');
        if (existingStats) {
            exerciseDiv.removeChild(existingStats);
        }
    
        const exercise = availableExercises.find(exercise => exercise.name === selectedExercise);
        if (exercise) {
            // Create a wrapper to hold the max and last weight info
            const statsWrapper = document.createElement('div');
            statsWrapper.classList.add('exercise-stats');
    
            const maxWeight = document.createTextNode(`Max: ${exercise.maxWeight}kg x ${exercise.maxReps}`);
            const lastWeight = document.createTextNode(` | Last: ${exercise.lastWeight}kg x ${exercise.lastReps}`);
    
            statsWrapper.appendChild(maxWeight);
            statsWrapper.appendChild(lastWeight);
            exerciseDiv.appendChild(statsWrapper);
        }
    });
    

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
    return exerciseDiv;
}


