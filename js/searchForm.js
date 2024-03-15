document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchForm");
    const messageDiv = document.getElementById("message");

    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();

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

        const token = localStorage.getItem('token');
        
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

            const editButton = document.createElement("button");
            const modal = document.getElementById("editModal");
            const closeBtn = modal.querySelector(".close");

            editButton.textContent = "Edit";
            editButton.classList.add("btn", "btn-primary");
            editButton.addEventListener("click", () => {
                modal.style.display = "block";
            })

            closeBtn.addEventListener("click", function() {
                modal.style.display = "none";
            })

            window.addEventListener("click", function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });
            
            function formatDate(dateString) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            }
            
            // Assuming startDateString, endDateString, and any other date strings you have
            const startDateString = "2024-02-23T00:00:00.000Z";
            const endDateString = "2024-03-25T00:00:00.000Z";

            const formattedStartDate = formatDate(startDateString);
            const formattedEndDate = formatDate(endDateString);

            console.log("Start Date:", formattedStartDate); // Output: "Start Date: 2024-02-17"
            console.log("End Date:", formattedEndDate); // Output: "End Date: 2024-03-25"

            cardBody.appendChild(editButton);

            card.appendChild(cardBody);

            studyGroupsContainer.appendChild(card);
        })
    }
    
    const editForm = document.getElementById("editForm");
    const editName = document.getElementById("editName");
    const editPublic = document.getElementById("editPublic");
    const editDescription = document.getElementById("editDescription");
    const editParticipants = document.getElementById("editParticipants");
    const editStartDate = document.getElementById("editStartDate");
    const editEndDate = document.getElementById("editEndDate");
    const editSchool = document.getElementById("editSchool");
    const editCourse = document.getElementById("editCourse");

    let currentStudyGroup;
    let selectedStudyGroupId;
    studyGroupsContainer.addEventListener("click", function(event, studyGroup) {
        //if(event.target.classList.contains("editButton")) {
            populateModal(currentStudyGroup);
            modal.style.display = "block";
        //}
        console.log("study group id:", selectedStudyGroupId)
    });

    function populateModal(studyGroup) {
        editName.value = studyGroup.name;
        editPublic.checked = studyGroup.is_public;
        editDescription.value = studyGroup.description;
        editParticipants.value = studyGroup.max_participants;
        editStartDate.value = studyGroup.start_date;
        editEndDate.value = studyGroup.end_date;
        editSchool.value = studyGroup.school;
        editCourse.value = studyGroup.course_number
    }

    saveButton.addEventListener("submit", async function(event) {
        event.preventDefault();

        const studyGroupId = event.target.dataset.index;
        localStorage.setItem('selectedStudyGroupId', studyGroupId);
        selectedStudyGroupId = localStorage.getItem('selectedStudyGroupId');
        currentStudyGroup = studyGroupId.find(group => group._id === selectedStudyGroupId);

        await saveChanges(studyGroupId._id)
    });

    async function saveChanges(selectedStudyGroupId) {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:3000/studygroup/${selectedStudyGroupId}`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: editName.value,
                    is_public: editPublic.checked,
                    max_participants: editParticipants.value,
                    start_date: editStartDate.value,
                    end_date: editEndDate.value,
                    school: editSchool.value,
                    course_number: editCourse.value
                })
            })
            if(response.ok) {
                const updatedStudyGroup = await response.json();
                console.log("Updated study group: ", updatedStudyGroup);

                //modal.style.display = "none";
            } else {
                console.error("Failed to update study group");
            }
        } catch(e) {
            console.error("Error: ", e)
        }
    };

});