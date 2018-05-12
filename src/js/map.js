var app = app || {}
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
      // old way of handling incoming data
    //  app.viewModelObject.loadPlaces(results,status,category[0]);
      // new way of handling incoming data
      app.viewModelObject.addNewCategory(results,status,category[0]);
    });

  }

  app.initMap = function(){

    app.mapDiv = document.getElementById('map');
    app.position = {lat:40.7668153 ,lng:-73.9341451};
    app.homeAdd = "1215 Broadway Astoria";
    app.infoWindow = new google.maps.InfoWindow();
    app.bounds = new google.maps.LatLngBounds();
    app.map = new google.maps.Map(app.mapDiv, {
      center: app.position,
      zoom: 14,
    });

    app.service = new google.maps.places.PlacesService(app.map);

    app.houseMarker = new google.maps.Marker({
      position: app.position,
      title: app.homeAdd,
      map: app.map,
      icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      animation: google.maps.Animation.DROP,
      id: 1
    });

    app.categories = ['restaurant','gas-station','laundry','atm'];
    app.categories.forEach(function(category){
      app.getPlaces([category]);
    });
    //app.getPlaces(['restaurant']);


  };

  // earlier way of loading infoWindow content
  app.populateInfoWindow = function(marker) {
  if (app.infoWindow.marker != marker) {
    app.infoWindow.setContent('');
    app.infoWindow.marker = marker;
    app.infoWindow.addListener('closeclick', function() {
      app.infoWindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);

          var card = '<div id="pano" class="card-img-top" alt="Card image cap"></div><div class="card-body"> <h5 class="card-title">'+ marker.title+'</h5></div>';
          app.infoWindow.setContent(card);
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 0
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        console.log("ddd");
        app.infoWindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    app.infoWindow.open(app.map, marker);
  }
}

})();
