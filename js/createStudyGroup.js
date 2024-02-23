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
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
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