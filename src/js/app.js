var app = app || {};



//app.homeAdd = "1215 Broadway Astoria";
//var position = {lat:40.7668153 ,lng:-73.9341451};

(function(){
  app.viewModel = function(){
    var self = this;
    self.homeAdd = ko.observable("1215 Broadway Astoria");
    self.places = ko.observableArray();
    self.markers = [];
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
          position: place.geometry.location,
          title: place.name,

        });
        app.bounds.extend(marker.position);
        self.markers.push(marker);

        marker.addListener( 'click', function() {
          //var card =  '<div class="card-body"><h5 class="card-title">%name%</h5><h6 class="card-subtitle mb-2 text-muted">%address%</h6><a href="#" class="card-link">Card link</a><a href="#" class="card-link">Another link</a></div>';
          //card = card.replace("%name%",place.name);
          //card = card.replace("%address%",place.vicinity);
          //console.log(place);
          //app.infowindow.setContent(card);

          app.populateInfoWindow(this);
          //app.infowindow.open(app.map, this);
        });
      })
      app.map.fitBounds(app.bounds);
    }

  }

  app.viewModelObject = new app.viewModel()
  ko.applyBindings(app.viewModelObject);
})();
