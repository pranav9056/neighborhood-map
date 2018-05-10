var app = app || {};



//app.homeAdd = "1215 Broadway Astoria";
//var position = {lat:40.7668153 ,lng:-73.9341451};

(function(){

  // Create a new object for each place near the Neighborhood which manages properties of the ,
  var Establishment = function(data){
    this.name = data.name;
    this.address = data.vicinity;
    this.icon = data.icon;
    this.position = data.geometry.location;
  }
  Establishment.prototype.createMarker = function(){
    var options = {
      map: app.map,
      position: this.position,
      icon: this.icon,
      title: this.name,
    };
    this.marker = new google.maps.Marker(options);
    // add event listener to the marker later !
  }
  Establishment.prototype.showMarker(){
    this.marker.setMap(app.map);
  }
  Establishment.prototype.hideMarker(){
    this.marker.setMap(null);
  }
  //
  var CategoryType = function(category,results){
    this.category = category;
    this.establishments = [];
    this.displayEstablishments = ko.observableArray();
  }
  app.viewModel = function(){
    var self = this;
    self.homeAdd = ko.observable("1215 Broadway Astoria");
    self.places = ko.observableArray();
    self.markers = [];
    self.loadPlaces = function(results,status){
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
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
