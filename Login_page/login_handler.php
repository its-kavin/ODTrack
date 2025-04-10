<?php
// Start a session to store login status
session_start();

// --- Database Connection Placeholder ---
// In a real application, you would connect to your database here.
// Replace these lines with your actual database connection code (e.g., using PDO or mysqli).
/*
$db_host = 'localhost';
$db_name = 'your_database_name';
$db_user = 'your_database_username';
$db_pass = 'your_database_password';

try {
    $db = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // die() stops the script and shows an error. Should be more user-friendly in production.
    die("Database connection failed: " . $e->getMessage());
}
*/
// --- End Database Connection Placeholder ---

// Check if the form was submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get the submitted data (use htmlspecialchars to prevent basic XSS attacks)
    $userType = isset($_POST['user-type']) ? htmlspecialchars($_POST['user-type']) : '';
    $userInput = isset($_POST['user-input']) ? htmlspecialchars($_POST['user-input']) : ''; // This is RegNo for student, Email for staff/admin
    $password = isset($_POST['password']) ? $_POST['password'] : ''; // Don't use htmlspecialchars on password before hashing/checking

    // Basic validation: Check if fields are empty
    if (empty($userType) || empty($userInput) || empty($password)) {
        // Redirect back to login with an error message (using query parameters)
        header("Location: Login Page.html?error=emptyfields");
        exit(); // Stop script execution after redirect
    }

    // --- User Verification Placeholder ---
    // This is where you would query your database and verify the user.
    // The logic depends heavily on your database structure.

    $login_successful = false; // Assume login fails initially

    // ** EXAMPLE: SIMULATED LOGIN CHECK (Replace with real database query!) **
    if ($userType == 'student') {
        // Example: Check if student RegNo is '12345' and password (DOB) is 'password'
        if ($userInput == '3122215001001' && $password == 'password123') { // Replace with database check
             $login_successful = true;
             $_SESSION['user_id'] = $userInput; // Store RegNo in session
             $_SESSION['user_type'] = 'student';
        }
    } elseif ($userType == 'staff') {
        // Example: Check if staff email is 'staff@example.com' and password is 'password'
         if ($userInput == 'staff@sathyabama.ac.in' && $password == 'staffpass') { // Replace with database check
            $login_successful = true;
            $_SESSION['user_id'] = $userInput; // Store email in session
            $_SESSION['user_type'] = 'staff';
         }
    } elseif ($userType == 'admin') {
         // Example: Check if admin email is 'admin@example.com' and password is 'password'
         if ($userInput == 'admin@sathyabama.ac.in' && $password == 'adminpass') { // Replace with database check
             $login_successful = true;
             $_SESSION['user_id'] = $userInput; // Store email in session
             $_SESSION['user_type'] = 'admin';
         }
    }
    // ** END OF SIMULATED LOGIN CHECK **


    // --- Redirect based on login result ---
    if ($login_successful) {
        // Login was successful, redirect to the appropriate dashboard
        if ($_SESSION['user_type'] == 'student') {
            header("Location: dashboard.html"); // Redirect student
            exit();
        } elseif ($_SESSION['user_type'] == 'staff') {
            header("Location: counselor_dashboard.html"); // Redirect staff (counselor)
            exit();
        } elseif ($_SESSION['user_type'] == 'admin') {
            // header("Location: admin_dashboard.html"); // Redirect admin (create this page)
            // For now, just redirect to a generic success page or dashboard
             header("Location: dashboard.html?role=admin"); // Or redirect to a specific admin page
            exit();
        }
    } else {
        // Login failed - Redirect back to login page with an error
        header("Location: Login Page.html?error=invalidcredentials");
        exit();
    }

} else {
    // If someone tries to access this page directly without POST data
    header("Location: Login Page.html");
    exit();
}
?>