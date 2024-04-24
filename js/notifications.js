document.addEventListener('DOMContentLoaded', async function() {  
    const token = localStorage.getItem('token');
    try {
        const url = "http://localhost:3000/notifications";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        const notifications = await response.json();

        const notificationsContainer = document.getElementById('notificationsContainer');
        notificationsContainer.innerHTML = '';

        notifications.forEach(notification => {
            const card = document.createElement('div');
            card.classList.add('card');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('h3');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = notification.subject;

            const cardSender = document.createElement('h5');
            cardSender.classList.add('card-sender');
            cardSender.textContent = 'From: ' + notification.sender.username;

            const cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.textContent = notification.body;

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardSender)
            cardBody.appendChild(cardText);

            card.appendChild(cardBody);

            notificationsContainer.appendChild(card);
        })
    } catch(e) {
        console.error('Error fetching notifications: ', e)
    }
})  
