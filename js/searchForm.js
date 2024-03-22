document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchForm");
    const messageDiv = document.getElementById("message");
    const userData = JSON.parse(localStorage.getItem('user'));
    const loggedInUserId = userData._id;
    const myGroups = document.getElementById("myGroups");
   
    //submit search form after edit is saved
    function submitSearchForm() {
        searchForm.dispatchEvent(new Event('submit'));        
    }

    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        console.log("token: ", token)
        if (!token) {
            alert('Sign in to search.');
            return;
        }
        const myGroupsValue = myGroups.checked;
        const search = document.getElementById("search").value.trim();
        let ongoing = null;
        const skip = document.getElementById("skip").value;
        const limit = document.getElementById("limit").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        const ongoingRadio = document.querySelectorAll('input[name="onging"]');
        for (const radio of ongoingRadio) {
            if (radio.checked) {
                ongoing = radio.value;
                break;
            }
        }

        const queryParams = {
            //ongoing: ongoing,
            skip: skip,
            limit: limit,
            startDate: startDate,
            endDate: endDate,
            my_groups: myGroupsValue
        };

        if (search.trim() !== "") {
            queryParams.search = search;
        }

        if (ongoing !== null) {
            queryParams.ongoing = ongoing;
        }

        sessionStorage.setItem('searchParams', JSON.stringify(queryParams));

        //const url = "https://study-api-server.azurewebsites.net/studygroups";
        const url = "http://localhost:3000/studygroups?" + new URLSearchParams(queryParams).toString();
        try {
            const response = await fetch(url,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response)
            console.log(token);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                displayStudyGroups(data); 
                console.log("Search Parameters: ", queryParams);
            }
                      
        } catch (error) {
            console.error("Error:", error);
            messageDiv.textContent = "Failed to retrieve study groups. Please try again.";
        }
        console.log(url);
    });
    

    const addMeetingTimeBtn = document.getElementById('addMeetingTime');
    const meetingTimesContainer = document.getElementById('meetingTimesContainer');

    addMeetingTimeBtn.addEventListener('click', function() {
        addMeetingTimes(meetingTimesContainer);
    });

    function addMeetingTimes(container, meeting = {day: '', time: '', location: ''}) {
        const meetingTimeDiv = document.createElement('div');
        meetingTimeDiv.classList.add('meetingTime');

        meetingTimeDiv.innerHTML = `
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
                <input type="time" id="meetingTime" name="meetingTime" value="${meeting.time}">
            </div>
            <div class="meeting-time-field">
                <label for="meetingLocation">Location</label>
                <input type="text" id="meetingLocation" name="meetingLocation" value="${meeting.location}">
            </div>
            <div class="deleteBtn">
                <button type="button" class="deleteMeetingTime">Delete Meeting Time</button>
            </div>
            `;

        container.appendChild(meetingTimeDiv);

        const deleteBtn = meetingTimeDiv.querySelector('.deleteMeetingTime');
        deleteBtn.addEventListener('click', function() {
            container.removeChild(meetingTimeDiv);
        });
    };

    function displayStudyGroups(studyGroup) {
        //const dateOptions = {month: 'long', day: 'numeric', year: 'numeric'};

        const studyGroupsContainer = document.getElementById("studyGroupsContainer");
        studyGroupsContainer.innerHTML = ""; //clear previous content

        studyGroup.forEach (studyGroup => {
            const card = document.createElement("div");
            card.classList.add("card");

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const nameElement = document.createElement("h2");
            nameElement.classList.add("card-title");
            nameElement.textContent = studyGroup.name;
            cardBody.appendChild(nameElement);

            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("card-text");
            descriptionElement.textContent = studyGroup.description;
            cardBody.appendChild(descriptionElement);

            const startDateElement = document.createElement("p");
            startDateElement.textContent = "Start Date: " + formatDate(studyGroup.start_date);
            cardBody.appendChild(startDateElement);

            const endDateElement = document.createElement("p");
            endDateElement.textContent = "End Date: " + formatDate(studyGroup.end_date);
            cardBody.appendChild(endDateElement);

            const ownerId = studyGroup.owner;
            console.log("Owner ID: ", ownerId);
            console.log("Logged In User ID: ", loggedInUserId);

            const isOwner = ownerId === loggedInUserId;
            console.log("is owner: ", isOwner);

            const modal = document.getElementById("editModal");
            const closeBtn = modal.querySelector(".close");
            let selectedStudyGroupId;

            if (isOwner) {
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("btn", "btn-primary");
                editButton.addEventListener("click", () => {
                    selectedStudyGroupId = studyGroup._id;
                    modal.style.display = "block";
                    console.log("Study Group ID: ", selectedStudyGroupId);
                    populateModal(studyGroup);
                }) 
                cardBody.appendChild(editButton);
            }

            closeBtn.addEventListener("click", function() {
                modal.style.display = "none";
            })

            //format date into user readable format
            function formatDate(dateString) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            }
            
            const startDateString = "2024-02-23T00:00:00.000Z";
            const endDateString = "2024-03-25T00:00:00.000Z";

            const formattedStartDate = formatDate(startDateString);
            const formattedEndDate = formatDate(endDateString);

            console.log("Start Date:", formattedStartDate); 
            console.log("End Date:", formattedEndDate); 

            card.appendChild(cardBody);

            studyGroupsContainer.appendChild(card);

            function populateModal(studyGroup) {
                const formattedStartDate = studyGroup.start_date.substring(0, 10);
                const formattedEndDate = studyGroup.end_date.substring(0, 10);

                editName.value = studyGroup.name;
                editPublic.checked = studyGroup.is_public;
                editDescription.value = studyGroup.description;
                editParticipants.value = studyGroup.max_participants;
                editStartDate.value = formattedStartDate; 
                editEndDate.value = formattedEndDate;
                //editMeetingTime() = studyGroup.meeting_times;
                editSchool.value = studyGroup.school;
                editCourse.value = studyGroup.course_number;
                
                studyGroup.meeting_times.forEach(meeting => {
                    addMeetingTimes(meetingTimesContainer, meeting);
                });
                
                //const editForm = document.getElementById('editForm');
                const saveButton = document.getElementById('saveButton');
                saveButton.addEventListener("click", async function(event) {
                    event.preventDefault();

                    const editedForm = {
                        name: document.getElementById('editName').value,
                        is_public: document.getElementById('editPublic').checked,
                        description: document.getElementById('editDescription').value,
                        max_participants: document.getElementById('editParticipants').value,
                        start_date: new Date(document.getElementById('editStartDate').value),
                        end_date: new Date(document.getElementById('editEndDate').value),
                        meeting_times: getMeetingTimes(),
                        school: document.getElementById('editSchool').value,
                        course_number: document.getElementById('editCourse').value
                    };
                    await saveChanges(studyGroup._id, editedForm);
                });
            };

            async function saveChanges(studyGroupId, editedForm) {
                console.log("Study Group Id: ", studyGroupId)
                const token = localStorage.getItem('token');
                //console.log("token: ", token)
                try {
                    const url = `http://localhost:3000/studygroup/${studyGroupId}`;
                    const response = await fetch(url, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(editedForm)
                    })
                    console.log(await response.text());
                    if(response.ok) {
                        //modal.appendChild(updatedStudyGroup);
                        console.log("Changes saved");
                        modal.style.display = "none";
                    } else {
                        console.error("Failed to update study group: ", response.statusText);
                    }
                } catch(e) {
                    console.error("Error: ", e)
                }
                reloadPageWithSearchParams();
            };
        }); 

            //reload page with former search params
        function reloadPageWithSearchParams() {
            const queryParams = JSON.parse(sessionStorage.getItem('queryParams'));
            if(queryParams) {
                const token = localStorage.getItem('token');
                if(!token) {
                    alert('Please sign in again.');
                    return;
                }
                const url = "http://localhost:3000/studygroups?" + new URLSearchParams(queryParams).toString();
                window.location.href = url;
            }
            submitSearchForm();
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
        };
    };
});