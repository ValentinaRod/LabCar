unction initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: {lat: -9.1191427, lng: -77.0349046},
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  function buscar(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
  }

  document.getElementById("encuentrame").addEventListener("click", buscar);
  var latitud, longitud;
  var funcionExito = function(posicion) {
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    var miUbicacion = new google.maps.Marker({
      position: {lat:latitud, lng:longitud},
      animation: google.maps.Animation.DROP,
      map: map
    });

    map.setZoom(17);
    map.setCenter({lat:latitud, lng:longitud});
  }



  var funcionError = function (error) {
    alert("Tenemos un problema con encontrar tu ubicación");
  }

  var start = document.getElementById('origen');
  var end = document.getElementById('destino');

  new google.maps.places.Autocomplete(start);
  new google.maps.places.Autocomplete(end);

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var calcularRuta = function(directionsService,directionsDisplay){
    directionsService.route({
    origin: start.value,
    destination: end.value,
    travelMode: 'DRIVING'
    }, function (response,status){
      if (status === 'OK') {
          directionsDisplay.setDirections(response);
        }else{
      window.alert("No encontramos una ruta");
      }
    })
  };

    directionsDisplay.setMap(map);
    var trazarRuta = function(){
      calcularRuta(directionsService,directionsDisplay);
    };

    document.getElementById("ruta").addEventListener('click', trazarRuta);  
};