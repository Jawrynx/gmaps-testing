// Initialize and add the maps
let fromMap, toMap;

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
  new AdvancedMarkerElement({
    map: fromMap,
    position: fromPosition,
    title: "Uluru",
  });

  new AdvancedMarkerElement({
    map: toMap,
    position: toPosition,
    title: "London",
  });
}

initMap();