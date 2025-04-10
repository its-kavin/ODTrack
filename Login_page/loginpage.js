document.addEventListener("DOMContentLoaded", function() {

    const userTypeSelect = document.getElementById("user-type");
    const userInput = document.getElementById("user-input");
    const passwordInput = document.querySelector(".password");
    const heading = document.getElementById("login-heading");
    const loginButton = document.querySelector('.login-button');

    // Function to update placeholder and input type based on user type
    function updateUserSpecificFields() {
        var userType = userTypeSelect.value;

        // Reset previous errors
        userInput.classList.remove('error');
        passwordInput.classList.remove('error');
        userInput.style.borderColor = '#ccc';
        passwordInput.style.borderColor = '#ccc';

        if (userType === "staff" || userType === "admin") {
            userInput.placeholder = "Enter Email";
            userInput.type = "email"; // Use email type for staff/admin
            userInput.value = ""; // Clear previous input
            userInput.removeAttribute("inputmode");
            userInput.removeAttribute("pattern");
            heading.innerText = "Enter your email and password to access " + (userType === "staff" ? "staff" : "admin") + " panel.";
        } else { // Default to student
            userInput.placeholder = "Register Number";
            userInput.type = "text"; // Use text type for student RegNo
            userInput.value = ""; // Clear previous input
            userInput.setAttribute("inputmode", "numeric"); // Hint for numeric keyboard
            userInput.setAttribute("pattern", "[0-9]*"); // Allow only numbers (via pattern)
            heading.innerText = "Enter your RegNo and DOB to access student panel.";
        }
    }

    // Event listener for user type change
    if (userTypeSelect) {
        userTypeSelect.addEventListener("change", updateUserSpecificFields);
    }

    // Event listener for input validation (Student RegNo - allow only numbers)
    if (userInput) {
        userInput.addEventListener("keypress", function (event) {
            var userType = userTypeSelect ? userTypeSelect.value : 'student';
            // Allow only numbers if student type is selected
            if (userType === "student" && !/[0-9]/.test(event.key)) {
                // Allow control keys like backspace, delete, arrow keys, enter, tab etc.
                if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1 && event.keyCode !== 8 && event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 46) {
                    event.preventDefault();
                }
            }
            // Move focus to password on Enter key
            if (event.key === "Enter") {
                event.preventDefault();
                if(passwordInput) passwordInput.focus();
            }
        });
        // Reset error style on input
        userInput.addEventListener('input', function() {
            if (this.style.borderColor === 'red') {
                this.style.borderColor = '#ccc';
                this.classList.remove('error');
            }
        });
    }

    // Event listener for password input (trigger login on Enter)
    if (passwordInput) {
        passwordInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                validateAndLogin();
            }
        });
         // Reset error style on input
        passwordInput.addEventListener('input', function() {
            if (this.style.borderColor === 'red') {
                this.style.borderColor = '#ccc';
                this.classList.remove('error');
            }
        });
    }

    // Event listener for login button click
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            validateAndLogin();
        });
    }

    // Function to validate fields and simulate login
    function validateAndLogin() {
        var userType = userTypeSelect ? userTypeSelect.value : 'student'; // Get selected user type
        var userInputValue = userInput ? userInput.value : '';
        var passwordValue = passwordInput ? passwordInput.value : '';
        var isValid = true;

        // Reset previous errors
        if (userInput) {
            userInput.style.borderColor = '#ccc';
            userInput.classList.remove('error');
        }
        if (passwordInput) {
            passwordInput.style.borderColor = '#ccc';
            passwordInput.classList.remove('error');
        }


        // Check if fields are empty
        if (userInputValue.trim() === "") {
            if (userInput) {
                userInput.style.borderColor = 'red';
                userInput.classList.add('error');
            }
            isValid = false;
        }
        if (passwordValue.trim() === "") {
             if (passwordInput) {
                 passwordInput.style.borderColor = 'red';
                 passwordInput.classList.add('error');
             }
            isValid = false;
        }

        // If validation fails, log and stop
        if (!isValid) {
            console.warn("Login validation failed: Please fill in all required fields.");
            // Alert removed as per request
            // alert("Please fill in all required fields.");
            return;
        }

        // --- Placeholder for actual login logic ---
        // Here you would typically send the username/password to a server
        // for verification using fetch() or similar.
        // For now, we just redirect based on user type after successful validation.
        // -----------------------------------------

        console.log(`Login validation passed for ${userType}. Redirecting...`);

        // **MODIFICATION START**
        if (userType === 'staff') {
            window.location.href = 'counselor_dashboard.html'; // Redirect staff to counselor dashboard
        } else if (userType === 'student') {
            window.location.href = 'dashboard.html'; // Redirect students to student dashboard
        } else if (userType === 'admin') {
            // Define where admin should go, e.g., 'admin_dashboard.html'
            // window.location.href = 'admin_dashboard.html';
            console.log('Admin login successful, redirect path not defined yet.'); // Placeholder
        } else {
            // Fallback or error handling if user type is unexpected
            console.error('Unknown user type selected.');
        }
        // **MODIFICATION END**
    }

    // Initialize fields based on default selection when the page loads
    updateUserSpecificFields();
});