// Initialize and add the maps
let fromMap, toMap;
let fromAddress, toAddress;
var map;
var service;
var infowindow;

async function initMap() {
  // Locations
  const fromPosition = { lat: -25.344, lng: 131.031 }; // Uluru
  const toPosition = { lat: 51.5074, lng: 0.1278 }; // London (example)

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The fromMap, centered at fromPosition
  fromMap = new Map(document.getElementById("fromMap"), {
    zoom: 4,
    center: fromPosition,
    mapId: "DEMO_MAP_ID",
  });

  // The toMap, centered at toPosition
  toMap = new Map(document.getElementById("toMap"), {
    zoom: 4,
    center: toPosition,
    mapId: "DEMO_MAP_ID",
  });

  // Markers
  let fromMarker = new AdvancedMarkerElement({
    map: fromMap,
    position: fromPosition,
    title: "Uluru",
  });

  let toMarker = new AdvancedMarkerElement({
    map: toMap,
    position: toPosition,
    title: "London",
  });

  //Request AutoComplete
  const { Autocomplete } = await google.maps.importLibrary("places");

  //retrieve inputs
  const fromSearchField = document.getElementById("fromSearchField");
  const toSearchField = document.getElementById("toSearchField");

  const fromAutocomplete = new Autocomplete(fromSearchField);
  const toAutocomplete = new Autocomplete(toSearchField);

  fromAutocomplete.addListener("place_changed", () => {
    const place = fromAutocomplete.getPlace();
    //Checks if place exists
    if (place.geometry && place.geometry.location) {
      //centers the map on the inputted place and zooms
      fromMap.setCenter(place.geometry.location);
      fromMap.setZoom(12); // Adjust zoom as needed

      //Updates the marker position
      fromMarker.position = place.geometry.location;

      fromAddress = fromSearchField.value;
      console.log("From Address:", fromAddress);
    }

  });

  toAutocomplete.addListener("place_changed", () => {
    const place = toAutocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      toMap.setCenter(place.geometry.location);
      toMap.setZoom(12); // Adjust zoom as needed

      toMarker.position = place.geometry.location;

      toAddress = toSearchField.value;
      console.log("To Address:", toAddress);
    }
  });

  //Calculate button reference and event listener for click
  const calculateDistanceButton = document.getElementById('calculateDistanceButton');
  calculateDistanceButton.addEventListener('click', calculateDistance);
}

initMap();

// Calculate Distance Funciton using the Google Maps Geocoding API
async function calculateDistance() {
  if (!fromAddress || !toAddress) {
    alert("Please enter both 'From' and 'To' addresses.");
    return;
  }
  const fromGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fromAddress)}&key=AIzaSyA8E7zGJjH1l_l95SNHh14d9shdWxzuYxg`;
  const toGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(toAddress)}&key=AIzaSyA8E7zGJjH1l_l95SNHh14d9shdWxzuYxg`;

  try {
    const [fromResponse, toResponse] = await Promise.all([
      fetch(fromGeocodeUrl),
      fetch(toGeocodeUrl)
    ]);

    const fromData = await fromResponse.json();
    const toData = await toResponse.json();

    if (fromData.status !== "OK" || toData.status !== "OK") {
      alert("Geocoding failed. Check addresses!");
      return;
    }

    const fromLocation = fromData.results[0].geometry.location;
    const toLocation = toData.results[0].geometry.location;

    const distance = calculateHaversineDistance(fromLocation, toLocation);


    const distanceResults = document.getElementById("distanceResults");  
    distanceResults.innerText = `The distance between ${fromAddress} and ${toAddress} is approximetely ${distance.toFixed(2)} kilometers.`;

  } catch (error) {
    console.error("Error calculating distance:", error);
    alert("An error occurred while calculating the distance.");
  }
}

function calculateHaversineDistance(location1, location2) {
  const R = 6371;
  const dLat = toRadians(location2.lat - location1.lat);
  const dLon = toRadians(location2.lng - location1.lng);
  const lat1 = toRadians(location1.lat);
  const lat2 = toRadians(location2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 100);
}