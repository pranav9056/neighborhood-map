var app = app || {};
(function() {
	// Create a new object for each place near the Neighborhood
	var Establishment = function(data) {
		this.name = data.name;
		this.address = data.vicinity;
		this.icon = data.icon;
		this.position = data.geometry.location;
		this.ratingGoogle = data.rating;
	}
	// function to create marker for a location and add on click listeners
	Establishment.prototype.createMarker = function() {
		var self = this;
		var options = {
			map: app.map,
			position: this.position,
			title: this.name,
		};
		this.marker = new google.maps.Marker(options);
		// add event listener to the marker for populating info window
		this.marker.addListener('click', function() {
			self.populateInfoWindow();
		});
	}
	// to make marker visible on map
	Establishment.prototype.showMarker = function() {
		this.marker.setMap(app.map);
	}
	// to hide marker from map
	Establishment.prototype.hideMarker = function() {
		this.marker.setMap(null);
	}
	// to toggle marker visibility
	Establishment.prototype.toggleMarker = function() {
		if (this.marker.getMap() == null) {
			this.showMarker();
		} else {
			this.hideMarker();
		}
	}
	// Fallback Method that populates infoWindow in case of error from foursquare api
	Establishment.prototype.useGoogleData = function() {
		var self = this;
    var content = '<div><div id="name">' + self.name + '</div>';
    var rating = '<div id="rating">%rating%</div>';
    var address = '<div id="address">%address%</div>';
    var end = '<div class="text-muted"><br>Unable to load data from Foursquare<div></div>';
    if (self.ratingGoogle != undefined) {
      content = content + rating.replace("%rating%",'<i class="far fa-star"></i>  ' + self.ratingGoogle + "/5");
    }
		if (self.address != undefined) {
			content = content + address.replace("%address%",'<i class="fas fa-location-arrow"></i>  ' + self.address);
		}
    app.infoWindow.setContent(content+end);
    app.infoWindow.open(app.map, self.marker);

	}
	// fetches content from foursquare and populates infoWindow
	Establishment.prototype.populateInfoWindow = function(data, clickEvent) {
		var self = this;
		// animation on selecting a marker
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			self.marker.setAnimation(null);
		}, 1000);
		if (app.infoWindow.marker != self.marker) {
			app.infoWindow.setContent('');
			app.infoWindow.marker = self.marker;
			app.infoWindow.addListener('closeclick', function() {
				app.infoWindow.marker = null;
			});
			// setting content
			// ajax requests
			var clientID = "XG52FAWOMRPKNTOYZSQ4QNPVLTKDOGZDJQR0ROEX0LELNDMQ";
			var clientSecret = "3Z5ZEE44NI5JOPG5A5SPKRBSTTBYRVO4AU4QRY1YYVAFRWY4";
			var url = "https://api.foursquare.com/v2/venues/search?v=20180512&ll=";
			url = url + self.position.lat() + "," + self.position.lng();
			url = url + "&intent=match&name=" + self.name;
			url = url + "&client_id=" + clientID + "&client_secret=" + clientSecret;
			$.getJSON(url, function(data) {
				if (data.meta.code == 200 && data.response.venues.length > 0) {
					self.foursquareId = data.response.venues[0].id;
					var url = "https://api.foursquare.com/v2/venues/" + self.foursquareId + "?v=20180512&";
					url = url + "&client_id=" + clientID + "&client_secret=" + clientSecret;
					$.getJSON(url, function(data) {
            var content = '<div><div id="name">' + self.name + '</div>';
            var rating = '<div id="rating">%rating%</div>';
            var address = '<div id="address">%address%</div>';
            var phone = '<div id="phone">%phone%</div>';
            var hours = '<div id="hours">%hours%</div>';
            var url = '<div id="url">%url%</div>'
            var end = '</div>';
						var venue = data.response.venue;
            if (venue.rating != undefined) {
              content = content + rating.replace("%rating%",'<i class="far fa-star"></i>  ' + venue.rating + "/10" + "    " + '<i class="far fa-thumbs-up"></i>  ' + venue.likes.count);
            }
						content = content + address.replace("%address%","<i class='fas fa-location-arrow'></i>  " + venue.location.formattedAddress[0]);
						if (venue.contact.formattedPhone != undefined) {
							content = content + phone.replace("%phone%",'<i class="fas fa-phone"></i>  ' + venue.contact.formattedPhone);
						}
						if (venue.hours != undefined) {
							content = content + hours.replace("%hours%",'<i class="fas fa-clock"></i>  ' + venue.hours.status)
						}
						if (venue.url != undefined) {
							content = content + url.replace("%url%",'<i class="fas fa-external-link-square-alt"></i> ' + '<a target="_new" href="' + venue.url + '">' + venue.url + '</a>');
						}
            app.infoWindow.setContent(content+end);
            app.infoWindow.open(app.map, self.marker);
					}).fail(function() {
						self.useGoogleData();
					});
				} else {
					self.useGoogleData();
				}
			}).fail(function() {
				self.useGoogleData()
			});
		}
	}
	// CategoryType object - to store establishments belonging to a particular category
	var CategoryType = function(category, results) {
		var self = this;
		this.category = category;
		this.establishments = [];
		this.displayEstablishments = ko.observableArray();
		results.forEach(function(place) {
			var establishment = new Establishment(place);
			establishment.createMarker();
			self.establishments.push(establishment);
			self.displayEstablishments.push(establishment);
		});
	}
	CategoryType.prototype.toggleCategory = function() {
		this.establishments.forEach(function(establishment) {
			establishment.toggleMarker();
		});
	}
	// View Model
	app.viewModel = function() {
		var self = this;
		self.homeAdd = ko.observable("1215 Broadway Astoria");
		self.categoryObjects = ko.observableArray();
		self.displayCategories = ko.observableArray();
		self.applyFilter = function(data, clickEvent) {
			var removeCategory = self.displayCategories.remove(function(item) {
				return item.category == data.category;
			});
			if (removeCategory.length == 0) {
				self.displayCategories.push(data);
			}
			data.toggleCategory();
			return true;
		}
	}
	app.viewModel.prototype.addNewCategory = function(results, status, category) {
		var self = this;
		// Check If Information is recieved properly
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var newCategory = new CategoryType(category, results);
			self.categoryObjects.push(newCategory);
			self.displayCategories.push(newCategory);
		}
		// send out an alert in case of failure to obtain places
		else {
			alert("Unable to load data for " + category);
		}
	}
	// creat a viewModel object and apply knockout bindings
	app.viewModelObject = new app.viewModel()
	ko.applyBindings(app.viewModelObject);
})();
