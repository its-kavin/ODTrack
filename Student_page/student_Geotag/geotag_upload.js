// ODTrack/geotag_upload.js

document.addEventListener('DOMContentLoaded', () => {
    const odDetailsDisplay = document.getElementById('od-details-display');
    const hiddenOdIdInput = document.getElementById('od-id-hidden');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('geotag-file');

    // 1. Get OD ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const odId = urlParams.get('od_id');

    if (odId) {
        hiddenOdIdInput.value = odId; // Set hidden input value for form submission

        // 2. (Optional) Fetch and display OD details
        // This requires a backend API endpoint (e.g., /api/od-details?id=...)
        // Replace the placeholder below with your actual API call if you have one.
        /*
        fetch(`/api/od-details?id=${odId}`)
        .then(response => {
             if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
             return response.json();
        })
        .then(data => {
             // Ensure data has the expected fields
             if(data && data.eventName && data.eventDate && data.status) {
                  odDetailsDisplay.innerHTML = `
                      <p><strong>Event:</strong> ${data.eventName}</p>
                      <p><strong>Date:</strong> ${data.eventDate}</p>
                      <p><strong>Status:</strong> ${data.status}</p>
                      <p>Please select the geo-tagged image file.</p>
                  `;
             } else {
                 throw new Error('Invalid data received for OD details.');
             }
        })
        .catch(error => {
             console.error('Error fetching OD details:', error);
             odDetailsDisplay.innerHTML = `<p>Could not load OD details for ID: <strong>${odId}</strong>. Please proceed with upload.</p>`;
        });
        */

        // **Placeholder if no API exists yet:**
        odDetailsDisplay.innerHTML = `<p>Uploading proof for OD Request ID: <strong>${odId}</strong></p><p>Please select the geo-tagged image file.</p>`;


    } else {
        odDetailsDisplay.textContent = 'Error: OD Request ID not found in URL.';
        if (uploadForm) uploadForm.style.display = 'none'; // Hide form if no ID
    }

    // 3. Basic Form Validation (Client-side check if file is selected)
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Please select a file to upload.');
                e.preventDefault(); // Stop submission
                return;
            }
            // Add any other client-side validation if needed (e.g., basic file type check)
            console.log(`Submitting proof for OD ID: ${odId || 'UNKNOWN'}`);
            // Form will now submit to the 'action' URL ('upload_geotag.php')
            // Consider adding a loading indicator here
        });
    }
});