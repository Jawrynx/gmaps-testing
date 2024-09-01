// Initialize and add the maps
let fromMap, toMap;
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
    if (place.geometry && place.geometry.location) {
      fromMap.setCenter(place.geometry.location);
      fromMap.setZoom(12); // Adjust zoom as needed

      fromMarker.position = place.geometry.location;
    }
  });

  toAutocomplete.addListener("place_changed", () => {
    const place = toAutocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      toMap.setCenter(place.geometry.location);
      toMap.setZoom(12); // Adjust zoom as needed

      toMarker.position = place.geometry.location;
    }
  });

}

initMap();