document.addEventListener('DOMContentLoaded', (event) => {
    
    const odListContainer = document.getElementById('od-list');
    const loadingMessage = document.getElementById('loading-message');
    const noOdsMessage = document.getElementById('no-ods-message');
    const requestButton = document.getElementById('request-new-od');

    // --- Function to Fetch and Display OD Data ---
    async function fetchAndDisplayODs() {
        if(loadingMessage) loadingMessage.style.display = 'block'; // Show loading
        if(noOdsMessage) noOdsMessage.style.display = 'none';   // Hide no ODs msg
        odListContainer.innerHTML = ''; // Clear previous list

        try {
            // ** Replace this URL with your actual API endpoint to get OD data **
            // const response = await fetch('/api/my-od-requests'); 
            // if (!response.ok) {
            //    throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // const ods = await response.json();

            // ** USING SIMULATED DATA FOR NOW ** // Remove this block when using real fetch
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            const ods = [ 
                { id: 1, eventImage: 'event-placeholder.png', eventName: 'Tech Symposium 2025', eventDate: '2025-05-15', status: 'Approved', reason: null },
                { id: 2, eventImage: 'event-placeholder-2.png', eventName: 'Annual Cultural Fest', eventDate: '2025-06-10', status: 'Pending', reason: null },
                { id: 3, eventImage: 'event-placeholder-3.png', eventName: 'Sports Day Practice', eventDate: '2025-04-20', status: 'Rejected', reason: 'Insufficient proof provided.' },
                { id: 4, eventImage: null, eventName: 'Workshop on AI', eventDate: '2025-03-10', status: 'Approved', reason: null } // Example with no image
            ];
            // ** END OF SIMULATED DATA **


            if(loadingMessage) loadingMessage.style.display = 'none'; // Hide loading

            if (ods && ods.length > 0) {
                // Sort ODs (e.g., by date descending) - Optional
                ods.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

                ods.forEach(od => {
                    const card = document.createElement('div');
                    card.className = 'od-request-card';
                    card.setAttribute('data-od-id', od.id); // Optional: add ID for potential future actions

                    const statusClass = `status-${od.status.toLowerCase()}`; // e.g., status-approved
                    const reasonHtml = od.status === 'Rejected' && od.reason ? `<p class="rejection-reason">Reason: ${od.reason}</p>` : '';
                    // Use a default image if eventImage is null or empty
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
                    odListContainer.appendChild(card); // Add the new card to the list
                });
            } else {
                // Show the 'no ODs' message if no data fetched
                if (noOdsMessage) noOdsMessage.style.display = 'block';
                console.log("No OD requests found.");
            }

        } catch (error) {
            console.error("Error fetching or displaying OD requests:", error);
            if(loadingMessage) loadingMessage.textContent = 'Failed to load OD requests.'; // Show error in loading message
            else { // If loading message doesn't exist, maybe add error to main container
                 odListContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load OD requests. Please try again later.</p>';
            }
            if (noOdsMessage) noOdsMessage.style.display = 'none'; 
        }
    }

    // --- Button Functionality ---
    if (requestButton) {
        requestButton.addEventListener('click', function() {
            console.log("Redirecting to dashboard to request new OD...");
            window.location.href = 'dashboard.html'; // Redirect to the dashboard page
        });
    } else {
        console.error("Button with ID 'request-new-od' not found.");
    }

    // --- Initial Load ---
    fetchAndDisplayODs(); // Load the OD data when the page is ready

});