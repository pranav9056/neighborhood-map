var app = app || {};

(function(){
  app.map = document.getElementById('map');

  app.initMap = function(){
    map = new google.maps.Map(this.map, {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13,
    });
  };

})();
