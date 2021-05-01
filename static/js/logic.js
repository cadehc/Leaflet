//Map background
var worldmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v8",
      accessToken: API_KEY
    }
  );

  let earthquakemap = L.map("mapid", {
    center: [
      36.8, -95.5
    ],
    zoom: 3
  });

worldmap.addTo(earthquakemap);

//request JSON url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) {


  //marker style, pulling color and radius from JSON
  function styleInfo(feature) {
    return {
      opacity: 1.5,
      fillOpacity: .75,
      fillColor: eqcolor(feature.geometry.coordinates[2]),
      radius: eqradius(feature.properties.mag),
      stroke: true,
      weight: 1
    };
  }

  //earthquake marker colors
  function eqcolor(mag) {
    switch (true) {
      case mag > 5:
          return "#98ee00";
      case mag > 4:
          return "#ea2c2c";
      case mag > 3:
          return "#8ce61e";
      case mag > 2:
          return "#d6ed1f";
      case mag > 1:
          return "#1ee8ba";
      default:
          return "#2c90ea";
    }
  }

  //legend colors
  function colorlegend(mag) {
    switch (true) {
      case mag > 90:
          return "#98ee00";
      case mag > 70:
          return "#ea2c2c";
      case mag > 50:
          return "#8ce61e";
      case mag > 30:
          return "#d6ed1f";
      case mag > 10:
          return "#1ee8ba";
      default:
          return "#2c90ea";
    }
  }
  //gets radius of the earthquake according to magnitude
  function eqradius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 5;
  }
  //fetch data
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
  }).addTo(earthquakemap)

  //make legend
  var legend = L.control({
    position: "topright"
  });
  //legend details
  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [-10, 10, 30, 50, 70, 90];
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<div style="background: ' + colorlegend(grades[i] + 20) + ";" + "width: 25px; height: 25px; display: inline-block;"  +' " ></div> '  +
          grades[i] + (grades[i + 1] ? " " + '&ndash;' +" " + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(earthquakemap)
});