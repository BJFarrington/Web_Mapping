var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeURL, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    
    pointToLayer: function (feature, lat_lng) {
      return new L.circle(lat_lng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getcolor(feature.properties.mag),
        fillOpacity: .8,
        color: "#000",
        stroke: true,
        weight: .10
    })
  }
  });
  
  createMap(earthquakes);
}

function createMap(earthquakes) {


    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw." +
      "T6YbdDixkOBWH_k9GbS8JQ");
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    
  
    var baseMaps = {
      "Outdoors": outdoors,
      "Satellite": satellite,
      
    };

    

    var overlayMaps = {
      "Earthquakes": earthquakes,
      
    };

    var myMap = L.map("map-id", {
      center: [
        37.09, -95.71],
      zoom: 3.0,
      layers: [outdoors, earthquakes ]
    }); 


    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
        mag_typ = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getcolor(mag_typ[i] + 1) + '"></i> ' +
            mag_typ[i] + (mag_typ[i + 1] ? '&ndash;' + mag_typ[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}
  function getcolor(d){
    return d > 5 ? "#ff0000":
    d  > 4 ? "#ff4000":
    d > 3 ? "#ff8000":
    d > 2 ? "#ffbf00":
    d > 1 ? "#bfff00":
             "#0080ff";
  }
  function getRadius(value){
    return value*40000
  }