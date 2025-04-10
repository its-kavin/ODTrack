<?php
// File: ODTrack/Student_page/student_Form/submit_event.php

session_start();
// Adjust the path below to correctly point to your db_connect.php file
// This assumes db_connect.php is in YourProject/config/
require_once '../../config/db_connect.php';

// --- Security Check: Ensure user is logged in and is a student ---
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'student') {
    // Not logged in or not a student, redirect to login page
    // Adjust path to your login page if needed
    header("Location: ../../Login_page/Login Page.html");
    exit();
}

// Check if the form was submitted via POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Get Data from Form ---
    $student_user_id = $_SESSION['user_id']; // Get student ID from the current session

    // Get and sanitize other form inputs
    // FILTER_SANITIZE_SPECIAL_CHARS helps prevent basic XSS attacks
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS); // Name submitted on form
    $phone_number = filter_input(INPUT_POST, 'phone_number', FILTER_SANITIZE_SPECIAL_CHARS); // Phone submitted
    $event_name = filter_input(INPUT_POST, 'event_name', FILTER_SANITIZE_SPECIAL_CHARS);
    $event_date = filter_input(INPUT_POST, 'event_date'); // Date input type
    $counselor_name = filter_input(INPUT_POST, 'counselor', FILTER_SANITIZE_SPECIAL_CHARS);

    // --- Server-Side Validation ---
    $errors = []; // Array to hold validation errors
    if (empty($event_name)) { $errors[] = "Event Name is required."; }
    if (empty($event_date)) { $errors[] = "Event Date is required."; }
    if (empty($counselor_name)) { $errors[] = "Counselor selection is required."; }
    // Add validation for name, phone if needed

    // Validate event date format and ensure it's not in the past
    if (!empty($event_date)) {
        // Check if the date is valid and not in the past (compare date part only)
        $event_timestamp = strtotime($event_date);
        $today_timestamp = strtotime('today'); // Midnight today
        if ($event_timestamp === false || $event_timestamp < $today_timestamp) {
            $errors[] = "Event date must be today or a future date.";
        }
    }
     // You might want to add validation to prevent duplicate OD requests for the same student on the same date here
     // This would involve querying the database first.

    // If there are validation errors, redirect back to the form with an error message
    if (!empty($errors)) {
        // Store errors in session to display them on the form page (optional, more advanced)
        // $_SESSION['form_errors'] = $errors;
        // Redirect back to the form page
        header("Location: dashboard.html?error=" . urlencode(implode(', ', $errors))); // Simple error passing via URL
        exit();
    }

    // --- Handle Optional File Upload (Event Poster/Proof) ---
    $proof_path = null; // Initialize proof path as null

    // Check if a file was uploaded and there were no upload errors
    if (isset($_FILES['event_poster']) && $_FILES['event_poster']['error'] == UPLOAD_ERR_OK) {

        // --- IMPORTANT: Create the 'uploads' directory ---
        // You MUST manually create an 'uploads' folder inside your main 'ODTrack' project folder.
        // Inside 'uploads', create another folder named 'proofs'.
        // Ensure your web server (Apache in XAMPP) has permission to write files into this 'uploads/proofs/' directory.
        $target_dir = "../../uploads/proofs/"; // Relative path from this script to the target directory

        // Create a unique filename to prevent overwriting existing files
        $file_extension = strtolower(pathinfo($_FILES['event_poster']['name'], PATHINFO_EXTENSION));
        $unique_filename = uniqid('proof_', true) . '.' . $file_extension; // e.g., proof_60c7c8d3e1a2b3.45678901.jpg
        $target_file = $target_dir . $unique_filename;

        // Define allowed file types and maximum size
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
        $max_file_size = 5 * 1024 * 1024; // 5 MB limit

        // Validate file type and size
        if (!in_array($file_extension, $allowed_types)) {
            header("Location: dashboard.html?error=" . urlencode("Invalid proof file type. Allowed: " . implode(', ', $allowed_types)));
            exit();
        }
        if ($_FILES['event_poster']['size'] > $max_file_size) {
             header("Location: dashboard.html?error=" . urlencode("Proof file size exceeds the limit of 5MB."));
             exit();
        }

        // Ensure target directory exists (attempt to create if not, though manual creation is safer)
        if (!is_dir($target_dir)) {
            // Attempt to create directory recursively with full permissions (may fail depending on server setup)
            if (!mkdir($target_dir, 0777, true)) {
                 header("Location: dashboard.html?error=" . urlencode("Failed to create upload directory. Please check permissions."));
                 exit();
            }
        }

        // Try to move the uploaded file from its temporary location to the target directory
        if (move_uploaded_file($_FILES['event_poster']['tmp_name'], $target_file)) {
            // File uploaded successfully, store the relative path to be saved in the database
            // Store path relative to the project root (ODTrack) folder makes it easier to manage
            $proof_path = "uploads/proofs/" . $unique_filename;
        } else {
            // Failed to move the file (permissions issue?)
            header("Location: dashboard.html?error=" . urlencode("Failed to save uploaded proof file. Check directory permissions."));
            exit();
        }
    } // End of file upload handling

    // --- Insert OD Request into Database ---
    try {
        $sql = "INSERT INTO od_requests (student_user_id, event_name, event_date, counselor_name, proof_path, status, request_date)
                VALUES (:student_id, :event_name, :event_date, :counselor, :proof_path, 'Pending', NOW())";
                // NOW() gets the current database server timestamp

        $stmt = $db->prepare($sql);

        // Bind parameters to the prepared statement
        $stmt->bindParam(':student_id', $student_user_id, PDO::PARAM_INT);
        $stmt->bindParam(':event_name', $event_name);
        $stmt->bindParam(':event_date', $event_date);
        $stmt->bindParam(':counselor', $counselor_name);
        // Bind proof_path (which might be null if no file was uploaded)
        $stmt->bindParam(':proof_path', $proof_path, $proof_path === null ? PDO::PARAM_NULL : PDO::PARAM_STR);

        // Execute the statement to insert the data
        $stmt->execute();

        // --- Redirect on Success ---
        // Redirect the user to the OD status page after successful insertion
        // Adjust path if needed
        header("Location: ../student_ODpending/odpending.html?success=request_submitted");
        exit();

    } catch (PDOException $e) {
        // Handle potential database errors during insertion
        error_log("OD Submit Database Error: " . $e->getMessage());
        // Redirect back to the form with a generic database error message
        header("Location: dashboard.html?error=dberror");
        exit();
    }

} else {
    // If the script was accessed without POST data (e.g., directly typing URL), redirect to the form
    header("Location: dashboard.html");
    exit();
}
?>