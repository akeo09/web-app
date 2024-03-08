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

        const baseUrl = "http://localhost:3000/studygroups";
        const queryParams = {
            search: search,
            ongoing: ongoing,
            skip: skip,
            limit: limit,
            startDate: startDate,
            endDate: endDate
        }

        const token = localStorage.getItem('token');
        
        let queryString = '';
        for (const key in queryParams) {
          if (queryParams.hasOwnProperty(key)) {
            const value = encodeURIComponent(queryParams[key]);
            queryString += `${queryString ? '&' : '?'}${key}=${value}`;
          }
        }        
        const url = baseUrl + queryString;
        //const url = "https://study-api-server.azurewebsites.net/studygroups";
        //const url = "http://localhost:3000/studygroups?" + new URLSearchParams(queryParams).toString();
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
    
});

function displayStudyGroups(studyGroup) {
    const studyGroupsContainer = document.getElementById("studyGroupsContainer");
    studyGroupsContainer.innerHTML = ""; //clear previous content

    studyGroup.forEach(studyGroup => {
        const studyGroupElement = document.createElement("div");
        studyGroupElement.classList.add("study-group");

        const nameElement = document.createElement("h2");
        nameElement.textContent = studyGroup.name;
        studyGroupElement.appendChild(nameElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = studyGroup.description;
        studyGroupElement.appendChild(descriptionElement);

        const startDateElement = document.createElement("p");
        startDateElement.textContent = "Start Date: " + studyGroup.start_date;
        studyGroupElement.appendChild(startDateElement);

        const endDateElement = document.createElement("p");
        endDateElement.textContent = "End Date: " + studyGroup.end_date;
        studyGroupElement.appendChild(endDateElement);

        studyGroupsContainer.appendChild(studyGroupElement);
    })
}