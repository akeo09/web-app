document.addEventListener('DOMContentLoaded', function() {    
    const createStudyGroupForm = document.getElementById('studyGroupForm');
    const meetingTimesContainer = document.getElementById('meetingTimesContainer');
    const addMeetingTimeBtn = document.getElementById('addMeetingTime');

    addMeetingTimeBtn.addEventListener('click', function() {
        addMeetingTimes(meetingTimesContainer);
    })

    function addMeetingTimes(container, meeting = {day: '', time: '', location: ''}) {
        const meetingTimeDiv = document.createElement('div');

        meetingTimeDiv.innerHTML = `
        <div class="meetingTime">
            <div class="meeting-time-field">
                <label for="meetingDay">Day:</label>
                <select name="meetingDay" id="meetingDay" name="meetingDay">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
            </div>
            <div class="meeting-time-field">
                <label for="meetingTime">Time</label>
                <input type="time" id="meetingTime" name="meetingTime">
            </div>
            <div class="meeting-time-field">
                <label for="meetingLocation">Location</label>
                <input type="text" id="meetingLocation" name="meetingLocation">
            </div>
            <button type="button" class="deleteMeetingTime">Delete Meeting Time</button>
        </div>
        `;

        container.appendChild(meetingTimeDiv);
    
        const selectElement = meetingTimeDiv.querySelector('select[name="meetingDay"]');
        if (meeting.day) {
            selectElement.value = meeting.day;
        }

        const removeBtn = meetingTimeDiv.querySelector('.deleteMeetingTime');
        removeBtn.addEventListener('click', function() {
            container.removeChild(meetingTimeDiv);
        });
    }

    createStudyGroupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        function getMeetingTimes() {
            const meetingTimeDivs = document.querySelectorAll('.meetingTime');
            const meetingTimes = [];

            meetingTimeDivs.forEach(div => {
                const day = div.querySelector('select[name="meetingDay"]').value;
                const time = div.querySelector('input[name="meetingTime"]').value;
                const location = div.querySelector('input[name="meetingLocation"]').value;
                meetingTimes.push({day, time, location});
            });
            return meetingTimes;
        ;}

        const studyGroupData = {
            name: document.getElementById('name').value,
            is_public: document.getElementById('public').checked,
            max_participants: document.getElementById('maxParticipants').value,
            start_date: document.getElementById('startDate').value,
            end_date: document.getElementById('endDate').value,
            meeting_times: getMeetingTimes(),
            description: document.getElementById('description').value,
            school: document.getElementById('school').value,
            course_number: document.getElementById('courseNum').value,
        };

        createGroup(studyGroupData);
    });

    async function createGroup(studyGroupData) {
        const token = localStorage.getItem('token');

        //const url = "https://study-api-server.azurewebsites.net/studygroup";
        const url = "http://localhost:3000/studygroup";

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

            if (response.ok) {
                console.log('group create successfully');
                alert("group created");
                console.log('redirection to studyGroup.html...')
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