// Handles functionality potentially shared across forms (like logout)
// And specific validation for the dashboard OD request form.

document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- Logout Button Functionality ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            console.log("Logging out...");
            // Add actual logout logic here if needed (e.g., clearing session storage)
            window.location.href = 'Login Page.html'; // Redirect to login page
        });
    } else {
        // This might appear on odpending.html if logout button ID isn't found there
        // console.warn("Logout button not found on this page."); 
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

        // Add submit event listener for validation
        odForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // 1. Validate Event Date (ensure it's not in the past - handled by 'min' attribute mostly)
            if (eventDateInput) {
                const eventDate = new Date(eventDateInput.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Compare dates only

                if (!eventDateInput.value || eventDate < today) {
                    alert("Event date cannot be in the past or empty.");
                    eventDateInput.focus(); // Focus the problematic field
                    isValid = false;
                }
            }

            // 2. ** Prevent Duplicate OD Request on the Same Date **
            // This requires fetching existing OD dates for the user.
            // This is a placeholder - replace with actual logic.
            const simulateExistingODDates = ['2025-05-15', '2025-06-10']; // Example existing dates
            const newEventDate = eventDateInput ? eventDateInput.value : '';
            
            if (newEventDate && simulateExistingODDates.includes(newEventDate)) {
               alert(`You already have an OD request submitted for ${newEventDate}. You cannot request multiple ODs for the same date.`);
               isValid = false;
            }
            
            // If any validation failed, prevent form submission
            if (!isValid) {
                e.preventDefault(); // Stop the form from submitting
                console.warn("OD Form validation failed.");
                return; 
            }

            // If validation passes, allow the form to submit
            console.log("OD form validation passed. Submitting..."); 
            // The form will now submit to the 'action' URL ('submit_event.php')
        });
    }
});