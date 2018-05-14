var app=app||{};!function(){var t=function(e){this.name=e.name,this.address=e.vicinity,this.icon=e.icon,this.position=e.geometry.location,this.ratingGoogle=e.rating};t.prototype.createMarker=function(){var e=this,a={map:app.map,position:this.position,title:this.name};this.marker=new google.maps.Marker(a),this.marker.addListener("click",function(){e.populateInfoWindow()})},t.prototype.showMarker=function(){this.marker.setMap(app.map)},t.prototype.hideMarker=function(){this.marker.setMap(null)},t.prototype.toggleMarker=function(){null===this.marker.getMap()?this.showMarker():this.hideMarker()},t.prototype.useGoogleData=function(){var e=this,a='<div><div id="name">'+e.name+"</div>";void 0!==e.ratingGoogle&&(a+='<div id="rating">%rating%</div>'.replace("%rating%",'<i class="far fa-star"></i>  '+e.ratingGoogle+"/5")),void 0!==e.address&&(a+='<div id="address">%address%</div>'.replace("%address%",'<i class="fas fa-location-arrow"></i>  '+e.address)),app.infoWindow.setContent(a+'<div class="text-muted"><br>Unable to load data from Foursquare<div></div>'),app.infoWindow.open(app.map,e.marker)},t.prototype.populateInfoWindow=function(e,a){var t=this;if(t.marker.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){t.marker.setAnimation(null)},1e3),app.infoWindow.marker!=t.marker){app.infoWindow.setContent(""),app.infoWindow.marker=t.marker,app.infoWindow.addListener("closeclick",function(){app.infoWindow.marker=null});var i="XG52FAWOMRPKNTOYZSQ4QNPVLTKDOGZDJQR0ROEX0LELNDMQ",o="3Z5ZEE44NI5JOPG5A5SPKRBSTTBYRVO4AU4QRY1YYVAFRWY4",r="https://api.foursquare.com/v2/venues/search?v=20180512&ll=";r=(r=(r=r+t.position.lat()+","+t.position.lng())+"&intent=match&name="+t.name)+"&client_id="+i+"&client_secret="+o,$.getJSON(r,function(e){if(200==e.meta.code&&0<e.response.venues.length){t.foursquareId=e.response.venues[0].id;var a="https://api.foursquare.com/v2/venues/"+t.foursquareId+"?v=20180512&";a=a+"&client_id="+i+"&client_secret="+o,$.getJSON(a,function(e){var a='<div><div id="name">'+t.name+"</div>",i=e.response.venue;void 0!==i.rating&&(a+='<div id="rating">%rating%</div>'.replace("%rating%",'<i class="far fa-star"></i>  '+i.rating+'/10    <i class="far fa-thumbs-up"></i>  '+i.likes.count)),a+='<div id="address">%address%</div>'.replace("%address%","<i class='fas fa-location-arrow'></i>  "+i.location.formattedAddress[0]),void 0!==i.contact.formattedPhone&&(a+='<div id="phone">%phone%</div>'.replace("%phone%",'<i class="fas fa-phone"></i>  '+i.contact.formattedPhone)),void 0!==i.hours&&(a+='<div id="hours">%hours%</div>'.replace("%hours%",'<i class="fas fa-clock"></i>  '+i.hours.status)),void 0!==i.url&&(a+='<div id="url">%url%</div>'.replace("%url%",'<i class="fas fa-external-link-square-alt"></i> <a target="_new" href="'+i.url+'">'+i.url+"</a>")),app.infoWindow.setContent(a+"</div>"),app.infoWindow.open(app.map,t.marker)}).fail(function(){t.useGoogleData()})}else t.useGoogleData()}).fail(function(){t.useGoogleData()})}};var o=function(e,a){var i=this;this.category=e,this.establishments=[],this.displayEstablishments=ko.observableArray(),a.forEach(function(e){var a=new t(e);a.createMarker(),i.establishments.push(a),i.displayEstablishments.push(a)})};o.prototype.toggleCategory=function(){this.establishments.forEach(function(e){e.toggleMarker()})},app.viewModel=function(){var i=this;i.homeAdd=ko.observable("1215 Broadway Astoria"),i.categoryObjects=ko.observableArray(),i.displayCategories=ko.observableArray(),i.applyFilter=function(a,e){return 0===i.displayCategories.remove(function(e){return e.category==a.category}).length&&i.displayCategories.push(a),a.toggleCategory(),!0}},app.viewModel.prototype.addNewCategory=function(e,a,i){if(a==google.maps.places.PlacesServiceStatus.OK){var t=new o(i,e);this.categoryObjects.push(t),this.displayCategories.push(t)}else alert("Unable to load data for "+i)},app.viewModelObject=new app.viewModel,ko.applyBindings(app.viewModelObject)}();