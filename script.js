document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    const map = L.map('map-container').setView([51.505, -0.09], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Example data for biodiversity hotspots (GeoJSON format)
    const biodiversityHotspots = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [-0.09, 51.505] },
                "properties": { "name": "Hotspot 1", "biodiversity": "High" }
            },
            {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [-0.1, 51.51] },
                "properties": { "name": "Hotspot 2", "biodiversity": "Medium" }
            }
        ]
    };

    // Add GeoJSON data to the map
    L.geoJSON(biodiversityHotspots, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<strong>${feature.properties.name}</strong><br>Biodiversity: ${feature.properties.biodiversity}`);
        }
    }).addTo(map);

    // Handle file upload for GeoJSON data
    const uploadBtn = document.getElementById("upload-btn");
    const gisFileInput = document.getElementById("gis-file");

    uploadBtn.addEventListener("click", function () {
        const file = gisFileInput.files[0];
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const geojsonData = JSON.parse(e.target.result);
                console.log("GeoJSON data loaded:", geojsonData);
                L.geoJSON(geojsonData).addTo(map);
                alert("File uploaded and data added to the map!");
            } catch (error) {
                alert("Invalid file format. Please upload a valid GeoJSON file.");
                console.error("Error loading GeoJSON:", error);
            }
        };
        reader.readAsText(file);
    });

    // Handle the image file upload for the Impact Prediction section
    const uploadBtnForImpact = document.getElementById("upload-btn");
    const imageFileInput = document.getElementById("image-file");
    const imageDisplay = document.getElementById("image-display");
    const originalImage = document.getElementById("original-image");
    const segmentedImage = document.getElementById("segmented-image");

    uploadBtnForImpact.addEventListener("click", function () {
        const file = imageFileInput.files[0];
        if (!file) {
            alert("Please select an image to upload.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            originalImage.src = e.target.result; // Display the uploaded image
            segmentedImage.src = "image.png"; // Display pre-existing segmented image

            // Show the image display section
            imageDisplay.style.display = "block";
        };
        reader.readAsDataURL(file); // Read the file as a Data URL for preview
    });

    // Recommendation Section: Handle image upload and generate random recommendations
    const recommendationBtn = document.getElementById("recommendation-btn");
    const recommendationImageInput = document.getElementById("recommendation-image");

    recommendationBtn.addEventListener("click", function () {
        const file = recommendationImageInput.files[0];
        if (!file) {
            alert("Please select an image to upload.");
            return;
        }

        // For now, we are just logging the uploaded image
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log("Uploaded recommendation image:", e.target.result);

            // Simulate model output with random numbers (between 60 and 90)
            const greenCorridor = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
            const nativeVegetation = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
            const biodiversityInfrastructure = Math.floor(Math.random() * (90 - 60 + 1)) + 60;

            // Update the UI with these values
            document.getElementById("green-corridor").textContent = greenCorridor;
            document.getElementById("native-vegetation").textContent = nativeVegetation;
            document.getElementById("biodiversity-infrastructure").textContent = biodiversityInfrastructure;

            // Show the recommendation results
            document.getElementById("recommendation-results").style.display = "block";
        };
        reader.readAsDataURL(file); // Read the file as a Data URL for preview
    });

    // Search function: Handle location search and zoom in on the result
    function searchLocation() {
        const location = document.getElementById("location-input").value;
        console.log("Searching for location:", location);

        if (location) {
            const geocoder = L.Control.Geocoder.nominatim();
            geocoder.geocode(location, function (results) {
                if (results.length > 0) {
                    const latlng = results[0].center;
                    map.setView(latlng, 13);
                    const marker = L.marker(latlng).addTo(map);
                    marker.bindPopup("Search Result").openPopup();
                    console.log("Location found:", latlng);
                } else {
                    alert("Location not found.");
                    console.log("Location not found.");
                }
            });
        } else {
            alert("Please enter a location.");
        }
    }

    // Event listener for search button
    const searchBtn = document.getElementById("search-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchLocation);
    } else {
        console.log("Search button not found");
    }

    // Optional: Handle pressing "Enter" to search
    const locationInput = document.getElementById("location-input");
    locationInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchLocation();
        }
    });
});
