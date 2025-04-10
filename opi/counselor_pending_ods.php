<?php
// File: ODTrack/api/counselor_pending_ods.php

session_start();
// Adjust path to your db_connect.php (from api folder go up one level)
require_once '../config/db_connect.php';
// Set the content type to JSON for the response
header('Content-Type: application/json');

$response = []; // Initialize response array

// --- Security Check: Ensure user is logged in and is staff/admin ---
// Adjust user types if needed (e.g., allow 'admin' too)
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_type'], ['staff', 'admin'])) {
    http_response_code(401); // Unauthorized
    $response['error'] = 'Unauthorized access.';
    echo json_encode($response);
    exit();
}

try {
    // Fetch pending OD requests, joining with users table to get student name
    // Adjust columns based on what counselor_dashboard.js expects (e.g., studentName, studentRegNo)
    $sql = "SELECT
                od.request_id as id,
                u.full_name as studentName,
                u.username as studentRegNo, -- Assuming student username is RegNo
                od.event_name as eventName,
                od.event_date as eventDate,
                od.request_date as submittedDate,
                od.proof_path as proofUrl
            FROM od_requests od
            JOIN users u ON od.student_user_id = u.user_id
            WHERE od.status = 'Pending'
            ORDER BY od.request_date ASC"; // Or order as needed

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $pending_requests = $stmt->fetchAll();

    // Return the fetched requests as JSON
    echo json_encode($pending_requests);

} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    error_log("API counselor_pending_ods Error: " . $e->getMessage());
    $response['error'] = 'Database error fetching pending requests.';
    echo json_encode($response);
    exit();
}
?>