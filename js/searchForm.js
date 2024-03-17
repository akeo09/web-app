document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchForm");
    const messageDiv = document.getElementById("message");
    const userData = JSON.parse(localStorage.getItem('user'));
    const loggedInUserId = userData._id;
    
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const token = localStorage.getItem('token');
        console.log("token: ", token)
        if (!token) {
            alert('Sign in to search.');
            return;
        }

        const search = document.getElementById("search").value;
        const ongoing = document.getElementById("ongoing").checked;
        const skip = document.getElementById("skip").value;
        const limit = document.getElementById("limit").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        const queryParams = {
            search: search,
            ongoing: ongoing,
            skip: skip,
            limit: limit,
            startDate: startDate,
            endDate: endDate
        }

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
    });
    
    function displayStudyGroups(studyGroup) {
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
            
            //format date into use readable format
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

            //display study groups
            card.appendChild(cardBody);

            studyGroupsContainer.appendChild(card);
        
            //populate edit modal
            function populateModal(studyGroup) {
                const formattedStartDate = studyGroup.start_date.substring(0, 10);
                const formattedEndDate = studyGroup.end_date.substring(0, 10);

                editName.value = studyGroup.name;
                editPublic.checked = studyGroup.is_public;
                editDescription.value = studyGroup.description;
                editParticipants.value = studyGroup.max_participants;
                editStartDate.value = formattedStartDate; //studyGroup.start_date; 
                editEndDate.value = formattedEndDate; //studyGroup.end_date;
                editSchool.value = studyGroup.school;
                editCourse.value = studyGroup.course_number;

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
                        school: document.getElementById('editSchool').value,
                        course_number: document.getElementById('editCourse').value
                    };
                    await saveChanges(studyGroup._id, editedForm);
                });
            };
            async function saveChanges(studyGroupId, editedForm) {
                console.log("Study Group Id: ", studyGroupId)
                const token = localStorage.getItem('token');
                console.log("token: ", token)
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
                    //console.log("Study Group Id: ", selectedStudyGroupId)
                    //const responseData = await response.json();
                    console.log(await response.text());
                    if(response.ok) {
                        const updatedStudyGroup = document.createElement('p');
                        updatedStudyGroup.textContent = 'Success!';
                        updatedStudyGroup.style.color = 'green';
                        modal.appendChild(updatedStudyGroup);
                        console.log("Changes saved");
                        //modal.style.display = "none";
                    } else {
                        console.error("Failed to update study group: ", response.statusText);
                    }
                } catch(e) {
                    console.error("Error: ", e)
                }
            };
        })
    }
});