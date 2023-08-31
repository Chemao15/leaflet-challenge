let mymap = L.map("map", {
  center: [39, -98.5795],
  zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(mymap);

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(function(data){
  console.log(data)
});

function markersize(magnitude) {
  return Math.max(5, (magnitude) * 2.5);
};

function markercolor(depth) {
  return depth > 90 ? '#FF0000' :
         depth > 70 ? '#BA4A00' :
         depth > 50 ? '#FF9800' :
         depth > 30 ? '#CCFF33' :
         depth > 10 ? '#CCFF00' : '#66CC00';
};

fetch(url)
  .then(response => response.json())
  .then(data => {
    data.features.forEach(function (feature) {
      let coordinates = feature.geometry.coordinates;
      let lat = coordinates[1];
      let lng = coordinates[0];
      let magnitude = feature.properties.mag;
      let depth = coordinates[2];

      let marker = L.circleMarker([lat, lng], {
        radius: markersize(magnitude),
        fillColor: markercolor(depth),
        weight: 1,
        fillOpacity: 0.5
      }).addTo(mymap);

      marker.bindPopup('<strong>' + feature.properties.title + '</strong><br>Magnitude: ' + magnitude + '<br>Depth: ' + depth + ' km');
    });
  })
  .catch(error => {
    console.log('Error fetching earthquake data:', error);
  });

let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (mymap) {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4 style='text-align: center'>Legend by Depth (km)</h4>";
  div.innerHTML += '<i style="background: #66CC00"></i><span></span><10<br>';
  div.innerHTML += '<i style="background: #CCFF00"></i><span></span>10-30<br>';
  div.innerHTML += '<i style="background: #CCFF33"></i><span></span>30-50<br>';
  div.innerHTML += '<i style="background: #FF9800"></i><span></span>50-70<br>';
  div.innerHTML += '<i style="background: #BA4A00"></i><span></span>70-90<br>';
  div.innerHTML += '<i style="background: #FF0000"></i><span></span>90+<br>';
      return div;
};

legend.addTo(mymap);