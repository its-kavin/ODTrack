document.addEventListener('DOMContentLoaded', () => {

    const odListContainer = document.getElementById('od-request-list');
    const loadingMsg = document.getElementById('loading-requests');
    const noRequestsMsg = document.getElementById('no-requests-msg');
    const searchInput = document.getElementById('student-search');

    let allRequests = []; // To store fetched requests for filtering

    // --- Function to Render OD Requests ---
    function renderRequests(requests) {
        odListContainer.innerHTML = ''; // Clear previous list or loading message
        noRequestsMsg.style.display = 'none';

        if (!requests || requests.length === 0) {
            noRequestsMsg.style.display = 'block';
            return;
        }

        requests.forEach(request => {
            const card = document.createElement('div');
            card.className = 'od-card';
            card.setAttribute('data-request-id', request.id);

            // Determine proof display
            let proofHtml = '<span>No proof uploaded</span>';
            if (request.proofUrl) {
                // Basic check if it looks like an image URL
                if (/\.(jpe?g|png|gif)$/i.test(request.proofUrl)) {
                    proofHtml = `<a href="${request.proofUrl}" target="_blank" title="View full proof"><img src="${request.proofUrl}" alt="Proof Thumbnail"></a>`;
                } else { // Assume it's a document link
                    proofHtml = `<a href="${request.proofUrl}" target="_blank">View Document</a>`;
                }
            }

            card.innerHTML = `
                <div class="od-info">
                    <h3>Event: ${request.eventName}</h3>
                    <p><strong>Student:</strong> ${request.studentName} (${request.studentRegNo})</p>
                    <p><strong>Date:</strong> ${request.eventDate}</p>
                    <p><strong>Submitted:</strong> ${new Date(request.submittedDate).toLocaleDateString()}</p>
                    </div>
                <div class="od-proof">
                    <strong>Proof:</strong><br>
                    ${proofHtml}
                </div>
                <div class="od-actions">
                    <button class="approve-button" data-id="${request.id}">Approve</button>
                    <button class="reject-button" data-id="${request.id}">Reject</button>
                </div>
            `;
            odListContainer.appendChild(card);
        });

        // Add event listeners after rendering
        addEventListenersToButtons();
    }

    // --- Function to Fetch OD Requests (Simulation) ---
    async function fetchPendingODs() {
        loadingMsg.style.display = 'block';
        noRequestsMsg.style.display = 'none';
        odListContainer.innerHTML = ''; // Clear list while loading

        console.log("Fetching pending OD requests...");
        // ** Replace with actual API call **
        // const response = await fetch('/api/counselor/pending-ods');
        // if (!response.ok) throw new Error('Failed to fetch');
        // allRequests = await response.json();

        // ** SIMULATION **
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
        allRequests = [
            { id: 101, studentName: 'Student Alpha', studentRegNo: '3122215001001', eventName: 'Inter-Dept Symposium', eventDate: '2025-04-15', submittedDate: '2025-04-10T10:00:00Z', proofUrl: 'event-placeholder.png' },
            { id: 102, studentName: 'Student Beta', studentRegNo: '3122215001005', eventName: 'Hackathon Finals', eventDate: '2025-04-22', submittedDate: '2025-04-11T14:30:00Z', proofUrl: null },
            { id: 103, studentName: 'Student Gamma', studentRegNo: '3122215002010', eventName: 'NSS Camp', eventDate: '2025-05-01', submittedDate: '2025-04-12T09:15:00Z', proofUrl: 'document-proof.pdf' },
             { id: 104, studentName: 'Beta Student', studentRegNo: '3122215001006', eventName: 'Webinar Series', eventDate: '2025-04-18', submittedDate: '2025-04-13T11:00:00Z', proofUrl: 'another-image.jpg' }
        ];
        // ** END SIMULATION **

        loadingMsg.style.display = 'none';
        renderRequests(allRequests); // Initial render
        console.log("Fetched requests:", allRequests);

    }

    // --- Function to Handle Approve/Reject Actions (Simulation) ---
    async function handleAction(requestId, action) {
        const cardElement = odListContainer.querySelector(`.od-card[data-request-id="${requestId}"]`);
        if (!cardElement) return;

        const actionText = action === 'approve' ? 'Approving' : 'Rejecting';
        console.log(`${actionText} request ID: ${requestId}`);
        // Visually indicate processing (optional)
        cardElement.style.opacity = '0.5';

        // ** Replace with actual API call to approve/reject **
        // try {
        //    const response = await fetch(`/api/counselor/ods/${requestId}/${action}`, { method: 'POST' });
        //    if (!response.ok) throw new Error(`Failed to ${action}`);
        //
        //    // Remove the card from the list on success
        //    cardElement.remove();
        //    console.log(`Request ${requestId} ${action}d successfully.`);
        //    // Optional: Update counts or show a success message
        //    // Check if list is now empty
        //    if (odListContainer.children.length === 0) {
        //         noRequestsMsg.style.display = 'block';
        //    }
        //
        // } catch (error) {
        //    console.error(`Error ${actionText.toLowerCase()} request:`, error);
        //    alert(`Failed to ${action} the request. Please try again.`);
        //    cardElement.style.opacity = '1'; // Restore card visibility on error
        // }

        // ** SIMULATION **
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        console.log(`Simulated ${action} for request ${requestId}`);
        cardElement.remove(); // Remove card after simulation
         // Remove from the local array as well
         allRequests = allRequests.filter(req => req.id !== parseInt(requestId));
         // Check if list is empty after removal
        if (odListContainer.children.length === 0 && allRequests.length === 0) {
            noRequestsMsg.style.display = 'block';
        }
         // ** END SIMULATION **
    }

     // --- Add Event Listeners to Dynamically Added Buttons ---
    function addEventListenersToButtons() {
        odListContainer.querySelectorAll('.approve-button, .reject-button').forEach(button => {
             // Remove existing listener to prevent duplicates if re-rendering often
            button.replaceWith(button.cloneNode(true));
        });
         // Add new listeners
         odListContainer.querySelectorAll('.approve-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm(`Are you sure you want to APPROVE OD request ID ${id}?`)) {
                     handleAction(id, 'approve');
                }
            });
        });
        odListContainer.querySelectorAll('.reject-button').forEach(button => {
            button.addEventListener('click', (e) => {
                 const id = e.target.dataset.id;
                const reason = prompt(`Are you sure you want to REJECT OD request ID ${id}?\nPlease provide a brief reason (optional):`);
                // Note: In a real app, the reason should be sent to the backend.
                 if (reason !== null) { // Only proceed if prompt wasn't cancelled
                    console.log(`Rejection reason for ${id}: ${reason}`);
                    handleAction(id, 'reject');
                 }
            });
        });
    }


    // --- Filter/Search Functionality ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredRequests = allRequests.filter(request =>
                request.studentName.toLowerCase().includes(searchTerm) ||
                request.studentRegNo.includes(searchTerm)
            );
            renderRequests(filteredRequests);
        });
    }

    // --- Initial Load ---
    fetchPendingODs();

});