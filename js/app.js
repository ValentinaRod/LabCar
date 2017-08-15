
function initMap(){
	var map = new google.maps.Map(document.getElementById("map"),{
		zoom: 5,
		center: {lat: -9.1191427, lng: -77.0349046},
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false
	});

	//llamamos a las ids del origen y fin del recorrido
	var inicio = document.getElementById("origen");
	var fin = document.getElementById("destino");

	//para completar el llenado de los inputs
	var autocompleteInit = new google.maps.places.Autocomplete(inicio);
	autocompleteInit.bindTo("bounds",map)

	var autocompleteFin = new google.maps.places.Autocomplete(fin);
	autocompleteFin.bindTo("bounds",map)

	//para encontrarme
	window.onload = function(){

		var latitud, longitud;
		var funcionExito = function(posicion){
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

		var funcionError = function (error){
			alert("Tenemos un problema con encontrar tu ubicación");
		}

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(funcionExito,funcionError);
		}
	}

	//para trazar la ruta, obtener kilometraje y el tiempo de viaje
	document.getElementById("route").addEventListener("click",marcar);

	var geocoder = new google.maps.Geocoder();
	function marcar(){
		if(geocoder){
			geocoder.geocode({'address':inicio.value},geocodeResult);
			geocoder.geocode({'address':fin.value},geocodeResult);
			route();

			var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
          origins: [inicio.value],
          destinations: [fin.value],
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            var outputDiv = document.getElementById('kilometrajes');
            outputDiv.innerHTML = '';
            //deleteMarkers(markersArray);

            var showGeocodedAddressOnMap = function(asDestination) {
              //var icon = asDestination ? destinationIcon : originIcon;
              return function(results, status) {
                if (status === 'OK') {
                  //map.fitBounds(bounds.extend(results[0].geometry.location));
                  markersArray.push(new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: icon
                  }));
                } else {
                  alert('Geocode was not successful due to: ' + status);
                }
              };
            };

            //llamado de la id para poner la tarifa
            var precio = document.getElementById("mi-tarifa");

            //esto muestra los resultados
            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
              geocoder.geocode({'address': originList[i]},
                  showGeocodedAddressOnMap(false));
              for (var j = 0; j < results.length; j++) {
                geocoder.geocode({'address': destinationList[j]},
                    showGeocodedAddressOnMap(true));
                outputDiv.innerHTML += results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br>';
                precio.innerHTML = 400*parseInt(results[j].distance.text) + 350 + "$"
              }
            } 
          }
        });


		}
	}

	function geocodeResult(results, status) {
		// Verificamos el estatus
		if (status == 'OK') {
			// fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
			map.fitBounds(results[0].geometry.viewport);
			// Dibujamos un marcador con la ubicación del primer resultado obtenido
			var markerOptions = { position: results[0].geometry.location }
			var marker = new google.maps.Marker(markerOptions);
			marker.setMap(map);
		} else {
			// En caso de no haber resultados o que haya ocurrido un error
			// lanzamos un mensaje con el error
			alert("Geocoding no tuvo éxito debido a: " + status);
		}
	}

	function route(){
		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer;

		directionsDisplay.setMap(map);

		var inicio = document.getElementById("origen").value;
		var fin = document.getElementById("destino").value;

		var request = {
			origin: inicio,
			destination: fin,
			travelMode: "DRIVING"
		};

		directionsService.route(request, function(result, status){
			if (status == "OK"){
				directionsDisplay.setDirections(result);
			}
		})
	}

}