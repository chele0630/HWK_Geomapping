// Earthquake data link
var earthquakeInfo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the Earthquake Link and send data to new function 
d3.json(earthquakeInfo, function(data) {
  console.log(data);
  myFeatures(data.features);
});


function myFeatures(earthquakeMarker) {

  var earthquakes = L.geoJson(earthquakeMarker, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },

    markLayer: function (feature, latlng) {
      return new L.circle(latlng, {
          radius: circleRadius(feature.properties.mag),
          fillColor: circleColor(feature.properties.mag),
          fillOpacity: .6,
          color: "#000",
          stroke: true,
          weight: .7
      })
    }
  });




  // Sending our earthquakes layer to the earthquakeMap function
  earthquakeMap(earthquakes);
}

function earthquakeMap(earthquakes) {

  // Define map layers and Insert own API Key
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10.html?title=true&access_token=pk.eyJ1IjoiY2hlbGUwNjMwIiwiYSI6ImNqd2gxaWY3ZDAycHQ0OHA1cDV0OWdiMGEifQ.LwLYAOAxp6ZseJbd2wBSKg");
    var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11.html?title=true&access_token=pk.eyJ1IjoiY2hlbGUwNjMwIiwiYSI6ImNqd2gxaWY3ZDAycHQ0OHA1cDV0OWdiMGEifQ.LwLYAOAxp6ZseJbd2wBSKg");
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11.html?title=true&access_token=pk.eyJ1IjoiY2hlbGUwNjMwIiwiYSI6ImNqd2gxaWY3ZDAycHQ0OHA1cDV0OWdiMGEifQ.LwLYAOAxp6ZseJbd2wBSKg");
 
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightMap,
    "Outdoor Map": outdoorMap,
    "Satellite Map": satelliteMap
  };

// Create a layer control
var overlayMaps = {
  "Earthquakes": earthquakes
};   

// Create our map, giving it the lightMap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [30, -7],
  zoom: 2.5,
  layers: [lightMap, earthquakes]
});

 
// Add the layer control to the map
 L.control.layers(baseMaps, overlayMaps ,{
  collapsed: false
  }).addTo(myMap);
}

 
  // Create legend
  var legend = L.control({position: "bottomright"});
 

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create("div", "info legend");
              grades = [0, 1, 2, 3, 4, 5];
              labels = [];
        

  // Loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + circleColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
  };



function circleColor(size) {
  return size > 5 ? '#0000FF' :
  size > 4  ? '#FF00FF' :
  size > 3  ? '#00FF00' :
  size > 2  ? '#FFFF00' :
  size > 1   ? '#40E0D0' :
            '#FF0000';
}

function circleRadius(value){
  return value*40000
}



      




  // Add the info legend to the map
  legend.addTo(myMap);