// Handles functionality potentially shared across forms (like logout)
// And specific validation for the dashboard OD request form.

document.addEventListener('DOMContentLoaded', (event) => {

    // --- Logout Button Functionality with Custom Modal ---
    const logoutButton = document.getElementById('logout-button');
    const logoutConfirmModal = document.getElementById('logout-confirm-modal');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');

    if (logoutButton && logoutConfirmModal && confirmLogoutBtn && cancelLogoutBtn) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default button action
            logoutConfirmModal.style.display = 'flex'; // Show the modal overlay
            setTimeout(() => { // Allow display to be set before adding class for transition
                logoutConfirmModal.classList.add('active');
            }, 10); // Small delay
        });

        confirmLogoutBtn.addEventListener('click', function () {
            console.log("Logging out...");
            // Add actual logout logic here if needed (e.g., clearing session storage, calling a logout API)
            window.location.href = 'Login Page.html'; // Redirect to login page
        });

        cancelLogoutBtn.addEventListener('click', function () {
            logoutConfirmModal.classList.remove('active');
            setTimeout(() => { // Wait for transition to finish before hiding
                 logoutConfirmModal.style.display = 'none';
            }, 300); // Match transition duration in CSS (opacity 0.3s)
            console.log("Logout cancelled.");
        });

        // Optional: Close modal if user clicks on the overlay
        logoutConfirmModal.addEventListener('click', function(e) {
            // Check if the click is on the overlay itself (logoutConfirmModal) and not its children (modal-content)
            if (e.target === logoutConfirmModal) {
                cancelLogoutBtn.click(); // Simulate a cancel click
            }
        });

    } else {
        // More robust check to see which element is missing, helpful for debugging
        if (!logoutButton) console.warn("Logout button with ID 'logout-button' not found on this page.");
        if (!logoutConfirmModal) console.warn("Logout confirm modal with ID 'logout-confirm-modal' not found on this page.");
        if (!confirmLogoutBtn) console.warn("Confirm logout button with ID 'confirm-logout-btn' not found on this page.");
        if (!cancelLogoutBtn) console.warn("Cancel logout button with ID 'cancel-logout-btn' not found on this page.");
    }

    // --- Dashboard OD Request Form Specific Logic ---
    const odForm = document.getElementById('od-request-form');
    if (odForm) {
        const eventDateInput = document.getElementById('event_date');

        // Function to get today's date in YYYY-MM-DD format
        function getTodayDateString() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Set the minimum date for the event date input to today
        if (eventDateInput) {
            eventDateInput.setAttribute('min', getTodayDateString());
        }

        // Add submit event listener for validation AND REDIRECT
        odForm.addEventListener('submit', function(e) {
            e.preventDefault(); // ALWAYS prevent default submission first

            let isValid = true;

            // 1. Validate Event Date
            if (eventDateInput) {
                const eventDateValue = eventDateInput.value;
                const eventDate = new Date(eventDateValue);
                // Adjust today to be at the very start of the day for comparison
                const today = new Date();
                const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());


                if (!eventDateValue) { // Check if date is empty
                    alert("Event date cannot be empty.");
                    eventDateInput.focus();
                    isValid = false;
                } else if (eventDate < todayNormalized) { // Check if date is in the past
                    alert("Event date cannot be in the past.");
                    eventDateInput.focus(); // Focus the problematic field
                    isValid = false;
                }
            }

            // 2. ** Prevent Duplicate OD Request on the Same Date (Simulated) **
            // This is a placeholder. For a real application, you'd likely check against
            // data fetched from a server or stored in localStorage.
            const simulateExistingODDates = ['2025-05-15', '2025-06-10']; // Example existing dates
            const newEventDate = eventDateInput ? eventDateInput.value : '';

            // Only run this check if previous validations passed
            if (isValid && newEventDate && simulateExistingODDates.includes(newEventDate)) {
               alert(`You already have an OD request submitted for ${newEventDate}. You cannot request multiple ODs for the same date (simulated check).`);
               isValid = false;
            }

            // If any validation failed, do not proceed
            if (!isValid) {
                console.warn("OD Form validation failed.");
                return; // Stop further execution
            }

            // If validation passes:
            console.log("OD form validation passed. Redirecting to odpending.html...");
            window.location.href = 'odpending.html';
        });
    }
});