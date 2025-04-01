document.getElementById("user-type").addEventListener("change", function () {
    var userType = this.value;
    var userInput = document.getElementById("user-input");
    var heading = document.getElementById("login-heading");

    if (userType === "staff" || userType === "admin") {
        userInput.placeholder = "Enter Email";
        userInput.type = "email";
        userInput.value = "";
        userInput.setAttribute("pattern", ".*");
        userInput.removeAttribute("inputmode");
        heading.innerText = "Enter your email and password to access " + (userType === "staff" ? "staff" : "admin") + " panel.";
    } else {
        userInput.placeholder = "Register Number";
        userInput.type = "text";
        userInput.value = "";
        userInput.setAttribute("inputmode", "numeric");
        userInput.setAttribute("pattern", "[0-9]*");
        heading.innerText = "Enter your RegNo and DOB to access student panel.";
    }
});

document.getElementById("user-input").addEventListener("keypress", function (event) {
    var userType = document.getElementById("user-type").value;
    if (userType === "student" && !/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector(".password").focus();
    }
});

document.querySelector(".password").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        validateAndLogin();
    }
});

document.querySelector('.login-button').addEventListener('click', function () {
    validateAndLogin();
});

function validateAndLogin() {
    var userInput = document.getElementById("user-input").value;
    var password = document.querySelector(".password").value;

    // Check if both fields are filled
    if (userInput.trim() === "" || password.trim() === "") {
        alert("Please fill in all required fields.");
    } else {
        window.location.href = 'dashboard.html';
    }
}