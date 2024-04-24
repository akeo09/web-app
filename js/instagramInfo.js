document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.getElementById('signInForm');
    const token = localStorage.getItem('token');
    
    signInForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const ig_username = document.getElementById('ig_username').value;
        const ig_password = document.getElementById('ig_password').value;

        const data = {
            ig_username: ig_username,
            ig_password: ig_password
        };

        try {
            const url = "http://localhost:3000/user/insta";
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