document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.getElementById('signInForm');
    const igUsernameInput = document.getElementById('ig_username');
    const igPasswordInput = document.getElementById('ig_password');
    const token = localStorage.getItem('token');

    const userData = JSON.parse(localStorage.getItem('user'));

    const igUsername = userData.ig_username;
    const igPassword = userData.ig_password;

    if (igUsername && igPassword) {
        igUsernameInput.value = igUsername;
        igPasswordInput.value = igPassword;
    }
    
    signInForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const ig_username = igUsernameInput.value;
        const ig_password = igPasswordInput.value;

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
})