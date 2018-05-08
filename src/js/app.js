var app = app || {};

function getLatLngFromAdd(add){
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=%data%&key=AIzaSyBWj-fxuvnZLhzSIy2Zov-ztfJjMH9kvV8";
  url = url.replace("%data%",add);
  $.getJSON( url,function(data) {
    console.log(ds);
  } );
}

(function(){
  app.mapDiv = document.getElementById('map');
  app.homeAdd = "1215 Broadway Astoria";
  var position = {lat:40.7668153 ,lng:-73.9341451};
  app.initMap = function(){
    app.map = new google.maps.Map(this.mapDiv, {
      center: position,
      zoom: 14,
    });

    app.houseMarker = new google.maps.Marker({
      position: position,
      title: app.homeAdd,
      map: app.map,
      icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      animation: google.maps.Animation.DROP,
      id: 1
    });
    app.service = new google.maps.places.PlacesService(app.map);
    app.service.nearbySearch({
      location: position,
      radius: '1000',
      type: ['restaurant']
    }, function(results,status){
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        app.restaurantData = results;
        ko.applyBindings(new app.viewModel());

      }


    });



  };

  app.viewModel = function(){
    var self = this;
    self.places = ko.observableArray(app.restaurantData);

  }



})();
