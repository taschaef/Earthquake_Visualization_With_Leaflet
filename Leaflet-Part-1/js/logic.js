// make a queryURL to call the USGS earthquake data
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map object
// I googled the geographic center of the United States and used those coordinates to center my map
var myMap = L.map("map", {
    center: [39.8282, -98.5795],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Call the JSON data from the queryURL
d3.json(queryURL).then(function(data){
   
// Determine the colors based on magnitude 
    function getValue(x) {
        return x > 90 ? "#d73027" :
               x > 70 ? "#fc8d59" :
               x > 50 ? "#fee08b" :
               x > 30 ? "#d9ef8b" :
               x > 10 ? "#91cf60" :
                   "#1a9850";
    }
    
// Apply the colors above to circle features on the map
    function style(feature) {
        return {
    
            stroke: true,
            radius: feature.properties.mag * 4,
            fillColor: getValue(feature.geometry.coordinates[2]),
            color: "black",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        };
    }
 // Create layer for circle markers and bind popups   
    var pop = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />magnitude: " +
              feature.properties.mag + "<br /><br />depth:" + feature.geometry.coordinates[2]);
          }
    });
    pop.addTo(myMap);

 // Create and style legend for map   
    var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [-10, 10, 30, 50, 70, 90]
    var colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59','#d73027'];

  
    limits.forEach(function(limit, index) {
        div.innerHTML += "<i style='background: " + colors[index] + "'></i> "
        + limits[index] + (limits[index + 1] ? "&ndash;" + limits[index + 1] + "<br>" : "+");
    });

   return div;
  };

  // Add legend to the map
  legend.addTo(myMap);
  });
    