var app = app || {};



//app.homeAdd = "1215 Broadway Astoria";
//var position = {lat:40.7668153 ,lng:-73.9341451};

(function(){
  app.viewModel = function(){
    var self = this;
    self.homeAdd = ko.observable("1215 Broadway Astoria");
    self.places = ko.observableArray();
    self.loadPlaces = function(results,status){
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(function(place){
          self.places.push(place);
        });
        self.createMarkers();
      }
    }
    self.createMarkers = function(){
      self.places().forEach(function(place){
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: app.map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          app.infowindow.setContent(place.name);
          app.infowindow.open(app.map, this);
        });
      })
    }

  }

  app.viewModelObject = new app.viewModel()
  ko.applyBindings(app.viewModelObject);
})();
