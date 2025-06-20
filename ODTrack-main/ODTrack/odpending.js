document.addEventListener('DOMContentLoaded', (event) => {
    
    const odListContainer = document.getElementById('od-list');
    const loadingMessage = document.getElementById('loading-message');
    const noOdsMessage = document.getElementById('no-ods-message');
    const requestButton = document.getElementById('request-new-od');

    // --- Helper function to create an OD card element ---
    const createOdCard = (od) => {
        const card = document.createElement('div');
        card.className = 'od-request-card';
        card.setAttribute('data-od-id', od.id); 

        const statusClass = `status-${od.status.toLowerCase()}`; 
        const reasonHtml = od.status === 'Rejected' && od.reason ? `<p class="rejection-reason">Reason: ${od.reason}</p>` : '';
        const imageSrc = od.eventImage ? od.eventImage : 'default-event-placeholder.png'; 

        card.innerHTML = `
            <img src="${imageSrc}" alt="Event Poster Thumbnail" class="event-poster" onerror="this.src='default-event-placeholder.png'; this.onerror=null;"> 
            <div class="od-details">
                <h2>Event: ${od.eventName}</h2>
                <p><strong>Date:</strong> ${od.eventDate}</p>
                <p><strong>Status:</strong> <span class="${statusClass}">${od.status}</span></p>
                ${reasonHtml}
            </div>
        `;
        return card;
    };

    // --- Function to Fetch and Display OD Data ---
    async function fetchAndDisplayODs() {
        if(loadingMessage) loadingMessage.style.display = 'block'; 
        if(noOdsMessage) noOdsMessage.style.display = 'none';   
        odListContainer.innerHTML = ''; // Clear previous list or loading message

        try {
            // ** USING SIMULATED DATA FOR NOW ** await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            const ods = [ 
                { id: 1, eventImage: 'event-placeholder.png', eventName: 'Tech Symposium 2025', eventDate: '2025-05-15', status: 'Approved', reason: null },
                { id: 2, eventImage: 'event-placeholder-2.png', eventName: 'Annual Cultural Fest', eventDate: '2025-06-10', status: 'Pending', reason: null },
                { id: 3, eventImage: 'event-placeholder-3.png', eventName: 'Sports Day Practice', eventDate: '2025-04-20', status: 'Rejected', reason: 'Insufficient proof provided.' },
                { id: 4, eventImage: 'event-placeholder-2.png', eventName: 'Workshop on AI', eventDate: '2025-03-10', status: 'Approved', reason: null },
                { id: 5, eventImage: 'event-placeholder4.png', eventName: 'Coding Contest', eventDate: '2025-06-01', status: 'Pending', reason: null },
                { id: 6, eventImage: 'event-placeholder-5.png', eventName: 'Guest Lecture Series', eventDate: '2025-03-25', status: 'Rejected', reason: 'Already attended similar event.' },
            ];
            // ** END OF SIMULATED DATA **

            if(loadingMessage) loadingMessage.style.display = 'none'; 

            if (ods && ods.length > 0) {
                const approvedOds = [];
                const pendingOds = [];
                const rejectedOds = [];

                ods.forEach(od => {
                    if (od.status === 'Approved') {
                        approvedOds.push(od);
                    } else if (od.status === 'Pending') {
                        pendingOds.push(od);
                    } else if (od.status === 'Rejected') {
                        rejectedOds.push(od);
                    }
                    // You could add an 'else' here to catch ODs with unexpected statuses
                });

                const sortByEventDateDesc = (a, b) => new Date(b.eventDate) - new Date(a.eventDate);
                approvedOds.sort(sortByEventDateDesc);
                pendingOds.sort(sortByEventDateDesc);
                rejectedOds.sort(sortByEventDateDesc);

                let hasAnyContent = false;

                // Function to render a section of OD cards
             // Inside odpending.js

// ... (existing code)

                // Function to render a section of OD cards
                const renderSection = (title, items) => {
                    if (items.length > 0) {
                        hasAnyContent = true;
                        const sectionTitleEl = document.createElement('h2');
                        sectionTitleEl.className = 'od-section-title';
                        sectionTitleEl.textContent = title;
                        odListContainer.appendChild(sectionTitleEl);

                        items.forEach(od => {
                            const cardElement = createOdCard(od);
                            
                            // MODIFICATION START
                            // If the card is an approved one, make it clickable to upload proof.
                            if (od.status === 'Approved') {
                                cardElement.classList.add('approved-clickable'); // Add class for styling
                                cardElement.title = 'Click to upload attendance proof';
                                cardElement.addEventListener('click', () => {
                                    // Redirect to the new page with the OD ID as a URL parameter
                                    window.location.href = `upload_attendance.html?id=${od.id}`;
                                });
                            }
                            // MODIFICATION END

                            odListContainer.appendChild(cardElement);
                        });
                    }
                };
// ... (rest of the file)
                
                // Render sections in desired order
                renderSection('Pending Requests', pendingOds);
                renderSection('Approved Requests', approvedOds);
                renderSection('Rejected Requests', rejectedOds);

                if (!hasAnyContent) {
                    if (noOdsMessage) noOdsMessage.style.display = 'block';
                    console.log("No OD requests found in any category.");
                } else {
                    if (noOdsMessage) noOdsMessage.style.display = 'none';
                }

            } else {
                if (noOdsMessage) noOdsMessage.style.display = 'block';
                console.log("No OD requests found.");
            }

        } catch (error) {
            console.error("Error fetching or displaying OD requests:", error);
            if(loadingMessage) loadingMessage.textContent = 'Failed to load OD requests.'; 
            else { 
                 odListContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load OD requests. Please try again later.</p>';
            }
            if (noOdsMessage) noOdsMessage.style.display = 'none'; 
        }
    }

    // --- Button Functionality ---
    if (requestButton) {
        requestButton.addEventListener('click', function() {
            console.log("Redirecting to request new OD page...");
            window.location.href = 'form.html'; // Assuming dashboard.html was renamed to form.html
        });
    } else {
        console.error("Button with ID 'request-new-od' not found.");
    }

    // --- Initial Load ---
    fetchAndDisplayODs(); 

});