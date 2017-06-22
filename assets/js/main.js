function initMap(){
  var map = new google.maps.Map(document.getElementById("map"),{
    zoom: 5,
    center: {lat: -33.4724712, lng: -70.9107133},
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false
  });


  function buscar(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
  }

  //document.getElementById("tarifa").addEventListener("load",buscar);
  var latitud, longitud;

  var funcionExito = function(posicion){
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    var miUbicacion = new google.maps.Marker({
      position : {lat: latitud, lng: longitud},
      animation: google.maps.Animation.DROP,
      map: map,
    });

    map.setZoom(17);
    map.setCenter({lat: latitud, lng: longitud});
  }

  var funcionError = function(error){
    alert("Tenemos problemas encontrando tu ubicación");
  }  

  buscar();
   