<?php
session_start(); // Start session at the very beginning

// Include your database connection file
// The path '../config/db_connect.php' assumes db_connect.php is in a 'config' folder
// one level above the 'Login_page' folder. Adjust if your structure is different.
require_once '../config/db_connect.php';

// Check if the form was submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get submitted data (sanitize input)
    $userType = filter_input(INPUT_POST, 'user-type', FILTER_SANITIZE_SPECIAL_CHARS);
    $userInput = filter_input(INPUT_POST, 'user-input', FILTER_SANITIZE_SPECIAL_CHARS); // RegNo or Email
    $password = $_POST['password']; // Get raw password

    // Basic validation
    if (empty($userType) || empty($userInput) || empty($password)) {
        // Redirect back to login with an error message
        header("Location: Login Page.html?error=emptyfields");
        exit(); // Stop script execution after redirect
    }

    try {
        // Prepare SQL statement to find the user by username and type
        // Using prepared statements prevents SQL injection vulnerabilities
        $sql = "SELECT user_id, username, password, user_type, full_name
                FROM users
                WHERE username = :username AND user_type = :user_type
                LIMIT 1"; // Limit 1 because username should be unique for a given type

        $stmt = $db->prepare($sql);

        // Bind the input values to the placeholders in the SQL query
        $stmt->bindParam(':username', $userInput);
        $stmt->bindParam(':user_type', $userType);

        // Execute the prepared statement
        $stmt->execute();

        // Fetch the user record (if found) as an associative array
        $user = $stmt->fetch();

        // Verify if a user was found AND if the submitted password matches the hashed password in the database
        if ($user && password_verify($password, $user['password'])) {
            // Password is correct! Login successful.

            // Regenerate session ID for security
            session_regenerate_id(true);

            // Store essential user information in the session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['username'] = $user['username']; // Store username (RegNo/Email)
            $_SESSION['full_name'] = $user['full_name']; // Store full name if available

            // Redirect based on user type
            if ($user['user_type'] == 'student') {
                // Redirect student to the correct student dashboard page
                // Adjust this path based on your final file structure
                header("Location: ../Student_page/student_Form/dashboard.html");
                exit();
            } elseif ($user['user_type'] == 'staff') {
                // Redirect staff to the counselor dashboard page
                // Adjust this path based on your final file structure
                header("Location: ../Counselor_page/counselor_dashboard.html");
                exit();
            } elseif ($user['user_type'] == 'admin') {
                // Redirect admin (create an admin dashboard page later)
                // header("Location: ../Admin_page/admin_dashboard.html"); // Example path
                echo "Admin login successful! (Admin Dashboard Redirect Not Set)"; // Placeholder
                exit();
            } else {
                 // Should not happen if user_type ENUM is set correctly, but good to handle
                 header("Location: Login Page.html?error=invalidrole");
                 exit();
            }

        } else {
            // Login failed - User not found or password incorrect
            header("Location: Login Page.html?error=invalidcredentials");
            exit();
        }

    } catch (PDOException $e) {
        // Handle potential database errors during query execution
        // In a real application, log this error instead of showing details to the user
        error_log("Login Database Error: " . $e->getMessage());
        header("Location: Login Page.html?error=dberror");
        exit();
    }

} else {
    // If someone tries to access this page directly without POST data, redirect them to the login page
    header("Location: Login Page.html");
    exit();
}

/* --- IMPORTANT NOTE on Adding Users ---
This script only handles LOGIN. You need a separate way to add users to the 'users' table
with properly HASHED passwords. You could:
1. Manually insert users via phpMyAdmin, making sure to use PHP's password_hash() function
   to generate the hash for the 'password' column. Example: Use an online PHP sandbox
   or a temporary script to run `echo password_hash('yourChosenPassword', PASSWORD_DEFAULT);`
   and copy the resulting hash into phpMyAdmin.
2. Create a separate registration script (e.g., `register.php`) that takes user details,
   hashes the password using `password_hash()`, and inserts the new user into the database.
   (This is more complex and requires careful security considerations).
*/
?>