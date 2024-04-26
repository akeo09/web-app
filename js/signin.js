document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const data = {
            email: email,
            password: password
        };

        await login(data);

        async function login(data) {
            const url = "https://study-api-server.azurewebsites.net/user/login";
            //const url = "http://localhost:3000/user/login";

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    //const token = responseData.token;

                    localStorage.setItem('user', JSON.stringify(responseData.user));
                    localStorage.setItem('token', responseData.token);

                    console.log("user data stored: ", responseData.user);
                    console.log("Token stored: ", responseData.token);

                    window.location.href = '../main.html'; //redirect to main
                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                    console.log('unable to login');
                }
            }
            catch(error) {
                console.log('Error signing up: ', error);
                alert('Unable to signin');
            };
        };
    });
})