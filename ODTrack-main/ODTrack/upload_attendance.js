document.addEventListener('DOMContentLoaded', () => {
    const odDetailsContainer = document.getElementById('od-details-container');
    const attendanceForm = document.getElementById('attendance-form');
    const photoInput = document.getElementById('geotag-photo');
    const imagePreviewContainer = document.getElementById('image-preview');
    const getLocationBtn = document.getElementById('get-location-btn');
    const locationStatus = document.getElementById('location-status');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const submitBtn = document.getElementById('submit-attendance-btn');

    let odId = null;

    // Simulated OD data. In a real application, you would fetch this from the backend.
    const allOds = [
        { id: 1, eventName: 'Tech Symposium 2025', eventDate: '2025-05-15', status: 'Approved' },
        { id: 2, eventName: 'Annual Cultural Fest', eventDate: '2025-06-10', status: 'Pending' },
        { id: 4, eventName: 'Workshop on AI', eventDate: '2025-03-10', status: 'Approved' },
    ];

    const getOdIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const loadOdDetails = () => {
        odId = getOdIdFromUrl();
        if (!odId) {
            odDetailsContainer.innerHTML = '<p style="color: red;">Error: No OD Request ID found.</p>';
            attendanceForm.style.display = 'none';
            return;
        }

        const odData = allOds.find(od => od.id == odId);

        if (odData) {
            odDetailsContainer.innerHTML = `
                <p><strong>Event:</strong> ${odData.eventName}</p>
                <p><strong>Date:</strong> ${odData.eventDate}</p>
            `;
        } else {
            odDetailsContainer.innerHTML = `<p style="color: red;">Error: Could not find details for OD Request ID #${odId}.</p>`;
            attendanceForm.style.display = 'none';
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Geolocation is not supported by your browser.';
            locationStatus.className = 'error';
            return;
        }

        locationStatus.textContent = 'Getting location...';
        locationStatus.className = '';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                latitudeInput.value = lat;
                longitudeInput.value = lon;
                locationStatus.textContent = `Location captured: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
                locationStatus.className = 'success';
            },
            () => {
                locationStatus.textContent = 'Unable to retrieve your location. Please enable location services.';
                locationStatus.className = 'error';
            }
        );
    };

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Image preview"/>`;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
            getLocation();
        } else {
            imagePreviewContainer.style.display = 'none';
            imagePreviewContainer.innerHTML = '';
        }
    });

    getLocationBtn.addEventListener('click', getLocation);

    attendanceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const photo = photoInput.files[0];
        const latitude = latitudeInput.value;
        const longitude = longitudeInput.value;

        if (!photo || !latitude || !longitude) {
            alert('Please upload a photo and ensure location is captured.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        console.log(`Simulating submission for OD ID: ${odId}`);
        console.log('Photo:', photo.name);
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        
        // In a real application, this would send data to your backend.
        setTimeout(() => {
            alert('Attendance submitted successfully! Redirecting back to status page.');
            window.location.href = 'odpending.html';
        }, 1000);
    });

    loadOdDetails();
});