<?php
// File: ODTrack/Student_page/student_Geotag/upload_geotag.php

session_start();
// Adjust the path below to correctly point to your db_connect.php file
// This assumes db_connect.php is in YourProject/config/
require_once '../../config/db_connect.php';

// --- Security Check: Ensure user is logged in and is a student ---
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'student') {
    // Not logged in or not a student, redirect to login page
    header("Location: ../../Login_page/Login Page.html");
    exit();
}

// Check if the form was submitted via POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Get Data from Form ---
    // Get the hidden OD Request ID (ensure it's an integer)
    $od_request_id = filter_input(INPUT_POST, 'od_id', FILTER_VALIDATE_INT);
    $student_user_id = $_SESSION['user_id']; // Get student ID from session

    // --- Validation ---
    if (empty($od_request_id)) {
        // Redirect back if OD ID is missing or invalid
        header("Location: ../student_ODpending/odpending.html?error=missing_od_id");
        exit();
    }

    // --- Verify Ownership and Status ---
    // CRITICAL: Check if this OD request actually belongs to the logged-in student
    // AND if its status is 'Approved' before allowing the upload.
    try {
        $verify_sql = "SELECT request_id FROM od_requests
                       WHERE request_id = :request_id
                         AND student_user_id = :student_id
                         AND status = 'Approved'
                       LIMIT 1";
        $verify_stmt = $db->prepare($verify_sql);
        $verify_stmt->bindParam(':request_id', $od_request_id, PDO::PARAM_INT);
        $verify_stmt->bindParam(':student_id', $student_user_id, PDO::PARAM_INT);
        $verify_stmt->execute();

        // If fetch() returns false, no matching approved request was found for this user
        if (!$verify_stmt->fetch()) {
            // Request not found, doesn't belong to user, or is not approved
            header("Location: ../student_ODpending/odpending.html?error=invalid_request_or_not_approved");
            exit();
        }
    } catch (PDOException $e) {
        error_log("Geotag Verify DB Error: " . $e->getMessage());
        header("Location: ../student_ODpending/odpending.html?error=dberror_verify");
        exit();
    }
    // --- Verification Passed ---

    // --- Handle GeoTag File Upload ---
    // Check if the 'geotag_image' file was uploaded and there were no errors
    if (isset($_FILES['geotag_image']) && $_FILES['geotag_image']['error'] == UPLOAD_ERR_OK) {

        // --- IMPORTANT: Create the 'uploads/geotags' directory ---
        // You MUST manually create an 'uploads' folder inside your main 'ODTrack' project folder
        // if it doesn't exist. Inside 'uploads', create another folder named 'geotags'.
        // Ensure your web server (Apache) has permission to write files into 'uploads/geotags/'.
        $target_dir = "../../uploads/geotags/"; // Relative path

        // Create a unique filename, perhaps linking it to the OD request ID
        $file_extension = strtolower(pathinfo($_FILES['geotag_image']['name'], PATHINFO_EXTENSION));
        $unique_filename = "geotag_" . $od_request_id . "_" . time() . '.' . $file_extension;
        $target_file = $target_dir . $unique_filename;

        // Define allowed IMAGE file types and maximum size
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif']; // Usually images for geotags
        $max_file_size = 5 * 1024 * 1024; // 5 MB limit

        // Validate file type and size
        if (!in_array($file_extension, $allowed_types)) {
             header("Location: geotag_upload.html?od_id={$od_request_id}&error=" . urlencode("Invalid geotag file type. Allowed: jpg, jpeg, png, gif"));
             exit();
        }
        if ($_FILES['geotag_image']['size'] > $max_file_size) {
              header("Location: geotag_upload.html?od_id={$od_request_id}&error=" . urlencode("Geotag file size exceeds the limit of 5MB."));
              exit();
        }

        // Ensure target directory exists
        if (!is_dir($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                  header("Location: geotag_upload.html?od_id={$od_request_id}&error=" . urlencode("Failed to create geotag upload directory."));
                  exit();
            }
        }

        // Try to move the uploaded file
        if (move_uploaded_file($_FILES['geotag_image']['tmp_name'], $target_file)) {
            // File uploaded successfully, now update the database record
            $geotag_proof_path = "uploads/geotags/" . $unique_filename; // Store relative path

            try {
                // Prepare SQL UPDATE statement
                $update_sql = "UPDATE od_requests
                               SET geotag_proof_path = :geotag_path
                               WHERE request_id = :request_id AND student_user_id = :student_id";
                               // Double-check student_id again for safety

                $update_stmt = $db->prepare($update_sql);
                $update_stmt->bindParam(':geotag_path', $geotag_proof_path);
                $update_stmt->bindParam(':request_id', $od_request_id, PDO::PARAM_INT);
                $update_stmt->bindParam(':student_id', $student_user_id, PDO::PARAM_INT);
                $update_stmt->execute();

                // --- Redirect on Success ---
                // Redirect back to the OD status page
                header("Location: ../student_ODpending/odpending.html?success=geotag_uploaded");
                exit();

            } catch (PDOException $e) {
                error_log("Geotag DB Update Error: " . $e->getMessage());
                // If DB update fails, consider deleting the uploaded file (more advanced cleanup)
                 header("Location: geotag_upload.html?od_id={$od_request_id}&error=dberror_update");
                 exit();
            }

        } else {
            // Failed to move the file
             header("Location: geotag_upload.html?od_id={$od_request_id}&error=" . urlencode("Failed to save uploaded geotag file. Check directory permissions."));
             exit();
        }
    } else {
        // No file uploaded or there was an upload error code
        $upload_error = isset($_FILES['geotag_image']['error']) ? $_FILES['geotag_image']['error'] : 'No file uploaded.';
        header("Location: geotag_upload.html?od_id={$od_request_id}&error=" . urlencode("File upload failed. Error code: " . $upload_error));
        exit();
    }

} else {
    // If accessed without POST data, redirect to the main OD status page
    header("Location: ../student_ODpending/odpending.html");
    exit();
}
?>