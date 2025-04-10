document.addEventListener('DOMContentLoaded', (event) => {

    // --- Modal Elements ---
    const logoutModal = document.getElementById('logout-confirm-modal');
    const confirmLogoutBtn = document.getElementById('confirm-logout-yes');
    const cancelLogoutBtn = document.getElementById('confirm-logout-no');
    const originalLogoutButton = document.getElementById('logout-button'); // Your existing logout button

    // --- Function to Show Modal ---
    function showLogoutModal() {
        if (logoutModal) {
            logoutModal.style.display = 'flex'; // Use flex to show and center
        }
    }

    // --- Function to Hide Modal ---
    function hideLogoutModal() {
        if (logoutModal) {
            logoutModal.style.display = 'none';
        }
    }

    // --- Logout Button Functionality (Now opens modal) ---
    if (originalLogoutButton) {
        originalLogoutButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent any default behavior if it was a link/submit
            console.log("Logout button clicked, showing confirmation modal...");
            showLogoutModal(); // Show the modal instead of logging out directly
        });
    } else {
        // This might appear on pages without the logout button
        // console.warn("Logout button not found on this page.");
    }

    // --- Modal Button Actions ---
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', function () {
            console.log("Confirmed logout. Redirecting...");
            // Add actual logout logic here if needed (e.g., clearing session storage)
            window.location.href = 'Login Page.html'; // Redirect to login page
        });
    }

    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', function () {
            console.log("Cancelled logout.");
            hideLogoutModal(); // Just hide the modal
        });
    }

    // Optional: Close modal if clicking outside the content area
    if (logoutModal) {
        logoutModal.addEventListener('click', function(e) {
            // Check if the click is on the overlay itself, not the content
            if (e.target === logoutModal) {
                console.log("Clicked outside modal content, hiding modal.");
                hideLogoutModal();
            }
        });
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
            // **PREVENT DEFAULT SUBMISSION TO HANDLE REDIRECT HERE**
            e.preventDefault(); // Stop the form from submitting to PHP immediately

            let isValid = true;
            const errorMessages = []; // Store validation errors

            // --- Start Validation ---
            // (Keep your existing validation logic here)

            // 1. Validate Event Date
            if (eventDateInput) {
                const eventDateValue = eventDateInput.value;
                if (!eventDateValue) {
                    errorMessages.push("Event date cannot be empty.");
                    isValid = false;
                } else {
                    const eventDate = new Date(eventDateValue + 'T00:00:00'); // Ensure comparison is at start of day
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Compare dates only

                    if (eventDate < today) {
                        errorMessages.push("Event date cannot be in the past.");
                        isValid = false;
                    }
                }
            }

            // Add other necessary validations (name, phone, event name, counselor selection)
             const nameInput = document.getElementById('name');
             const phoneInput = document.getElementById('phone_number');
             const eventNameInput = document.getElementById('event_name');
             const counselorSelect = document.getElementById('counselor');

             if (nameInput && nameInput.value.trim() === '') {
                errorMessages.push("Name cannot be empty.");
                isValid = false;
             }
              if (phoneInput && !/^[0-9]{10}$/.test(phoneInput.value)) {
                 errorMessages.push("Please enter a valid 10-digit phone number.");
                 isValid = false;
             }
             if (eventNameInput && eventNameInput.value.trim() === '') {
                 errorMessages.push("Event Name cannot be empty.");
                 isValid = false;
             }
             if (counselorSelect && counselorSelect.value === '') {
                 errorMessages.push("Please select a counselor.");
                 isValid = false;
             }

            // ** Placeholder for Prevent Duplicate OD Request on the Same Date **
            // (Keep this logic if you implement it)
            // const simulateExistingODDates = ['2025-05-15', '2025-06-10'];
            // const newEventDate = eventDateInput ? eventDateInput.value : '';
            // if (newEventDate && simulateExistingODDates.includes(newEventDate)) {
            //    errorMessages.push(`You already have an OD request submitted for ${newEventDate}.`);
            //    isValid = false;
            // }

            // --- End Validation ---


            // If any validation failed, show errors and STOP
            if (!isValid) {
                alert("Please fix the following issues:\n\n- " + errorMessages.join("\n- "));
                // Optionally focus the first problematic field
                // ... (focus logic can be added here if needed) ...
                console.warn("OD Form validation failed.");
                return; // Stop execution
            }

            // **IF VALIDATION PASSES, REDIRECT**
            console.log("OD form validation passed. Redirecting to OD Pending page...");

            // --- !!! IMPORTANT !!! ---
            // This redirect happens *instead* of submitting data to submit_event.php
            // If you need to submit data first (e.g., using AJAX/fetch),
            // you would replace this redirect with your AJAX call,
            // and place the redirect inside the AJAX success handler.
            // --- !!! IMPORTANT !!! ---
            window.location.href = 'odpending.html';

            // If you were using AJAX, the code might look something like this *instead* of the line above:
            /*
            const formData = new FormData(odForm);
            fetch('submit_event.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Or .text() depending on server response
            .then(data => {
                console.log('Success:', data);
                // Redirect AFTER successful server response
                window.location.href = 'odpending.html';
            })
            .catch((error) => {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your request. Please try again.');
            });
            */

        }); // End of form submit listener
    } // End of if(odForm)

}); // End of DOMContentLoaded listener