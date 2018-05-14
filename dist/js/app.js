var app=app||{};!function(){var i=function(e){this.name=e.name,this.address=e.vicinity,this.icon=e.icon,this.position=e.geometry.location,this.ratingGoogle=e.rating};i.prototype.createMarker=function(){var e=this,a={map:app.map,position:this.position,title:this.name};this.marker=new google.maps.Marker(a),this.marker.addListener("click",function(){e.populateInfoWindow()})},i.prototype.showMarker=function(){this.marker.setMap(app.map)},i.prototype.hideMarker=function(){this.marker.setMap(null)},i.prototype.toggleMarker=function(){null==this.marker.getMap()?this.showMarker():this.hideMarker()},i.prototype.useGoogleData=function(){var e=this;null!=e.address&&$("#address").html('<i class="fas fa-location-arrow"></i>  '+e.address),null!=e.ratingGoogle&&$("#rating").html('<i class="far fa-star"></i>  '+e.ratingGoogle+"/5"),$(".gdata").toggleClass("d-none")},i.prototype.populateInfoWindow=function(e,a){var t=this;if(t.marker.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){t.marker.setAnimation(null)},1e3),app.infoWindow.marker!=t.marker){app.infoWindow.setContent(""),app.infoWindow.marker=t.marker,app.infoWindow.addListener("closeclick",function(){app.infoWindow.marker=null});var i="XG52FAWOMRPKNTOYZSQ4QNPVLTKDOGZDJQR0ROEX0LELNDMQ",o="3Z5ZEE44NI5JOPG5A5SPKRBSTTBYRVO4AU4QRY1YYVAFRWY4",r='<div><div id="name">'+t.name+'</div><div id="rating"></div><div id="address"></div><div id="phone"></div><div id="hours"></div><div id="url"></div><div class="d-none gdata text-muted"><br>Unable to load data from Foursquare<div></div>';app.infoWindow.setContent(r);var n="https://api.foursquare.com/v2/venues/search?v=20180512&ll=";n=(n=(n=n+t.position.lat()+","+t.position.lng())+"&intent=match&name="+t.name)+"&client_id="+i+"&client_secret="+o,$.getJSON(n,function(e){if(200==e.meta.code&&0<e.response.venues.length){t.foursquareId=e.response.venues[0].id;var a="https://api.foursquare.com/v2/venues/"+t.foursquareId+"?v=20180512&";a=a+"&client_id="+i+"&client_secret="+o,$.getJSON(a,function(e){var a=e.response.venue;$("#address").html("<i class='fas fa-location-arrow'></i>"+a.location.formattedAddress[0]),null!=a.contact.formattedPhone&&$("#phone").html('<i class="fas fa-phone"></i>  '+a.contact.formattedPhone),null!=a.rating&&$("#rating").html('<i class="far fa-star"></i>  '+a.rating+'/10    <i class="far fa-thumbs-up"></i>  '+a.likes.count),null!=a.hours&&$("#hours").html('<i class="fas fa-clock"></i>  '+a.hours.status),null!=a.url&&$("#url").html('<i class="fas fa-external-link-square-alt"></i> <a target="_new" href="'+a.url+'">'+a.url+"</a>")}).fail(function(){t.useGoogleData()})}else t.useGoogleData()}).fail(function(){t.useGoogleData()}),app.infoWindow.open(app.map,t.marker)}};var o=function(e,a){var t=this;this.category=e,this.establishments=[],this.displayEstablishments=ko.observableArray(),a.forEach(function(e){var a=new i(e);a.createMarker(),t.establishments.push(a),t.displayEstablishments.push(a)})};o.prototype.toggleCategory=function(){this.establishments.forEach(function(e){e.toggleMarker()})},app.viewModel=function(){var t=this;t.homeAdd=ko.observable("1215 Broadway Astoria"),t.categoryObjects=ko.observableArray(),t.displayCategories=ko.observableArray(),t.applyFilter=function(a,e){return 0==t.displayCategories.remove(function(e){return e.category==a.category}).length&&t.displayCategories.push(a),a.toggleCategory(),!0}},app.viewModel.prototype.addNewCategory=function(e,a,t){if(a==google.maps.places.PlacesServiceStatus.OK){var i=new o(t,e);this.categoryObjects.push(i),this.displayCategories.push(i)}else alert("Unable to load data for "+t)},app.viewModelObject=new app.viewModel,ko.applyBindings(app.viewModelObject)}();