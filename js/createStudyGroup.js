document.addEventListener('DOMContentLoaded', function() {    
    const createStudyGroupForm = document.getElementById('studyGroupForm');
    
    createStudyGroupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        /*const token = localStorage.getItem('token');
        console.log ("token: " + token);
        if(!token) {
            alert('you must be logged in first');
            return;
        }
        */
        const studyGroupData = {
            name: document.getElementById('name').value,
            isPublic: document.getElementById('public').checked,
            maxParticipants: document.getElementById('maxParticipants').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            meeting_times: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(day => ({
                day: day.value,
                time: document.getElementById('time').value,
                location: document.getElementById('location').value
            })),
            description: document.getElementById('description').value,
            school: document.getElementById('school').value,
            courseNum: document.getElementById('courseNum').value,
            participants: document.getElementById('participants').value
        };

        createGroup(studyGroupData);
    });
    async function createGroup(studyGroupData) {
        const url = "https://study-api-server.azurewebsites.net/studygroup";
        
        const token = localStorage.getItem('token');
        console.log ("token: " + token);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(studyGroupData)
            });
            
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
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


/*document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token')
    const createStudyGroupForm = document.getElementById('studyGroupForm');

    createStudyGroupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const isPublic = document.getElementById('public').checked;
        const maxParticipants = document.getElementById('maxParticipants').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const days = document.getElementById('days').value;
        const time = document.getElementById('time').value;
        const description = document.getElementById('description').value;
        const school = document.getElementById('school').value;
        const courseNum = document.getElementById('courseNum').value;
        const participants = document.getElementById('participants').value;

        const studyGroupData = {
            name: name,
            public: isPublic,
            maxParticipants: maxParticipants,
            startDate: startDate,
            endDate: endDate,
            days: [days],
            time: time,
            description: description,
            school: school,
            courseNum: courseNum,
            participants: participants
        };

        createStudyGroup(studyGroupData);
    });

    async function createStudyGroup(studyGroupData) {
        const url = "https://study-api-server.azurewebsites.net/studygroup";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(studyGroupData)
            });

            if (response.ok) {
                createStudyGroupMessage.textContent = 'Verification email has been sent to ' + userData.email;
                createStudyGroupMessage.style.color = 'green';
                createStudyGroupForm.reset();
            } else {
                createStudyGroupMessage.textContent = 'Verification email has been sent to ' + userData.email;
                createStudyGroupMessage.style.color = 'green';
                createStudyGroupForm.reset();
            }
        } catch (error) {

        }
    }
})
 const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

*/

