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
		if (self.address != undefined) {
			$('#address').html('<i class="fas fa-location-arrow"></i>  ' + self.address);
		}
		if (self.ratingGoogle != undefined) {
			$('#rating').html('<i class="far fa-star"></i>  ' + self.ratingGoogle + "/5");
		}
		$('.gdata').toggleClass('d-none');
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
			var content = '<div><div id="name">' + self.name + '</div><div id="rating"></div><div id="address"></div><div id="phone"></div><div id="hours"></div><div id="url"></div><div class="d-none gdata text-muted"><br>Unable to load data from Foursquare<div></div>';
			app.infoWindow.setContent(content);
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
						var venue = data.response.venue;
						$("#address").html("<i class='fas fa-location-arrow'></i>" + venue.location.formattedAddress[0]);
						if (venue.contact.formattedPhone != undefined) {
							$('#phone').html('<i class="fas fa-phone"></i>  ' + venue.contact.formattedPhone);
						}
						if (venue.rating != undefined) {
							$('#rating').html('<i class="far fa-star"></i>  ' + venue.rating + "/10" + "    " + '<i class="far fa-thumbs-up"></i>  ' + venue.likes.count);
						}
						if (venue.hours != undefined) {
							$('#hours').html('<i class="fas fa-clock"></i>  ' + venue.hours.status)
						}
						if (venue.url != undefined) {
							$('#url').html('<i class="fas fa-external-link-square-alt"></i> ' + '<a target="_new" href="' + venue.url + '">' + venue.url + '</a>');
						}
					}).fail(function() {
						self.useGoogleData();
					});
				} else {
					self.useGoogleData();
				}
			}).fail(function() {
				self.useGoogleData()
			});
			app.infoWindow.open(app.map, self.marker);
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
