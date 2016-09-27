var markers = require('./markers.json');
var streets = require('./seattle-shoreline-access-points.json');

/** Converts numeric degrees to radians */
var toRad = function(val) {
  return val  * Math.PI / 180;
}

var distMeters = function(lat1, lat2, lon1, lon2) {
    var earthRadius = 6371000.0; //meters
    var dLat = toRad(lat2-lat1);  // Javascript functions in radians
    var dLon = toRad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = earthRadius * c; // Distance in km
    return d;
}

markers.wpt.forEach(function(marker){
    streets.forEach(function(street){
      if (street.AccessCode == "A") {
        var dist = distMeters(marker.lat, street.Position.lat, marker.lng, street.Position.lng);

        if (typeof(marker.access) == 'undefined') {
          marker.access = {};
        }

        if (typeof(marker.access.shore) == 'undefined') {
          marker.access.shore = {};
        }

        if (typeof(marker.access.shore.dist) == 'undefined') {
          marker.access.shore.dist = -1;
        }

        if (marker.access.shore.dist == -1 || marker.access.shore.dist > dist) {
          marker.access.shore.dist = dist;
          marker.access.shore.details = street;
        }
      }
    });
});


console.log(JSON.stringify(markers, null, "  "));
