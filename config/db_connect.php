<?php
// File: ODTrack/config/db_connect.php

$db_host = 'localhost'; // Usually 'localhost' for XAMPP
$db_name = 'odtrack_db'; // The database name you created
$db_user = 'root'; // Default XAMPP username (unless you changed it)
$db_pass = ''; // Default XAMPP password is empty (unless you set one)

try {
    // Create a PDO (PHP Data Objects) database connection instance
    $db = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);

    // Set PDO attributes for error handling and fetching results
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Throw exceptions on SQL errors
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Fetch results as associative arrays (column_name => value)

} catch(PDOException $e) {
    // If connection fails, stop the script and show an error.
    // For a live site, you'd log this error and show a more user-friendly message.
    die("Database connection failed: " . $e->getMessage());
}
?>