document.addEventListener("DOMContentLoaded", function() {

    const userTypeSelect = document.getElementById("user-type");
    const userInput = document.getElementById("user-input");
    const passwordInput = document.querySelector(".password");
    const heading = document.getElementById("login-heading");
    const loginButton = document.querySelector('.login-button');

    function updateUserSpecificFields() {
        var userType = userTypeSelect.value;
        userInput.classList.remove('error');
        passwordInput.classList.remove('error');
        userInput.style.borderColor = '#ccc'; 
        passwordInput.style.borderColor = '#ccc';

        if (userType === "staff" || userType === "admin") {
            userInput.placeholder = "Enter Email";
            userInput.type = "email"; 
            userInput.value = ""; 
            userInput.removeAttribute("inputmode");
            userInput.removeAttribute("pattern");
            heading.innerText = "Enter your email and password to access " + (userType === "staff" ? "staff" : "admin") + " panel.";
        } else { 
            userInput.placeholder = "Register Number";
            userInput.type = "text"; 
            userInput.value = ""; 
            userInput.setAttribute("inputmode", "numeric"); 
            userInput.setAttribute("pattern", "[0-9]*"); 
            heading.innerText = "Enter your RegNo and DOB to access student panel.";
        }
    }

    if (userTypeSelect) {
        userTypeSelect.addEventListener("change", updateUserSpecificFields);
    }

    if (userInput) {
        userInput.addEventListener("keypress", function (event) {
            var userType = userTypeSelect ? userTypeSelect.value : 'student';
            if (userType === "student" && !/[0-9]/.test(event.key)) {
                if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1 && event.keyCode !== 8 && event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 46) {
                    event.preventDefault();
                }
            }
            if (event.key === "Enter") {
                event.preventDefault();
                if(passwordInput) passwordInput.focus();
            }
        });
        userInput.addEventListener('input', function() {
            if (this.style.borderColor === 'red') {
                this.style.borderColor = '#ccc';
                this.classList.remove('error');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                validateAndLogin();
            }
        });
        passwordInput.addEventListener('input', function() {
            if (this.style.borderColor === 'red') {
                this.style.borderColor = '#ccc';
                this.classList.remove('error');
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function () {
            validateAndLogin();
        });
    }

    function validateAndLogin() {
        var userInputValue = userInput ? userInput.value : '';
        var passwordValue = passwordInput ? passwordInput.value : '';
        var userType = userTypeSelect ? userTypeSelect.value : 'student'; 
        var isValid = true;

        if (userInput) {
            userInput.style.borderColor = '#ccc';
            userInput.classList.remove('error');
        }
        if (passwordInput) {
            passwordInput.style.borderColor = '#ccc';
            passwordInput.classList.remove('error');
        }

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

        if (!isValid) {
            console.warn("Login validation failed: Please fill in all required fields.");
            return; 
        }
        
        if (userType === "staff") {
            console.log("Login validation passed for staff. Redirecting to counselor dashboard...");
            window.location.href = 'counselor_dashboard.html';
        } else { 
            console.log(`Login validation passed for ${userType}. Redirecting to form page...`);
            window.location.href = 'form.html'; 
        }
    }

    updateUserSpecificFields(); 
});