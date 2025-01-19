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
                "geometry": {
                    "type": "Point",
                    "coordinates": [-0.09, 51.505]
                },
                "properties": {
                    "name": "Hotspot 1",
                    "biodiversity": "High"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-0.1, 51.51]
                },
                "properties": {
                    "name": "Hotspot 2",
                    "biodiversity": "Medium"
                }
            }
        ]
    };

    // Add GeoJSON data to the map
    L.geoJSON(biodiversityHotspots, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<strong>${feature.properties.name}</strong><br>Biodiversity: ${feature.properties.biodiversity}`);
        }
    }).addTo(map);

    // Handle file upload
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

    // Search function: Handle location search and zoom in on the result
    function searchLocation() {
        const location = document.getElementById("location-input").value; // Get input value from search field
        console.log("Searching for location:", location);

        if (location) {
            const geocoder = L.Control.Geocoder.nominatim(); // Use the Nominatim geocoder
            geocoder.geocode(location, function(results) {
                if (results.length > 0) {
                    const latlng = results[0].center; // Get the coordinates of the first result
                    map.setView(latlng, 13); // Zoom to the result location
                    const marker = L.marker(latlng).addTo(map); // Add marker to the location
                    marker.bindPopup("Search Result").openPopup(); // Bind a popup
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
        searchBtn.addEventListener("click", searchLocation); // Trigger search on button click
    } else {
        console.log("Search button not found");
    }

    // Optional: Handle pressing "Enter" to search
    const locationInput = document.getElementById("location-input");
    locationInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            searchLocation();
        }
    });
});
