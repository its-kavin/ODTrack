// ODTrack/odpending.js (Updated with new sorting logic)

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
            // let ods = await response.json(); // Use let since we reassign after sort

            // ** USING SIMULATED DATA FOR NOW ** // Remove this block when using real fetch
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            let ods = [ // Use let
                { id: 1, eventImage: 'event-placeholder.png', eventName: 'Tech Symposium 2025', eventDate: '2025-05-15', status: 'Approved', reason: null },
                { id: 2, eventImage: 'event-placeholder-2.png', eventName: 'Annual Cultural Fest', eventDate: '2025-06-10', status: 'Pending', reason: null },
                { id: 3, eventImage: 'event-placeholder-3.png', eventName: 'Sports Day Practice', eventDate: '2025-04-20', status: 'Rejected', reason: 'Insufficient proof provided.' },
                { id: 4, eventImage: null, eventName: 'Workshop on AI', eventDate: '2025-03-10', status: 'Approved', reason: null }, // Example with no image
                { id: 5, eventImage: null, eventName: 'Another Pending Event', eventDate: '2025-06-01', status: 'Pending', reason: null },
                { id: 6, eventImage: null, eventName: 'Older Approved Event', eventDate: '2025-02-15', status: 'Approved', reason: null }
            ];
            // ** END OF SIMULATED DATA **


            if(loadingMessage) loadingMessage.style.display = 'none'; // Hide loading

            if (ods && ods.length > 0) {

                // ** NEW SORTING LOGIC START **
                ods.sort((a, b) => {
                    const aIsApproved = a.status === 'Approved';
                    const bIsApproved = b.status === 'Approved';

                    // Rule 1: Approved items come before non-approved
                    if (aIsApproved && !bIsApproved) {
                        return -1; // a comes first
                    }
                    if (!aIsApproved && bIsApproved) {
                        return 1; // b comes first
                    }

                    // Rule 2: If both are Approved, sort by date ascending (oldest first)
                    if (aIsApproved && bIsApproved) {
                        return new Date(a.eventDate) - new Date(b.eventDate);
                    }

                    // Rule 3: If neither are Approved, sort by date descending (newest first)
                    // This keeps Pending/Rejected items sorted with most recent first
                    return new Date(b.eventDate) - new Date(a.eventDate);
                });
                // ** NEW SORTING LOGIC END **


                // --- Render the sorted cards ---
                ods.forEach(od => {
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

                    // Make approved cards clickable (Keep this logic)
                    if (od.status === 'Approved') {
                        card.classList.add('approved-od-card');
                        card.style.cursor = 'pointer';
                        card.title = 'Click to upload attendance proof';

                        card.addEventListener('click', () => {
                            console.log(`Approved OD Card clicked. ID: ${od.id}. Redirecting to upload page...`);
                            window.location.href = `geotag_upload.html?od_id=${od.id}`;
                        });
                    }

                    odListContainer.appendChild(card);
                });
            } else {
                // Show the 'no ODs' message if no data fetched
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
            console.log("Redirecting to dashboard to request new OD...");
            window.location.href = 'dashboard.html'; // Redirect to the dashboard page
        });
    } else {
        console.error("Button with ID 'request-new-od' not found.");
    }

    // --- Initial Load ---
    fetchAndDisplayODs(); // Load the OD data when the page is ready

});