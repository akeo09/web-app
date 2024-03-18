document.addEventListener("DOMContentLoaded", function() {
    const signInLink = document.getElementById('signInLink');
    const logoutLink = document.getElementById('logoutLink');
    const studyGroupsTab = document.getElementById('studyGroupsTab');

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log("User: ", user);
    console.log("Token: ", token);

    function linkVisibility() {
        if(token && user) {
            signInLink.style.display = 'none';
            logoutLink.style.display = 'block';
            studyGroupsTab.style.display = 'block';

            const logoutBtn = document.getElementById('logoutBtn');
            logoutBtn.addEventListener('click', function(event) {
                event.preventDefault();

                const url = "http://localhost:3000/user/logout";

                fetch(url, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.ok) {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');

                        signInLink.style.display = 'block';
                        logoutLink.style.display = 'none';
                        studyGroupsTab.style.display = 'none';

                        //window.location.href = 'pages/signin.html'; // Redirect to sign in page after logout
                    } else {
                        console.error('Cannot logout');
                    }
                }).catch(error => {
                    console.error('Cannot logout: ', error)
                });
            });
        } else {
            signInLink.style.display = 'block';
            logoutLink.style.display = 'none';
            studyGroupsTab.style.display = 'none';
        }
    }

    linkVisibility();
});
