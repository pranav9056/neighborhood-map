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
      }
    }
  }

  app.viewModelObject = new app.viewModel()
  ko.applyBindings(app.viewModelObject);
})();
