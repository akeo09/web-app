document.addEventListener('DOMContentLoaded', function() {    
    const createStudyGroupForm = document.getElementById('studyGroupForm');
    
    createStudyGroupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const meetingTimes = [];
        for(let i = 1; i < meetingTimeIndex; i++) {
            const day = document.getElementById(`day${i}`).value;
            const time = document.getElementById(`time${i}`).value;
            const location = document.getElementById(`location${i}`).value;

            meetingTimes.push({ day, time, location });
        }

        const studyGroupData = {
            name: document.getElementById('name').value,
            is_public: document.getElementById('public').checked,
            max_participants: document.getElementById('maxParticipants').value,
            start_date: document.getElementById('startDate').value,
            end_date: document.getElementById('endDate').value,
            /*meeting_times: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(day => ({
                day: day.value,
                time: document.getElementById('time').value,
                location: document.getElementById('location').value
            })),*/
            meeting_times: meetingTimes,
            description: document.getElementById('description').value,
            school: document.getElementById('school').value,
            course_number: document.getElementById('courseNum').value,
        };

        createGroup(studyGroupData);
    });

    const addMeetingTimeBtn = document.getElementById('addMeetingTime');
    const meetingTimesContainer = document.getElementById('meetingTimesContainer');

    let meetingTimeIndex = 1;

    addMeetingTimeBtn.addEventListener('click', function() {
        meetingTimeIndex++;

        const meetingTimeDiv = document.createElement('div');
        meetingTimeDiv.classList.add('meeting-time');

        meetingTimeDiv.innerHTML = `
            <label for="day${meetingTimeIndex}">Day:</label>
            <input type="text" id="day${meetingTimeIndex}" name="day${meetingTimeIndex}" required>
            <label for="time${meetingTimeIndex}">Time:</label>
            <input type="time" id="time${meetingTimeIndex}" name="time${meetingTimeIndex}" required>
            <label for="location${meetingTimeIndex}">Location:</label>
            <input type="text" id="location${meetingTimeIndex}" name="location${meetingTimeIndex}" required>
            `;

        meetingTimesContainer.appendChild(meetingTimeDiv);
    })

    async function createGroup(studyGroupData) {
        const token = localStorage.getItem('token');

        const url = "https://study-api-server.azurewebsites.net/studygroup";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(studyGroupData)
            });
            
            console.log('Response status:', response.status);
            //const data = await response.json();
            //console.log('Response data:', data);

            if (response.ok) {
                alert("group created");
                window.location.href = '../pages/studyGroup/studyGroup.html';
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error creating group: ', error);
            alert('Unable to create group');
        };
    };
});