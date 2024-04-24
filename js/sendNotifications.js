document.addEventListener('DOMContentLoaded', function() {    
    const sendNotificationForm = document.getElementById('sendNotificationForm');
    const token = localStorage.getItem('token');

    sendNotificationForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const receiver = document.getElementById('receiver').value;
        const subject = document.getElementById('subject').value;
        const body = document.getElementById('body').value;
        const notification_type = 'general';
        const studygroup_id = null;

        try {
            const url = "http://localhost:3000/notification";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver,
                    subject,
                    body,
                    notification_type,
                    studygroup_id
                })
            })

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }

            const notification = await response.json();
            console.log('Notification sent successfully: ', notification);
            alert('Notification Sent Successfully')
            window.location.href = '../pages/notifications.html';
        } catch(e) {
            console.error('Error sending notification: ', e);
        }
    })

    const userData = [
        {_id: '65f5de7e10a2d952c24e6a8c', username: 'Bob'},
        {_id: '65f5dee110a2d952c24e6a8f', username: 'Alicia'},
        {_id: '6615f8468367286638dd5c39', username: 'Aidan'},
        {_id: '6615f8d88367286638dd5c3c', username: 'Skyler'},
        {_id: '661604cb8367286638dd5c4f', username: 'Lish'},
    ]

    // Function to populate the dropdown menu with users
    async function populateUsersDropdown() {
        const dropdown = document.getElementById('receiver');

        // Clear existing options
        dropdown.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Select Receiver';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dropdown.appendChild(defaultOption);

        // Add user options
        userData.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id; // Assuming user ID is used as the value
            option.text = user.username; // Assuming username is used as the display text
            dropdown.appendChild(option);
        });
    }

    // Call the function to populate the dropdown menu when the page loads
    populateUsersDropdown();

})