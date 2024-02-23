document.addEventListener('DOMContentLoaded', function() {
    const createAccountForm = document.getElementById('createAccountForm');
    createAccountForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const school = document.getElementById('school').value;
        const major = document.getElementById('major').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const data = {
            username: username,
            email: email,
            school: school,
            major: [major],
            school: school,
            password: password,
            confirmPassword: confirmPassword
        };

        if (password !== confirmPassword) {
            message.textContent = 'Passwords do not match.'
            message.style.color = 'red';
        } else {
            createAccount(data);
        }
    });

    async function createAccount(data) {
        const url = "https://study-api-server.azurewebsites.net/user";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                window.location.href = '../verify.html'; //redirect to login
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        }
        catch(error) {
            console.error('Error signing up: ', error);
            alert('Unable to signup');
        };
    };
})