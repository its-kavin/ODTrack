document.getElementById("user-type").addEventListener("change", function() {
    var userType = this.value;
    var userInput = document.getElementById("user-input");
    var heading = document.getElementById("login-heading");

    if (userType === "staff" || userType === "admin") {
        userInput.placeholder = "Enter Email";
        userInput.type = "email";
        heading.innerText = "Enter your email and password to access " + (userType === "staff" ? "staff" : "admin") + " panel.";
    } else {
        userInput.placeholder = "Register Number";
        userInput.type = "text";
        heading.innerText = "Enter your RegNo and DOB to access student panel.";
    }
});
