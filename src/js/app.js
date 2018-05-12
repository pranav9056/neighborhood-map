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
    this.ratingGoogle = data.rating;
  }
  Establishment.prototype.createMarker = function(){
    var self = this;
    var options = {
      map: app.map,
      position: this.position,
      title: this.name,
    };
    this.marker = new google.maps.Marker(options);
    // add event listener to the marker later !
    this.marker.addListener('click', function() {
      self.populateInfoWindow();
    });
  }
  Establishment.prototype.showMarker = function(){
    this.marker.setMap(app.map);
  }
  Establishment.prototype.hideMarker = function(){
    this.marker.setMap(null);
  }
  Establishment.prototype.toggleMarker = function(){
    if (this.marker.getMap()==null){
      this.showMarker();
    }
    else {
      this.hideMarker();
    }
  }
  Establishment.prototype.populateInfoWindow = function(data,clickEvent){
    var self = this;
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      self.marker.setAnimation(null);
    },1000);
    if (app.infoWindow.marker != self.marker){
      //
      app.infoWindow.setContent('');
      app.infoWindow.marker = self.marker;
      app.infoWindow.addListener('closeclick', function() {
        app.infoWindow.marker = null;
      });
      // setting content
      // ajax requests
      var clientID = "XG52FAWOMRPKNTOYZSQ4QNPVLTKDOGZDJQR0ROEX0LELNDMQ";
      var clientSecret = "3Z5ZEE44NI5JOPG5A5SPKRBSTTBYRVO4AU4QRY1YYVAFRWY4";
      var content = '<div><div id="name">'+self.name+'</div><div id="rating"></div><div id="address"></div><div id="phone"></div><div id="hours"></div><div id="url"></div></div>';
      app.infoWindow.setContent(content);
      var url = "https://api.foursquare.com/v2/venues/search?v=20180512&ll=";
      url = url + self.position.lat() + "," + self.position.lng();
      url = url +"&intent=match&name=" + self.name;
      url = url +"&client_id=" + clientID + "&client_secret=" + clientSecret;
      $.getJSON(url,function(data){
        console.log(data);
        if(data.meta.code == 200 && data.response.venues.length >0){
          self.foursquareId = data.response.venues[0].id;
          var url = "https://api.foursquare.com/v2/venues/"+self.foursquareId+"?v=20180512&";
          url = url +"&client_id=" + clientID + "&client_secret=" + clientSecret;
          $.getJSON(url,function(data){
            console.log(data);
            var venue = data.response.venue;
            $('#address').html('<i class="fas fa-location-arrow"></i>  '+venue.location.formattedAddress[0]);
            if(venue.contact.formattedPhone != undefined){
              $('#phone').html('<i class="fas fa-phone"></i>  '+venue.contact.formattedPhone);
            }
            if(venue.rating != undefined){
              $('#rating').html('<i class="far fa-star"></i>  ' +venue.rating+"/10" +"    " +'<i class="far fa-thumbs-up"></i>  '+venue.likes.count);
            }
            if(venue.hours != undefined){
              $('#hours').html('<i class="fas fa-clock"></i>  '+ venue.hours.status)
            }
            if(venue.url != undefined){
              $('#url').html('<i class="fas fa-external-link-square-alt"></i> '+ '<a target="_new" href="'+venue.url+'">'+venue.url+'</a>');
            }
          });
        }
        else{
          $('#address').html('<i class="fas fa-location-arrow"></i>  '+self.vicinity);
          if(self.rating != undefined){
            $('#rating').html('<i class="far fa-star"></i>  ' +self.rating+"/5" ;
          }
        }
      });

      app.infoWindow.open(app.map, self.marker);

    }
  }
  //
  var CategoryType = function(category,results){
    var self = this;
    this.category = category;
    this.establishments = [];
    this.displayEstablishments = ko.observableArray();
    results.forEach(function(place){
      var establishment = new Establishment(place);
      establishment.createMarker();
      self.establishments.push(establishment);
      self.displayEstablishments.push(establishment);
    });
  }
  CategoryType.prototype.toggleCategory = function(){
    this.establishments.forEach(function(establishment){
      establishment.toggleMarker();
    });
  }

  // View Model
  app.viewModel = function(){
    var self = this;
    self.homeAdd = ko.observable("1215 Broadway Astoria");
    self.places = ko.observableArray();
    self.markers = [];

    // old view model functions called when new data arrives
    self.loadPlaces = function(results,status,category){
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


    // modified view model starts from here
    // figure out how to store categries
    // may want to remove categories
    self.categories = ko.observableArray();
    self.categoryObjects = ko.observableArray();
    self.displayCategories = ko.observableArray();

    self.applyFilter = function(data,clickEvent){
      var removeCategory = self.displayCategories.remove(function(item){
        return item.category == data.category;
      });
      if(removeCategory.length == 0){
        self.displayCategories.push(data);
      }
      data.toggleCategory();
      return true;
    }

  }
  app.viewModel.prototype.addNewCategory = function(results,status,category){
    var self = this;
    // Check If Information is recieved properly
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var newCategory = new CategoryType(category,results);
      self.categories.push(category);
      self.categoryObjects.push(newCategory);
      self.displayCategories.push(newCategory);
    }
    // handle case of failure later
    else{

    }
  }


  app.viewModelObject = new app.viewModel()
  ko.applyBindings(app.viewModelObject);


})();
