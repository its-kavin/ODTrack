document.addEventListener('DOMContentLoaded', () => {

    // Pending ODs Elements
    const odListContainer = document.getElementById('od-request-list');
    const loadingMsg = document.getElementById('loading-requests');
    const noRequestsMsg = document.getElementById('no-requests-msg');
    const searchInput = document.getElementById('student-search');

    // History ODs Elements
    const odHistoryListContainer = document.getElementById('od-history-list');
    const loadingHistoryMsg = document.getElementById('loading-history');
    const noHistoryMsg = document.getElementById('no-history-msg');
    const historySearchInput = document.getElementById('history-search');


    // OD Action Modal Elements
    const odActionModal = document.getElementById('od-action-confirm-modal');
    const odActionModalTitle = document.getElementById('od-action-modal-title');
    const odActionModalMessage = document.getElementById('od-action-modal-message');
    const odActionReasonContainer = document.getElementById('od-action-reason-container');
    const odActionModalReasonInput = document.getElementById('od-action-modal-reason');
    const confirmOdActionButton = document.getElementById('confirm-od-action-btn');
    const cancelOdActionButton = document.getElementById('cancel-od-action-btn');

    let allRequests = []; 
    let actionHistory = []; 
    let currentActionDetails = { id: null, action: null, element: null, originalRequest: null };

    function renderPendingRequests(requestsToRender) {
        odListContainer.innerHTML = '';
        noRequestsMsg.style.display = 'none';

        if (!requestsToRender || requestsToRender.length === 0) {
            if (searchInput.value.trim() !== '') { 
                noRequestsMsg.textContent = `No pending requests found matching "${searchInput.value}".`;
            } else { 
                noRequestsMsg.textContent = 'No pending OD requests found.';
            }
            noRequestsMsg.style.display = 'block';
            searchInput.placeholder = "Search pending by Student Name or RegNo...";
            return;
        }
        searchInput.placeholder = `Search in ${requestsToRender.length} pending request(s)...`;

        requestsToRender.forEach(request => {
            const card = document.createElement('div');
            card.className = 'od-card pending-card'; 
            card.setAttribute('data-request-id', request.id);
            card.dataset.originalRequest = JSON.stringify(request);

            let proofHtml = '<span>No proof uploaded</span>';
            if (request.proofUrl) {
                // NOTE: In a real app, you might need to differentiate between file types.
                if (/\.(jpe?g|png|gif)$/i.test(request.proofUrl)) {
                    proofHtml = `<a href="${request.proofUrl}" target="_blank" title="View full proof"><img src="${request.proofUrl}" alt="Proof Thumbnail"></a>`;
                } else {
                    proofHtml = `<a href="${request.proofUrl}" target="_blank">View Document</a>`;
                }
            }

            card.innerHTML = `
                <div class="od-info">
                    <h3>Event: ${request.eventName}</h3>
                    <p><strong>Student:</strong> ${request.studentName} (${request.studentRegNo})</p>
                    <p><strong>Event Date:</strong> ${request.eventDate}</p>
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
        addEventListenersToPendingButtons();
    }

    function renderActionHistory(historyItemsToRender) {
        odHistoryListContainer.innerHTML = '';
        noHistoryMsg.style.display = 'none';

        if (!historyItemsToRender || historyItemsToRender.length === 0) {
             if (historySearchInput.value.trim() !== '') {
                noHistoryMsg.textContent = `No history found matching "${historySearchInput.value}".`;
            } else {
                noHistoryMsg.textContent = 'No action history found.';
            }
            noHistoryMsg.style.display = 'block';
            historySearchInput.placeholder = "Search history by Student Name or RegNo...";
            return;
        }
        historySearchInput.placeholder = `Search in ${historyItemsToRender.length} history item(s)...`;

        historyItemsToRender.sort((a, b) => new Date(b.actionTimestamp) - new Date(a.actionTimestamp));

        historyItemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = `od-card history-card status-${item.status}`; 

            let proofHtml = '<span>No proof</span>';
             if (item.proofUrl) {
                if (/\.(jpe?g|png|gif)$/i.test(item.proofUrl)) {
                    proofHtml = `<a href="${item.proofUrl}" target="_blank" title="View full proof"><img src="${item.proofUrl}" alt="Proof Thumbnail"></a>`;
                } else {
                    proofHtml = `<a href="${item.proofUrl}" target="_blank">View Document</a>`;
                }
            }

            const reasonHtml = item.status === 'rejected' && item.rejectionReason ?
                `<p class="rejection-reason-history"><strong>Reason:</strong> ${item.rejectionReason}</p>` : '';
            
            // --- MODIFICATION START: Display Attendance Proof ---
            let attendanceHtml = '';
            if (item.status === 'approved') {
                if (item.attendance && item.attendance.photoUrl) {
                    attendanceHtml = `
                    <div class="attendance-proof">
                        <strong>Attendance Proof:</strong>
                        <a href="${item.attendance.photoUrl}" target="_blank">View Photo</a>
                        <span>(Geo: ${item.attendance.latitude.toFixed(4)}, ${item.attendance.longitude.toFixed(4)})</span>
                    </div>`;
                } else {
                    attendanceHtml = `<div class="attendance-proof"><strong>Attendance Proof:</strong> <span>Not submitted</span></div>`;
                }
            }
            // --- MODIFICATION END ---


            card.innerHTML = `
                <div class="od-info">
                    <h3>Event: ${item.eventName}</h3>
                    <p><strong>Student:</strong> ${item.studentName} (${item.studentRegNo})</p>
                    <p><strong>Event Date:</strong> ${item.eventDate}</p>
                    <p><strong>Status:</strong> <span class="status-badge">${item.status.toUpperCase()}</span></p>
                    <p><strong>Action Date:</strong> ${new Date(item.actionTimestamp).toLocaleString()}</p>
                    ${reasonHtml}
                </div>
                <div class="od-proof">
                    <strong>OD Request Proof:</strong><br>
                    ${proofHtml}
                    ${attendanceHtml}
                </div>
            `;
            odHistoryListContainer.appendChild(card);
        });
    }

    async function fetchData() {
        loadingMsg.style.display = 'block';
        loadingHistoryMsg.style.display = 'block'; 
        noRequestsMsg.style.display = 'none';
        noHistoryMsg.style.display = 'none';
        odListContainer.innerHTML = '';
        odHistoryListContainer.innerHTML = '';

        console.log("Fetching data...");
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        allRequests = [
            { id: 101, studentName: 'Student Alpha', studentRegNo: '3122215001001', eventName: 'Inter-Dept Symposium', eventDate: '2025-04-15', submittedDate: '2025-04-10T10:00:00Z', proofUrl: 'event-placeholder.png' },
            { id: 102, studentName: 'Student Beta', studentRegNo: '3122215001005', eventName: 'Hackathon Finals', eventDate: '2025-04-22', submittedDate: '2025-04-11T14:30:00Z', proofUrl: null },
            { id: 103, studentName: 'Student Gamma', studentRegNo: '3122215002010', eventName: 'NSS Camp', eventDate: '2025-05-01', submittedDate: '2025-04-12T09:15:00Z', proofUrl: 'document-proof.pdf' },
        ];

        // --- MODIFICATION: Add attendance data to a simulated record ---
        actionHistory = [
            { id: 201, studentName: 'Past Student Delta', studentRegNo: '3122215003015', eventName: 'Old Tech Fest', eventDate: '2025-03-10', proofUrl: 'event-placeholder-2.png', status: 'approved', actionTimestamp: '2025-03-11T10:00:00Z', rejectionReason: null, attendance: { photoUrl: 'geotag-proof.jpg', latitude: 12.9716, longitude: 77.5946 } },
            { id: 202, studentName: 'Past Student Epsilon', studentRegNo: '3122215003020', eventName: 'Cultural Workshop', eventDate: '2025-02-20', proofUrl: null, status: 'rejected', actionTimestamp: '2025-02-21T14:30:00Z', rejectionReason: 'Not relevant to course.' },
            { id: 203, studentName: 'Past Student Zeta', studentRegNo: '3122215003025', eventName: 'Career Fair', eventDate: '2025-01-15', proofUrl: 'event-placeholder.png', status: 'approved', actionTimestamp: '2025-01-16T11:00:00Z', rejectionReason: null, attendance: null }, // Example of approved but no attendance submitted yet
        ];
        
        loadingMsg.style.display = 'none';
        loadingHistoryMsg.style.display = 'none';
        renderPendingRequests(allRequests);
        renderActionHistory(actionHistory);
        console.log("Fetched pending requests:", allRequests);
        console.log("Fetched action history:", actionHistory);
    }

    function openOdActionModal(originalRequest, actionType, targetElement) {
        currentActionDetails = { 
            id: originalRequest.id, 
            action: actionType, 
            element: targetElement,
            originalRequest: originalRequest 
        };

        odActionModalTitle.textContent = actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection';
        odActionModalMessage.textContent = `Are you sure you want to ${actionType} the OD request for ${originalRequest.studentName} (${originalRequest.studentRegNo}) regarding the event "${originalRequest.eventName}"?`;
        
        if (actionType === 'reject') {
            odActionReasonContainer.style.display = 'block';
            odActionModalReasonInput.value = ''; 
            odActionModalReasonInput.placeholder = 'Enter reason here (optional)...';
        } else {
            odActionReasonContainer.style.display = 'none';
        }

        if (odActionModal) {
            odActionModal.style.display = 'flex';
            setTimeout(() => odActionModal.classList.add('active'), 10);
        }
    }

    function closeOdActionModal() {
        if (odActionModal) {
            odActionModal.classList.remove('active');
            setTimeout(() => odActionModal.style.display = 'none', 300);
        }
    }

    async function handleAction() { 
        const { id, action, originalRequest } = currentActionDetails;
        let reason = null;

        if (action === 'reject') {
            reason = odActionModalReasonInput.value.trim();
        }
        
        if (!originalRequest) {
            console.error("Original request details not found for action.");
            closeOdActionModal();
            return;
        }

        const actionText = action === 'approve' ? 'Approving' : 'Rejecting';
        console.log(`${actionText} request ID: ${id}` + (reason ? ` with reason: ${reason}` : ''));
        
        // Show visual feedback
        currentActionDetails.element.style.opacity = '0.5'; 
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Simulated ${action} for request ${id}`);
        
        // --- Create a new item for the history log ---
        const processedItem = {
            ...originalRequest, 
            status: (action === 'approve' ? 'approved' : 'rejected'), 
            actionTimestamp: new Date().toISOString(),
            rejectionReason: reason,
            attendance: null // Attendance is null when first approved/rejected
        };
        actionHistory.push(processedItem);
        // --- Remove the item from the pending list ---
        allRequests = allRequests.filter(req => req.id !== id);
        
        // --- Re-render both lists to reflect the change ---
        const currentPendingSearch = searchInput.value.toLowerCase().trim();
        renderPendingRequests(currentPendingSearch ? allRequests.filter(req => 
            req.studentName.toLowerCase().includes(currentPendingSearch) || req.studentRegNo.includes(currentPendingSearch)
        ) : allRequests);

        const currentHistorySearch = historySearchInput.value.toLowerCase().trim();
        renderActionHistory(currentHistorySearch ? actionHistory.filter(item =>
            item.studentName.toLowerCase().includes(currentHistorySearch) || item.studentRegNo.includes(currentHistorySearch)
        ) : actionHistory);

        closeOdActionModal();
    }

    function addEventListenersToPendingButtons() {
        // This delegation approach is more efficient, especially for dynamic content
        odListContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('.approve-button') || target.matches('.reject-button')) {
                const card = target.closest('.od-card');
                if (card) {
                    const originalRequest = JSON.parse(card.dataset.originalRequest);
                    const actionType = target.classList.contains('approve-button') ? 'approve' : 'reject';
                    openOdActionModal(originalRequest, actionType, card);
                }
            }
        });
    }

    if (confirmOdActionButton) {
        confirmOdActionButton.addEventListener('click', handleAction); 
    }

    if (cancelOdActionButton) {
        cancelOdActionButton.addEventListener('click', closeOdActionModal);
    }

    // Close modal if clicking on the background overlay
    if (odActionModal) {
        odActionModal.addEventListener('click', function(e) {
            if (e.target === odActionModal) {
                closeOdActionModal();
            }
        });
    }
    
    // --- Search/Filter Event Listeners ---
    if (searchInput) { 
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredRequests = allRequests.filter(request =>
                request.studentName.toLowerCase().includes(searchTerm) ||
                request.studentRegNo.includes(searchTerm)
            );
            renderPendingRequests(filteredRequests);
        });
    }

    if (historySearchInput) { 
        historySearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredHistory = actionHistory.filter(item =>
                item.studentName.toLowerCase().includes(searchTerm) ||
                item.studentRegNo.includes(searchTerm)
            );
            renderActionHistory(filteredHistory);
        });
    }

    // --- Initial Data Load ---
    fetchData();
});
