var app = app || {}

// Unused function that uses get latlnf from an address
function getLatLngFromAdd(add){
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=%data%&key=AIzaSyBWj-fxuvnZLhzSIy2Zov-ztfJjMH9kvV8";
  url = url.replace("%data%",add);
  $.getJSON( url,function(data) {
    console.log(ds);
  } );
}
(function(){
  app.getPlaces = function(category){
    var options = {
      location: app.position,
      radius: '1000',
      type: category
    }
    app.service.nearbySearch(options,function(results,status){
      // new way of handling incoming data
      app.viewModelObject.addNewCategory(results,status,category[0]);
    });

  }

  // callback when Google Maps API is loaded
  app.initMap = function(){
    // initialization of variables required to load the map
    app.mapDiv = document.getElementById('map');
    app.position = {lat:40.7668153 ,lng:-73.9341451};
    app.homeAdd = "1215 Broadway Astoria";
    app.infoWindow = new google.maps.InfoWindow();
    app.bounds = new google.maps.LatLngBounds();
    app.map = new google.maps.Map(app.mapDiv, {
      center: app.position,
      zoom: 14,
    });
    // Used to find nearby places
    app.service = new google.maps.places.PlacesService(app.map);
    // Adds a Home Marker
    app.houseMarker = new google.maps.Marker({
      position: app.position,
      title: app.homeAdd,
      map: app.map,
      icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      animation: google.maps.Animation.DROP,
      id: 1
    });
    app.houseMarker.addListener('click', function() {
      app.infoWindow.setContent('Home:'+app.homeAdd);
      app.infoWindow.open(app.map, app.houseMarker);

    });

    app.categories = ['restaurant','gas-station','laundry','atm'];
    app.categories.forEach(function(category){
      app.getPlaces([category]);
    });


  };
})();
