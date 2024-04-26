document.addEventListener('DOMContentLoaded', function() {    
    const modal = document.getElementById('myModal');
    const instagramModal = document.getElementById('instagramModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const closeInstagramModalBtn = document.getElementById('closeIstagramModal');
    const instagramForm = document.getElementById('instagramForm');

    const createStudyGroupForm = document.getElementById('studyGroupForm');
    const meetingTimesContainer = document.getElementById('meetingTimesContainer');
    const addMeetingTimeBtn = document.getElementById('addMeetingTime');
    
    const userData = JSON.parse(localStorage.getItem('user'));
    const loggedInUserId = userData._id;
    console.log(loggedInUserId)

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

    let studyGroupData;

    createStudyGroupForm.addEventListener('submit', async function (event) {
        event.preventDefault();
                
        modal.style.display = "block";

        function handleResponse(response) {
            modal.style.display = "none";
            if(response) {
                studyGroupData = {
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
            }
            createGroup(studyGroupData);
        }

        yesBtn.onclick = async function() {
            modal.style.display = "none";
            const userInstagramInfo = await getUserInstagramInfo(loggedInUserId);
            console.log(loggedInUserId)
            if (!userInstagramInfo) {
                instagramModal.style.display = "block";
                closeInstagramModalBtn.onclick = function() {
                    modal.style.display = "none";
                }
            } else {
                const studyGroupName = document.getElementById('name').value
                const success = await createPostToInstagram(studyGroupName);
                if (success) {
                    handleResponse(true);
                } else {
                    alert('Unable to post to Instagram')
                }
            }
        }

        noBtn.onclick = function() {
            modal.style.display = "none";
            handleResponse(true);
        }
        
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
        
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
        }
        
    });

    async function getUserInstagramInfo(loggedInUserId) {
        const url = `https://study-api-server.azurewebsites.net/user/insta/${loggedInUserId}`
        //const url = `http://localhost:3000/user/insta/${loggedInUserId}`;
        console.log(loggedInUserId)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                    console.log(data)
    
                    if(data.ig_username || data.ig_password) {
                        return {username: data.ig_username, password: data.ig_password };
                    } else {
                        return null;
                    }
            } else {
                throw new Error('Failed to fetch Instagram information');
            }
        } catch (error) {
            console.error('Error fetching Instagram information:', error);
            alert('Unable to fetch Instagram information');
            return null; // Return null if there's an error
        }
    }

    async function createPostToInstagram(studyGroupName) {
        const token = localStorage.getItem('token')

        const data = {
            caption: `I just created ${studyGroupName}!`,
            image_url: "https://as2.ftcdn.net/v2/jpg/04/09/80/39/1000_F_409803938_ZMkBERWVXCcLZjz1NTnKn2NVw9sHGRFg.jpg"
        };

        try {
            const url = "https://study-api-server.azurewebsites.net/user/insta-post"
            //const url = "http://localhost:3000/user/insta-post";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            
            if(response.ok) {
                const message = await response.text();
                console.log(message);
                return true;
            } else {
                console.error('Unable to post to Instagram');
                return false;
            }
        } catch(e) {
            console.log('Error posting to Instagrma: ', e);
            return false;
        }
    }

    instagramForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        const ig_username = document.getElementById('ig_username').value;
        const ig_password = document.getElementById('ig_password').value;

        const data = {
            ig_username: ig_username,
            ig_password: ig_password
        };

        try {
            const url = "https://study-api-server.azurewebsites.net/user/insta"
            //const url = "http://localhost:3000/user/insta";
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }

            const dataResponse = await response.text();
            console.log('Info updated successfully ', dataResponse);
            alert('Instagram info updated successfully');
        } catch(e) {
            console.log('Error signing in:', e);
            alert('Unable to sign in');
        }
    })
    
    async function createGroup(studyGroupData) {
        const token = localStorage.getItem('token');

        const url = "https://study-api-server.azurewebsites.net/studygroup";
        //const url = "http://localhost:3000/studygroup";

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
                window.location.href = "../../pages/studyGroup/studyGroup.html"
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