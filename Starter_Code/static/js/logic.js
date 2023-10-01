// Create new map
var myMap = L.map('map').setView([38, -97], 4);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(myMap);

// Get all info
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onload = function() {
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    for (var i = 0; i < data.features.length; i++) {
      var feature = data.features[i];
      var magnitude = feature.properties.mag;
      var place = feature.properties.place;
      console.log('Magnitude: ' + magnitude + ', Place: ' + place);
    }
  }
};
xhr.send();
// Get earthquake data again 
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onload = function() {
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    for (var i = 0; i < data.features.length; i++) {
      var feature = data.features[i];
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var color;
      if (depth < 10) {
        color = 'green';
      } else if (depth < 50) {
        color = 'yellow';
      } else if (depth < 100) {
        color = 'orange';
      } else if (depth < 200) {
        color = 'red';
      } else {
        color = 'purple';
      }
      var circleMarker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: magnitude * 5,
        fillColor: color,
        fillOpacity: 0.7,
        stroke: true,
        color: 'black',
        weight: 1
      });
      circleMarker.bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth + ' km');
      circleMarker.addTo(myMap);
    }
  }
};
xhr.send();

// Creating the legend
var legendControl = L.control({ position: 'bottomright' });
legendControl.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<h4>Earthquake Depth</h4>';
  div.innerHTML += '<i style="background: green"></i><span>(Green)Less than 10 km</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>(Yellow)10-50 km</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>(Orange)50-100 km</span><br>';
  div.innerHTML += '<i style="background: red"></i><span>(Red)100-200 km</span><br>';
  div.innerHTML += '<i style="background: purple"></i><span>(Purple)Greater than 200 km</span><br>';
  return div;
};
legendControl.addTo(myMap);
